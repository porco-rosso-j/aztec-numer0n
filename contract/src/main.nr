mod types;
mod num_lib;

contract Numer0n {
    use dep::std;
    use dep::std::option::Option;
    use dep::aztec::{
        context::{PrivateContext, PublicContext, Context},
        state_vars::{
            map::Map, public_state::PublicState, singleton::Singleton,
        },
        oracle::debug_log::{
            debug_log,
            debug_log_field,
            debug_log_format
        },
        note::{
            note_header::NoteHeader,
            utils as note_utils,
        },
        selector::compute_selector,
        types::address::AztecAddress,
        types::type_serialization::{ // serialization methods for using booleans and field
            bool_serialization::{BoolSerializationMethods, BOOL_SERIALIZED_LEN},
            field_serialization::{FieldSerializationMethods, FIELD_SERIALIZED_LEN},
        },   
    };

    use dep::value_note::{
        value_note::{ValueNoteMethods, VALUE_NOTE_LEN},
    };

    use dep::authwit::{
        auth::{
            assert_current_call_valid_authwit, 
            assert_current_call_valid_authwit_public
        },
    };

    use crate::num_lib;
    use crate::types::{
        secret_num_note::{SecretNumberNote, SecretNumberNoteMethods, SECRET_NUM_NOTE_LEN},
        player::{PLAYER_SERIALIZED_LEN, Player, PlayerSerializationMethods},
        result::{RESULT_SERIALIZED_LEN, Result, ResultSerializationMethods},
    };

    // storage
    struct Storage {
        player: Map<PublicState<Player, PLAYER_SERIALIZED_LEN>>,
        secret_num: Map<Singleton<SecretNumberNote, SECRET_NUM_NOTE_LEN>>, // player one's secret num
        results_one: Map<PublicState<Result, RESULT_SERIALIZED_LEN>>, // epoch => Result: { eat, bite }
        results_two: Map<PublicState<Result, RESULT_SERIALIZED_LEN>>,
        epoch: PublicState<Field, FIELD_SERIALIZED_LEN>,
        is_first: PublicState<bool, BOOL_SERIALIZED_LEN>, // default false
    }

    impl Storage {
      fn init(context: Context) -> Self {
        Storage {
            player: Map::new(
                context,
                1,
                |context, slot| {
                    PublicState::new(
                        context,
                        slot,
                        PlayerSerializationMethods,
                    )
                },
            ),
            secret_num: Map::new(
                context,
                2,
                |context, slot| {
                    Singleton::new(
                        context, 
                        slot, 
                        SecretNumberNoteMethods,
                    )
               },
            ),     
            results_one: Map::new(
                context,
                3,
                |context, slot| {
                    PublicState::new(
                        context,
                        slot,
                        ResultSerializationMethods,
                    )
                },
            ),
            results_two: Map::new(
                context,
                4,
                |context, slot| {
                    PublicState::new(
                        context,
                        slot,
                        ResultSerializationMethods,
                    )
                },
            ),
            epoch: PublicState::new(
                context,
                5,
                FieldSerializationMethods,
            ),
            is_first: PublicState::new(
                context,
                6,
                BoolSerializationMethods,
            ),
        }
      }
    }

    // docs:start:constructor
    #[aztec(private)]
    fn constructor(player_one: Field, player_two: Field) {
        let selector = compute_selector("_initialize(Field,Field)");
        context.call_public_function(context.this_address(), selector, [player_one, player_two]);
    }

    #[aztec(private)]
    fn add_num(player: Field, secret_num:Field) {
        assert(context.msg_sender() == player, "invalid player");

        // check caller validitiy
        context.call_public_function(
            context.this_address(), 
            compute_selector("_assert_is_player(Field)"),
            [player]
        ); 

        num_lib::is_valid_nums(secret_num);

        let mut secret_num_note = SecretNumberNote::new(secret_num, player);
        storage.secret_num.at(player).initialize(
            &mut secret_num_note, 
            Option::some(secret_num_note.owner),
            true
        );
    }

    #[aztec(private)]
    fn call_num(player: AztecAddress, call_num:Field) {

        let player_address = player.address;

        context.call_public_function(
            context.this_address(), 
            compute_selector("_assert_invalid_caller(Field)"),
            [player_address]
        ); 

        num_lib::is_valid_nums(call_num);

        let secret_num_note: SecretNumberNote = storage.secret_num.at(player_address).get_note(true);
        let secret_num: Field = secret_num_note.secret_num;
        assert(secret_num != 0, "secret_num hasn't been set");

        let ret = num_lib::check_result(call_num, secret_num);

        // records results
        context.call_public_function(
            context.this_address(), 
            compute_selector("_record_result(Field,Field,Field,Field)"), 
            [player_address, call_num, ret[0], ret[1]]
        ); 

        // put here as this fails somehow if placed at the top.
        if (player_address != context.msg_sender()) {
            assert_current_call_valid_authwit(&mut context, player);
        }

    }

    #[aztec(public)]
    internal fn _record_result(_player: Field, call_num:Field, eat:Field, bite:Field) {
      let current_epoch: Field = storage.epoch.read();
      let player = storage.player.at(_player).read();
      let result = Result::new(call_num, eat, bite);

      if (player.player_id == 2) {
        storage.results_one.at(current_epoch).write(result);
        storage.is_first.write(false);
      } else if (player.player_id == 1) {
        storage.results_two.at(current_epoch).write(result);
        storage.is_first.write(true);
        storage.epoch.write(current_epoch + 1);
      }
    }

    #[aztec(public)]
    internal fn _assert_invalid_caller(_player: Field) {
        let player = storage.player.at(_player).read();
        
        if ((player.is_player) & (player.player_id == 1)) {
            assert(!storage.is_first.read(), "invalid turn: player 1");
        } else if ((player.is_player) & (player.player_id == 2)) {
            assert(storage.is_first.read(), "invalid turn: player 2");
        } else {
            assert(false, "invalid caller");
        }
    }

    #[aztec(public)]
    internal fn _assert_is_player(_player: Field) {
        let mut player = storage.player.at(_player).read();
        assert(player.is_player, "not player");
        assert(!player.has_number, "num has already been added");

        player.has_number = true;

        storage.player.at(_player).write(player);
    }

    #[aztec(public)]
    internal fn _initialize(player_one: Field, player_two: Field) {
        assert((player_one != player_two) & (player_one != 0) & (player_two != 0), "invalid player addresses");

        let _player_one = Player::new(1, true, false);
        let _player_two = Player::new(2, true, false);

        storage.player.at(player_one).write(_player_one);
        storage.player.at(player_two).write(_player_two);

        storage.epoch.write(0);
        storage.is_first.write(true);
    }

    unconstrained fn get_player(player: Field) -> Player {
        storage.player.at(player).read()
    }

    unconstrained fn get_player_secret_num(player: Field) -> Field {
        let note = storage.secret_num.at(player).view_note();
        note.secret_num
    }

    unconstrained fn get_result(player: Field, epoch: Field) -> Result {
       let player = storage.player.at(player).read();
       let mut result = Result::new(0, 0, 0);

       if (player.player_id == 1) {
           result = storage.results_one.at(epoch).read();
       } else {
           result = storage.results_two.at(epoch).read();
       }

       result
    }

    unconstrained fn get_epoch() -> Field {
        storage.epoch.read()
    }

    unconstrained fn get_is_first() -> bool {
        storage.is_first.read()
    }

    unconstrained fn check_result(
        call_num: Field, 
        secret_num: Field
    ) -> [Field;2] {
        num_lib::_check_result(call_num, secret_num)
    }

    unconstrained fn is_valid_nums(_num: Field) {
        num_lib::_is_valid_nums(_num);
    }

    unconstrained fn compute_note_hash_and_nullifier(contract_address: Field, nonce: Field, storage_slot: Field, serialized_note: [Field; SECRET_NUM_NOTE_LEN]) -> [Field; 4] {
        let note_header = NoteHeader::new(contract_address, nonce, storage_slot);
        note_utils::compute_note_hash_and_nullifier(SecretNumberNoteMethods, note_header, serialized_note)
    }
}
