#[cfg(test)]
mod tests {
    use cosmwasm_std::testing::{mock_dependencies, mock_env, mock_info};
    use cosmwasm_std::{coins, from_binary, Coin, Deps, DepsMut};

    use crate::state::Config;

    fn mock_init(deps: DepsMut) {
        let msg = InstantiateMsg {
            admin: "creator".to_string()
        };

        let info = mock_info("creator", &coins(2, "token"));
        let _res = instantiate(deps, mock_env(), info, msg)
            .expect("contract successfully handles InstantiateMsg");
    }

    #[test]
    fn proper_init() {
        let mut deps = mock_dependencies();

        mock_init(deps.as_mut());

        assert_config_state(
            deps.as_ref(),
            Config {
                admin: "creator".to_string()
            },
        );
    }

}
