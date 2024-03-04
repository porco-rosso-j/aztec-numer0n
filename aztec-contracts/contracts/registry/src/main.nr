contract Registry {
    use dep::aztec::{
        context::{PrivateContext, PublicContext, Context},
        state_vars::{map::Map,  public_state::PublicState},
        protocol_types::address::AztecAddress,
    };

    struct Storage {
        games: Map<Field, PublicState<Field>>,
        count: PublicState<Field>
    }

    impl Storage {
      fn init(context: Context) -> Self {
        Storage {
            games: Map::new(
                context,
                1,
                |context, slot| {
                    PublicState::new(
                        context,
                        slot
                    )
                },
            ),
            count: PublicState::new(
                context,
                2
            ),
        }
      }
    }
    
    // docs:start:constructor
    #[aztec(private)]
    fn constructor() {}

    #[aztec(public)]
    fn add_game(game_address: Field) -> pub Field { 
        let new_game_count = storage.count.read() + 1;  
        storage.games.at(new_game_count).write(game_address);
        storage.count.write(new_game_count);
        get_current_count()

    }
    unconstrained fn get_current_count() -> pub Field {
        storage.count.read()
    }

    unconstrained fn get_game_address(count: Field) -> pub Field {
        storage.games.at(count).read()
    }

    unconstrained fn get_latest_game_address() -> pub Field {
        let current_count: Field = get_current_count();
        get_game_address(current_count)
    }

    unconstrained fn compute_note_hash_and_nullifier(contract_address: AztecAddress, nonce: Field, storage_slot: Field, note_type_id: Field, preimage: [Field; 0]) -> pub [Field; 4] {
        [0, 0, 0, 0]
    }
}
