mod types;
// mod lib;
mod item_lib;
mod num_lib;

contract Numer0n {
    use dep::std;
    use dep::std::option::Option;
    use dep::aztec::{
        context::{PrivateContext, PublicContext, Context},
        state_vars::{
            map::Map, public_state::PublicState, singleton::Singleton, immutable_singleton::ImmutableSingleton,
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

    use dep::authwit::{
        auth::{
            assert_current_call_valid_authwit, 
            assert_current_call_valid_authwit_public
        },
    };

    use dep::field_note::field_note::{FieldNote, FieldNoteMethods, FIELD_NOTE_LEN};

    use crate::num_lib;
    use crate::item_lib;

    use crate::types::{
        secret_num_note::{SecretNumberNote, SecretNumberNoteMethods, SECRET_NUM_NOTE_LEN},
        player::{PLAYER_SERIALIZED_LEN, Player, PlayerSerializationMethods},
        result::{RESULT_SERIALIZED_LEN, Result, ResultSerializationMethods},
        game::{GAME_SERIALIZED_LEN, Game, GameSerializationMethods},
    };

    global SECRET_NUM_SLOT = 2;
    global GAME_ID_SLOT = 5;

    // storage
    struct Storage {
        players: Map<PublicState<Player, PLAYER_SERIALIZED_LEN>>,
        secret_num: Map<Singleton<SecretNumberNote, SECRET_NUM_NOTE_LEN>>, 
        results_one: Map<PublicState<Result, RESULT_SERIALIZED_LEN>>, // round => Result: { eat, bite }
        results_two: Map<PublicState<Result, RESULT_SERIALIZED_LEN>>,
        game_id: ImmutableSingleton<FieldNote, FIELD_NOTE_LEN>,
        game: PublicState<Game, GAME_SERIALIZED_LEN>,
    }

    impl Storage {
      fn init(context: Context) -> Self {
        Storage {
            players: Map::new(
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
                SECRET_NUM_SLOT,
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
            game_id: ImmutableSingleton::new(
                context,
                GAME_ID_SLOT,
                FieldNoteMethods,
            ),
            game: PublicState::new(
                context,
                6,
                GameSerializationMethods,
            ),
        }
      }
    }
    
    // docs:start:constructor
    #[aztec(private)]
    fn constructor(game_id: Field, player: Field) {
        assert(game_id != 0, "invalid game_id:zero");
        let mut game_id_note = FieldNote::new(game_id);
        storage.game_id.initialize(&mut game_id_note, Option::none(), false);

        let selector = compute_selector("_add_player(Field,Field)");
        context.call_public_function(context.this_address(), selector, [player, 1]);
    }

    #[aztec(private)]
    fn join_game(game_id: Field, player:Field) {
         assert(game_id != 0, "invalid game_id:zero");
        let game_id_note = storage.game_id.get_note();
        assert(game_id == game_id_note.value, "invalid game_id");

        context.call_public_function(
            context.this_address(), 
            compute_selector("_add_player(Field,Field)"),
            [player, 2]
        ); 
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

       context.call_public_function(
            context.this_address(), 
            compute_selector("_add_num(Field)"),
            [player]
        ); 

    }

    #[aztec(private)]
    fn call_num(target: AztecAddress, call_num:Field) {

        let target_address: Field = target.address;

        // replaced if-else with assert as it leads to an errror at get_note()
        assert(target_address != context.msg_sender(), "caller shouldn't be target");
        assert_current_call_valid_authwit(&mut context, target);

        // context.call_public_function(
        //     context.this_address(), 
        //     compute_selector("_assert_invalid_caller(Field)"),
        //     [context.msg_sender()]
        // ); 

        let secret_num_note: SecretNumberNote = storage.secret_num.at(target_address).get_note(true);
        let secret_num: Field = secret_num_note.secret_num;

        num_lib::is_valid_nums(call_num);
        let result = num_lib::check_result(call_num, secret_num);

        // records results
        context.call_public_function(
            context.this_address(), 
            compute_selector("_record_result(Field,Field,Field,Field)"), 
            [context.msg_sender(), call_num, result[0], result[1]]
        ); 
    }

   #[aztec(private)]
    fn use_item(target: AztecAddress, item_type: Field) {
        
        let target_address: Field = target.address;
        assert(target_address != context.msg_sender(), "caller shouldn't be target");
        assert_current_call_valid_authwit(&mut context, target);

        // context.call_public_function(
        //     context.this_address(), 
        //     compute_selector("_assert_invalid_caller(Field)"),
        //     [context.msg_sender()]
        // ); 

        let mut result: Field = 0;
        if (item_type == item_lib::ITEM_HIGH_LOW) {
            result = item_lib::get_high_and_low(storage.secret_num.at(target_address));
        // } else if (item_type == item_lib::ITEM_SLASH) {
        // } else if (item_type == item_lib::ITEM_TARGET) {
        // } else if (item_type == item_lib::ITEM_CHANGE) {
        // } else if (item_type == item_lib::ITEM_SHUFFLE) {
        } else {
            assert(false, "inavlid item type");
        }

        // records results
        context.call_public_function(
            context.this_address(), 
            compute_selector("_record_item_result(Field,Field,Field)"), 
            [context.msg_sender(), item_type, result]
        ); 
    }

    #[aztec(public)]
    internal fn _record_item_result(_caller: Field, _item_type:Field, _item_result:Field) {
         assert(!storage.game.read().finished, "game has already been finished");
         let player_id = storage.players.at(_caller).read().player_id;
         let mut game = storage.game.read(); 
         let current_round = game.round;

         if (player_id == 1) {
            assert(game.is_first, "invalid turn for player 1");
            let mut result_one = storage.results_one.at(current_round).read();
            assert(result_one.call_num == 0, "item should be used before call");
            assert(result_one.item == 0, "an item has already been used");
            result_one.item = _item_type;
            result_one.item_result = _item_result;
            storage.results_one.at(current_round).write(result_one);

         } else if (player_id == 2) {
            assert(!game.is_first, "invalid turn for player 2");
            let mut result_two = storage.results_two.at(current_round).read();
            assert(result_two.call_num == 0, "item should be used before call");
            assert(result_two.item == 0, "an item has already been used");
            result_two.item = _item_type;
            result_two.item_result = _item_result;
            storage.results_two.at(current_round).write(result_two);
         } else {
            assert(false, "invalid player");
         }
    }

    // public state read count: 18
    #[aztec(public)]
    internal fn _record_result(_caller: Field, _call_num:Field, _eat:Field, _bite:Field) {
      assert(!storage.game.read().finished, "game has already been finished");
      let player_id = storage.players.at(_caller).read().player_id; // 2 or 1
      let mut result = Result::new(_call_num, _eat, _bite, 0, 0);

      let mut game = storage.game.read(); // 8 or 2
      let current_round = game.round;

      
      if (player_id == 1) {
         assert(game.is_first, "invalid turn for player 1");
        let result_one = storage.results_one.at(current_round).read(); // 5 or 3 or 1
        result.item = result_one.item;
        result.item_result = result_one.item_result;

        storage.results_one.at(current_round).write(result);

        game.is_first = false;
        storage.game.write(game);

      } else if (player_id == 2) {
        assert(!game.is_first, "invalid turn for player 2");
        let result_two = storage.results_two.at(current_round).read(); // 5 or 2
        result.item = result_two.item;
        result.item_result = result_two.item_result;

        storage.results_two.at(current_round).write(result);

        // check if either of the players win
        let one_eat = storage.results_one.at(current_round).read().eat; 
        if ((_eat == 3) | (one_eat == 3)) {
           game.finished = true;
        } else {
           game.is_first = true;
           game.round = current_round + 1;
        }
        storage.game.write(game);
      } else {
        assert(false, "invalid player");
      }
    }

    // // public state read count: 4
    // #[aztec(public)]
    // internal fn _assert_invalid_caller(_caller: Field) {
    //     assert(storage.game.read().started, "game hasn't been started yet");

    //     let player = storage.players.at(_caller).read();
    //     let is_first = storage.game.read().is_first;
        
    //     if ((player.is_player) & (player.player_id == 1)) {
    //         assert(is_first, "invalid turn for player 1");
    //     } else if ((player.is_player) & (player.player_id == 2)) {
    //         assert(!is_first, "invalid turn for player 2");
    //     } else {
    //         assert(false, "invalid player");
    //     }
    // }

    #[aztec(public)]
    internal fn _assert_is_player(_player: Field) {
        assert(storage.players.at(_player).read().is_player, "not player");
    }

    #[aztec(public)] 
    internal fn _add_player(_player:Field, _player_id: Field) {
        assert(!storage.game.read().started, "game has already been started");
        assert(_player != 0, "invalid player address");

        let mut player = storage.players.at(_player).read();
        assert(!player.is_player, "player already exists");

        player.player_id = _player_id;
        player.is_player = true;

        storage.players.at(_player).write(player);

        // add player addrs into game
        let mut game = storage.game.read();
        game.players[_player_id - 1] = _player;
        storage.game.write(game);
    }

    #[aztec(public)] 
    internal fn _add_num(_player:Field) {
        assert(!storage.game.read().started, "game has already started");

        let player = storage.players.at(_player).read();
        let mut game = storage.game.read();

        if (player.player_id == 1) {
            assert(!game.is_number_set[0], "num 1 already has been set");
            game.is_number_set[0] = true;
        } else {
            assert(!game.is_number_set[1], "num 2 already has been set");
            game.is_number_set[1] = true;
        }

        if ((game.is_number_set[0]) & (game.is_number_set[1])) {
            game.round = 1;
            game.is_first = true;
            game.started = true;
        }

        storage.game.write(game);
    }

    unconstrained fn get_player(player: Field) -> Player {
        storage.players.at(player).read()
    }

    unconstrained fn get_winner() -> Field {        
        let current_round = storage.game.read().round;
        let latest_result_one = storage.results_one.at(current_round).read();
        let latest_result_two = storage.results_two.at(current_round).read();

        if (!storage.game.read().finished) {
            0
        } else if ((latest_result_one.eat == 3) & (latest_result_two.eat != 3)) {
            1
        } else if ((latest_result_one.eat != 3) & (latest_result_two.eat == 3)) {
            2
        } else {
            3 // draw
        }

    }

    // for testing purpose
    // q: how to only allow note an owner to view her own secret num
    unconstrained fn get_secret_num(player: Field) -> Field {
        let note = storage.secret_num.at(player).view_note();
        note.secret_num
    }

    unconstrained fn get_result(player: Field, round: Field) -> Result {
       let player = storage.players.at(player).read();
       let mut result = Result::new(0, 0, 0, 0, 0);

       if (player.player_id == 1) {
           result = storage.results_one.at(round).read();
       } else {
           result = storage.results_two.at(round).read();
       }

       result
    }

    unconstrained fn get_round() -> Field {
        storage.game.read().round
    }

    unconstrained fn get_is_first() -> bool {
        storage.game.read().is_first
    }

    unconstrained fn get_is_started() -> bool {
        storage.game.read().started
    }

    unconstrained fn get_is_finished() -> bool {
       storage.game.read().finished
    }

    // for testing purpose
    unconstrained fn get_high_and_low(num:Field) -> Field {
        item_lib::_get_high_and_low(num)
    }

    unconstrained fn get_game() -> Game {
        storage.game.read()
    }

    unconstrained fn check_result(
        call_num: Field, 
        secret_num: Field
    ) -> [Field;2] {
        num_lib::_check_result(call_num, secret_num)
    }

    unconstrained fn is_valid_nums(_num: Field) -> [u16;3] {
        num_lib::_is_valid_nums(_num)
    }

    unconstrained fn compute_note_hash_and_nullifier(contract_address: Field, nonce: Field, storage_slot: Field, serialized_note: [Field; SECRET_NUM_NOTE_LEN]) -> [Field; 4] {
        let note_header = NoteHeader::new(contract_address, nonce, storage_slot);
        if (storage_slot == GAME_ID_SLOT) {
            note_utils::compute_note_hash_and_nullifier(FieldNoteMethods, note_header, serialized_note)
        } else {
            // should derive storage slot for mapped values correctly
            // https://github.com/AztecProtocol/aztec-packages/blob/2db2e2a3091e2552f8e8055d1bc07bd5016455ff/yarn-project/aztec-nr/aztec/src/state_vars/map.nr#L32C1-L32C1
            note_utils::compute_note_hash_and_nullifier(SecretNumberNoteMethods, note_header, serialized_note)
        }
    }
}
