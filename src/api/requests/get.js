import {CosmWasmClient} from "@cosmjs/cosmwasm-stargate";
import {ChainInfo} from "../chain-info";
import {CONTRACT_ADDRESS} from "../config";

async function initQueryHandler(){
    let cwClient = await CosmWasmClient.connect(ChainInfo.rpc);
    return cwClient.queryClient.wasm.queryContractSmart
}

export async function getID(address){
    try {
        let queryHandler = await initQueryHandler()
        let entrypoint = {
            get_address_record: {
                address: address
            }
        };
        const res = await queryHandler(CONTRACT_ADDRESS, entrypoint);
        return res.name
    }catch (e) {
        console.log("getId error:", e)
        return "error"
    }
}

export async function getName(name){
    try {
        let queryHandler = await initQueryHandler()
        let entrypoint = {
            get_name_record: {
                name: name
            }
        };
        const res = await queryHandler(CONTRACT_ADDRESS, entrypoint);
        return res.record
    }catch (e) {
        console.log("getId error:", e)
        return "error"
    }
}

export async function getAllQuests(quests){
    let tasks = []
    for (let qid of quests){
        tasks.push(getQuestName(qid))
    }
    let q = await Promise.all(tasks)
    console.log(q)
    return q
}

export async function getQuestName(quest_id){
    try {
        let queryHandler = await initQueryHandler()
        let entrypoint = {
            get_quest_info: {
                quest_id
            }
        };
        const res = await queryHandler(CONTRACT_ADDRESS, entrypoint);
        let r = res.quest
        return r
    }catch (e) {
        console.log("getId error:", e)
        return "error"
    }
}
