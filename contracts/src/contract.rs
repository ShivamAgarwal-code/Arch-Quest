use cosmwasm_std::{
    entry_point, to_binary, Binary, Deps, DepsMut, Env, MessageInfo, Response, StdError, StdResult,
};

use crate::error::ContractError;
use crate::msg::{ExecuteMsg, InstantiateMsg, QueryMsg, ResolveNameRecordResponse, ResolveAddressRecordResponse, QuestResponse};
use crate::state::{config, config_read, entity, entity_read, Config, EntityRecord, entity_address, entity_address_read, EntityAddressRecord, Quest, quest_read, quest};

const MIN_NAME_LENGTH: u64 = 1;
const MAX_NAME_LENGTH: u64 = 32;

#[cfg_attr(not(feature = "library"), entry_point)]
pub fn instantiate(
    deps: DepsMut,
    _env: Env,
    _info: MessageInfo,
    msg: InstantiateMsg,
) -> Result<Response, StdError> {
    let config_state = Config {
        admin: deps.api.addr_validate(&msg.admin)?.into_string(),
    };
    config(deps.storage).save(&config_state)?;
    Ok(Response::default())
}

#[cfg_attr(not(feature = "library"), entry_point)]
pub fn execute(
    deps: DepsMut,
    env: Env,
    info: MessageInfo,
    msg: ExecuteMsg,
) -> Result<Response, ContractError> {
    match msg {
        ExecuteMsg::Register { name, is_dao, description } => execute_register(deps, env, info, name, is_dao, description),
        ExecuteMsg::UpdateDescription { name, new_description } => execute_description(deps, env, info, name,  new_description),
        ExecuteMsg::UpdateImage { name, new_image } => execute_image(deps, env, info, name,  new_image),
        ExecuteMsg::CreateQuest {  dao_name, quest_name, quest_description  } => execute_create_quest(deps, env, info, dao_name, quest_name, quest_description),
        ExecuteMsg::UpdateQuestAllowlist { dao_name, quest_id, user_name } => execute_add_address(deps, env, info, dao_name, quest_id, user_name)
    }
}

pub fn execute_register(
    deps: DepsMut,
    _env: Env,
    info: MessageInfo,
    name: String,
    is_dao: bool,
    description: String,
) -> Result<Response, ContractError> {
    validate_name(&name)?;
    let name_b = name.clone();
    let key = name.as_bytes();
    let key_addr = info.sender.as_bytes();
    if (entity(deps.storage).may_load(key)?).is_some() {
        return Err(ContractError::NameTaken { name });
    }
    if (entity_address(deps.storage).may_load(key_addr)?).is_some() {
        return Err(ContractError::AddressHasName { name });
    }

    let record = EntityRecord {
        owner: info.sender.clone(),
        is_dao,
        description,
        image: "".to_string(),
        quests: Vec::new(),
    };
    entity(deps.storage).save(key, &record)?;
    entity_address(deps.storage).save(key_addr, &EntityAddressRecord{ name: name_b })?;
    Ok(Response::default())
}

pub fn execute_description(
    deps: DepsMut,
    _env: Env,
    info: MessageInfo,
    name: String,
    new_description: String
) -> Result<Response, ContractError> {
    let key = name.as_bytes();
    entity(deps.storage).update(key, |record| {
        if let Some(mut record) = record {
            if info.sender != record.owner {
                return Err(ContractError::Unauthorized {});
            }
            record.description = new_description;
            Ok(record)
        } else {
            Err(ContractError::Unauthorized {})
        }
    })?;
    Ok(Response::default())
}

pub fn execute_image(
    deps: DepsMut,
    _env: Env,
    info: MessageInfo,
    name: String,
    new_image: String
) -> Result<Response, ContractError> {
    let key = name.as_bytes();
    entity(deps.storage).update(key, |record| {
        if let Some(mut record) = record {
            if info.sender != record.owner {
                return Err(ContractError::Unauthorized {});
            }
            record.image = new_image;
            Ok(record)
        } else {
            Err(ContractError::Unauthorized {})
        }
    })?;
    Ok(Response::default())
}

pub fn execute_create_quest(
    deps: DepsMut,
    _env: Env,
    info: MessageInfo,
    dao_name: String,
    quest_name: String,
    quest_description: String
) -> Result<Response, ContractError> {
    let key = dao_name.as_bytes();
    let mut id= 0;
    entity(deps.storage).update(key, |record| {
        if let Some(mut record) = record {
            if info.sender != record.owner {
                return Err(ContractError::Unauthorized {});
            }
            if !record.is_dao {
                return Err(ContractError::NotDao {});
            }
            id = record.quests.len() + 1;
            let quest_id = format!("{}-{}", dao_name, (record.quests.len() + 1));
            record.quests.push(quest_id.clone());
            Ok(record)
        } else {
            Err(ContractError::Unauthorized {})
        }
    })?;
    let qid = format!("{}-{}", dao_name, id);
    quest(deps.storage).save(qid.as_bytes(), &Quest{
        id: qid.clone(),
        name: quest_name,
        description: quest_description
    })?;
    Ok(Response::default())
}

pub fn execute_add_address(
    deps: DepsMut,
    _env: Env,
    info: MessageInfo,
    dao_name: String,
    quest_id: String,
    user_name: String
) -> Result<Response, ContractError> {
    let key = dao_name.as_bytes();
    let record = entity(deps.storage).may_load(key)?;
    let quest_id = format!("{}-{}", dao_name, quest_id);
    let key_quest = quest_id.as_bytes();

    if record.clone().is_some() {
        if info.sender != record.clone().unwrap().owner {
            return Err(ContractError::Unauthorized {});
        }
        if !record.clone().unwrap().is_dao {
            return Err(ContractError::NotDao {});
        }
    } else {
        return Err(ContractError::Unauthorized {});
    }
    if quest(deps.storage).may_load(key_quest)?.is_none(){
        return Err(ContractError::QuestNotExist {quest_id});
    }
    let key_name = user_name.as_bytes();
    entity(deps.storage).update(key_name, |user_record| {
        if let Some(mut user_record) = user_record {
            if user_record.is_dao{
                return Err(ContractError::IsDao {});
            }
            if user_record.quests.iter().any(|q| *q == quest_id){
                return Err(ContractError::QuestAlreadyCompleted {});
            }
            user_record.quests.push(quest_id);
            Ok(user_record)
        } else {
            Err(ContractError::Unauthorized {})
        }
    })?;

    Ok(Response::default())
}


#[cfg_attr(not(feature = "library"), entry_point)]
pub fn query(deps: Deps, env: Env, msg: QueryMsg) -> StdResult<Binary> {
    match msg {
        QueryMsg::GetNameRecord { name } => query_name_resolver(deps, env, name),
        QueryMsg::GetAddressRecord { address } => query_address_resolver(deps, env, address),
        QueryMsg::GetQuestInfo { quest_id } => query_quest_info(deps, env, quest_id),
        QueryMsg::Config {} => to_binary(&config_read(deps.storage).load()?),
    }
}

fn query_name_resolver(deps: Deps, _env: Env, name: String) -> StdResult<Binary> {
    let key = name.as_bytes();
    let cur_entity =  entity_read(deps.storage).may_load(key)?;
    let resp = ResolveNameRecordResponse {
        record: cur_entity
    };
    to_binary(&resp)
}

fn query_address_resolver(deps: Deps, _env: Env, address: String) -> StdResult<Binary> {
    let key = address.as_bytes();
    let cur_entity = match entity_address_read(deps.storage).may_load(key)? {
        Some(entity) => Some(entity.name),
        None => None
    };
    let resp = ResolveAddressRecordResponse {
        name: cur_entity
    };
    to_binary(&resp)
}

fn query_quest_info(deps: Deps, _env: Env, quest_id: String) -> StdResult<Binary> {
    let key = quest_id.as_bytes();
    let quest_obj = quest_read(deps.storage).may_load(key)?;
    let resp = QuestResponse {
        quest: quest_obj
    };
    to_binary(&resp)
}

fn invalid_char(c: char) -> bool {
    let is_valid = c.is_digit(10) || c.is_ascii_lowercase();
    !is_valid
}

fn validate_name(name: &str) -> Result<(), ContractError> {
    let length = name.len() as u64;
    if (name.len() as u64) < MIN_NAME_LENGTH {
        Err(ContractError::NameTooShort {
            length,
            min_length: MIN_NAME_LENGTH,
        })
    } else if (name.len() as u64) > MAX_NAME_LENGTH {
        Err(ContractError::NameTooLong {
            length,
            max_length: MAX_NAME_LENGTH,
        })
    } else {
        match name.find(invalid_char) {
            None => Ok(()),
            Some(bytepos_invalid_char_start) => {
                let c = name[bytepos_invalid_char_start..].chars().next().unwrap();
                Err(ContractError::InvalidCharacter { c })
            }
        }
    }
}
