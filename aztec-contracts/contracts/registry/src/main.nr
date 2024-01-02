
contract Regisry {
    use dep::std::option::Option;
    use dep::aztec::{
        context::{PrivateContext, PublicContext, Context},
        state_vars::{map::Map,  public_state::PublicState},
        types::type_serialization::{ // serialization methods for using booleans and field
            bool_serialization::{BoolSerializationMethods, BOOL_SERIALIZED_LEN},
            field_serialization::{FieldSerializationMethods, FIELD_SERIALIZED_LEN},
        },   
    };

    // storage
    struct Storage {
        games: Map<PublicState<Field, FIELD_SERIALIZED_LEN>>,
        count: PublicState<Field, FIELD_SERIALIZED_LEN>
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
                        slot,
                        FieldSerializationMethods,
                    )
                },
            ),
            count: PublicState::new(
                context,
                2,
                FieldSerializationMethods,
            ),
        }
      }
    }
    
    // docs:start:constructor
    #[aztec(private)]
    fn constructor() {}

    #[aztec(public)]
    fn add_game(game_address: Field) -> Field { 
        let new_game_count = storage.count.read() + 1;  
        storage.games.at(new_game_count).write(game_address);
        storage.count.write(new_game_count);
    }
    unconstrained fn get_current_count() -> Field {
        storage.count.read()
    }

    unconstrained fn get_game_address(count: Field) -> Field {
        storage.games.at(count).read()
    }

    unconstrained fn get_latest_game_address() -> Field {
        let current_count: Field = get_current_count();
        get_game_address(current_count)
    }

    unconstrained fn compute_note_hash_and_nullifier(contract_address: Field, nonce: Field, storage_slot: Field, serialized_note: [Field; 0]) -> [Field; 4] {
        [0, 0, 0, 0]
    }
}
