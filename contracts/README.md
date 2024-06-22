## Questarch smart contract

#### https://questarch.github.io
Questarch is a platform for creating decentralized social profiles, where users can find various DAOs, view their own completed achievements and quests, send comments to their friends and customize profiles using their NFTs.

Also Questarch is a great quest platform for building DAO community, because DAO will be able to create quest with any requirements(follow on twitter, on-chain actions, etc.) and then just update the allowlist using our API.


### Build, deploy, and instantiate smart contract
```bash
archway build
archway deploy
archway instantiate --args '{"admin": "<ENTER_YOUR_ADDRESS>"}'
```

### Wallet#1 (personal ID)

#### Register new personal ID
```bash
archway tx --args '{ "register": {"name": "alex", "is_dao": false, "description": "My ID"}}' --flags --gas 300000
```

#### Update description
```bash
archway tx --args '{ "update_description": {"name": "alex", "new_description": "test account"}}' --flags --gas 300000
```

#### Query smart contract
```bash
archway query contract-state smart --contract archway19vfdav0gfa0p5epklug9hy63a6twjnsm9sqqff9ym0892pwp906q2mtmde --args '{ "get_name_record": {"name": "alex" } }'
archway query contract-state smart --contract archway19vfdav0gfa0p5epklug9hy63a6twjnsm9sqqff9ym0892pwp906q2mtmde --args '{ "get_address_record": {"address": "<ENTER_YOUR_ADDRESS>" } }'
```

### Wallet#2 (DAO ID)

#### Register DAO ID
```bash
archway tx --args '{ "register": {"name": "mydao", "is_dao": true, "description": "First Test DAO for creating quests"}}' --flags --gas 300000
```

#### Create quests
```bash
archway tx --args '{ "create_quest": {"dao_name": "mydao", "quest_name": "Quest#1", "quest_description": "Make swap using any Archway DEX"}}' --flags --gas 300000
archway tx --args '{ "create_quest": {"dao_name": "mydao", "quest_name": "Quest#2", "quest_description": "Follow twitter account: test"}}' --flags --gas 300000
```

#### Update allowlist of Quest#2
```bash
archway tx --args '{ "update_quest_allowlist": {"dao_name": "mydao", "quest_id": "2", "user_name": "alex"}}' --flags --gas 300000
```
