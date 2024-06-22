use schemars::JsonSchema;
use serde::{Deserialize, Serialize};

use cosmwasm_std::{Addr, Storage};
use cosmwasm_storage::{
    bucket, bucket_read, singleton, singleton_read, Bucket, ReadonlyBucket, ReadonlySingleton,
    Singleton,
};

pub static ENTITY_RESOLVER_KEY: &[u8] = b"entity";
pub static ENTITY_ADDRESS_RESOLVER_KEY: &[u8] = b"entity_address";
pub static QUEST_RESOLVER_KEY: &[u8] = b"quest";
pub static CONFIG_KEY: &[u8] = b"config";

#[derive(Serialize, Deserialize, Clone, Debug, PartialEq, JsonSchema)]
pub struct Config {
    pub admin: String
}

pub fn config(storage: &mut dyn Storage) -> Singleton<Config> {
    singleton(storage, CONFIG_KEY)
}

pub fn config_read(storage: &dyn Storage) -> ReadonlySingleton<Config> {
    singleton_read(storage, CONFIG_KEY)
}

#[derive(Serialize, Deserialize, Clone, Debug, PartialEq, JsonSchema)]
pub struct EntityRecord {
    pub owner: Addr,
    pub is_dao: bool,
    pub description: String,
    pub image: String,
    pub quests: Vec<String>
}

pub fn entity(storage: &mut dyn Storage) -> Bucket<EntityRecord> {
    bucket(storage, ENTITY_RESOLVER_KEY)
}

pub fn entity_read(storage: &dyn Storage) -> ReadonlyBucket<EntityRecord> {
    bucket_read(storage, ENTITY_RESOLVER_KEY)
}

#[derive(Serialize, Deserialize, Clone, Debug, PartialEq, JsonSchema)]
pub struct EntityAddressRecord {
    pub name: String,
}

pub fn entity_address(storage: &mut dyn Storage) -> Bucket<EntityAddressRecord> {
    bucket(storage, ENTITY_ADDRESS_RESOLVER_KEY)
}

pub fn entity_address_read(storage: &dyn Storage) -> ReadonlyBucket<EntityAddressRecord> {
    bucket_read(storage, ENTITY_ADDRESS_RESOLVER_KEY)
}

#[derive(Serialize, Deserialize, Clone, Debug, PartialEq, JsonSchema)]
pub struct Quest {
    pub id: String,
    pub name: String,
    pub description: String
}

pub fn quest(storage: &mut dyn Storage) -> Bucket<Quest> {
    bucket(storage, QUEST_RESOLVER_KEY)
}

pub fn quest_read(storage: &dyn Storage) -> ReadonlyBucket<Quest> {
    bucket_read(storage, QUEST_RESOLVER_KEY)
}
