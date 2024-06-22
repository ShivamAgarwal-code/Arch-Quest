import {calculateFee} from "@cosmjs/stargate";
import {CONTRACT_ADDRESS} from "../config";

export async function registerName (userAddress, signingClient, gasPrice, userName, description, isDao) {
    let entrypoint = {
        register: {
            name: userName,
            is_dao: isDao,
            description: description
        }
    };
    let txFee = calculateFee(500000, gasPrice);

    try {
        let tx = await signingClient.execute(userAddress, CONTRACT_ADDRESS, entrypoint, txFee);
        return true
    } catch (e) {
        console.log('Error');
        return e.toString()
    }
}

export async function updateStatus(userAddress, signingClient, gasPrice, userName, description) {
    let entrypoint = {
        update_description: {
            name: userName,
            new_description: description
        }
    };
    let txFee = calculateFee(500000, gasPrice);

    try {
        let tx = await signingClient.execute(userAddress, CONTRACT_ADDRESS, entrypoint, txFee);
        return true
    } catch (e) {
        console.log('Error', e);
        return null
    }
}

export async function createQuest(userAddress, signingClient, gasPrice, daoName, questName, quest_description) {
    let entrypoint = {
        create_quest: {
            dao_name: daoName,
            quest_name: questName,
            quest_description
        }
    };
    let txFee = calculateFee(500000, gasPrice);

    try {
        let tx = await signingClient.execute(userAddress, CONTRACT_ADDRESS, entrypoint, txFee);
        return true
    } catch (e) {
        console.log('Error', e);
        return null
    }
}

export async function updateAllowlist(userAddress, signingClient, gasPrice, daoName, questId, userName) {
    let entrypoint = {
        update_quest_allowlist: {
            dao_name: daoName,
            quest_id: questId,
            user_name: userName
        }
    };
    let txFee = calculateFee(500000, gasPrice);

    try {
        let tx = await signingClient.execute(userAddress, CONTRACT_ADDRESS, entrypoint, txFee);
        return true
    } catch (e) {
        console.log('Error', e);
        return null
    }
}
