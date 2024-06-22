use schemars::JsonSchema;
use serde::{Deserialize, Serialize};
use crate::state::{EntityRecord, Quest};


#[derive(Serialize, Deserialize, Clone, Debug, PartialEq, JsonSchema)]
pub struct InstantiateMsg {
    pub admin: String
}

#[derive(Serialize, Deserialize, Clone, Debug, PartialEq, JsonSchema)]
#[serde(rename_all = "snake_case")]
pub enum ExecuteMsg {
    Register {
        name: String,
        is_dao: bool,
        description: String
    },
    UpdateDescription {
        name: String,
        new_description: String
    },
    UpdateImage {
        name: String,
        new_image: String
    },
    CreateQuest {
        dao_name: String,
        quest_name: String,
        quest_description: String
    },
    UpdateQuestAllowlist {
        dao_name: String,
        quest_id: String,
        user_name: String
    }
}

#[derive(Serialize, Deserialize, Clone, Debug, PartialEq, JsonSchema)]
#[serde(rename_all = "snake_case")]
pub enum QueryMsg {
    GetNameRecord { name: String },
    GetAddressRecord { address: String },
    GetQuestInfo {quest_id: String},
    Config {},
}

#[derive(Serialize, Deserialize, Clone, Debug, PartialEq, JsonSchema)]
pub struct ResolveNameRecordResponse {
    pub record: Option<EntityRecord>
}

#[derive(Serialize, Deserialize, Clone, Debug, PartialEq, JsonSchema)]
pub struct ResolveAddressRecordResponse {
    pub name: Option<String>,
}

#[derive(Serialize, Deserialize, Clone, Debug, PartialEq, JsonSchema)]
pub struct QuestResponse {
    pub quest: Option<Quest>,
}
