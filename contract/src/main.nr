mod secret_num_note;
mod result;

contract Numer0n {
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
        types::type_serialization::{ // serialization methods for using booleans and field
            bool_serialization::{BoolSerializationMethods, BOOL_SERIALIZED_LEN},
            field_serialization::{FieldSerializationMethods, FIELD_SERIALIZED_LEN},
        },   
    };

    use dep::value_note::{
        value_note::{ValueNoteMethods, VALUE_NOTE_LEN},
    };

    use crate::secret_num_note::{
        SecretNumberNote, SecretNumberNoteMethods, SECRET_NUM_NOTE_LEN,
    };

    use crate::result::{RESULT_SERIALIZED_LEN, Result, ResultSerializationMethods};

    // storage
    struct Storage {
        player_one: Map<PublicState<bool, BOOL_SERIALIZED_LEN>>,
        player_two: Map<PublicState<bool, BOOL_SERIALIZED_LEN>>,
        secret_num_one: Singleton<SecretNumberNote, SECRET_NUM_NOTE_LEN>, // player one's secret num
        secret_num_two: Singleton<SecretNumberNote, SECRET_NUM_NOTE_LEN>, // player two's secret num
        results_one: Map<PublicState<Result, RESULT_SERIALIZED_LEN>>, // epoch => Result: { eat, bite }
        results_two: Map<PublicState<Result, RESULT_SERIALIZED_LEN>>,
        epoch: PublicState<Field, FIELD_SERIALIZED_LEN>,
        is_first: PublicState<bool, BOOL_SERIALIZED_LEN>, // default false
    }

    impl Storage {
      fn init(context: Context) -> Self {
        Storage {
            player_one: Map::new(
                context,
                1,
                |context, slot| {
                    PublicState::new(
                        context,
                        slot,
                        BoolSerializationMethods,
                    )
                },
            ),
            player_two: Map::new(
                context,
                2,
                |context, slot| {
                    PublicState::new(
                        context,
                        slot,
                        BoolSerializationMethods,
                    )
                },
            ),
            secret_num_one: Singleton::new(
                context, 
                3, 
                SecretNumberNoteMethods
            ),
            secret_num_two: Singleton::new(
                context, 
                4, 
                SecretNumberNoteMethods
            ),
            results_one: Map::new(
                context,
                5,
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
                6,
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
                7,
                FieldSerializationMethods,
            ),
            is_first: PublicState::new(
                context,
                8,
                BoolSerializationMethods,
            )
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
    fn add_num_one(player: Field, secret_num:Field) {
        assert(context.msg_sender() == player, "invalid player");

        // check caller validitiy
        context.call_public_function(
            context.this_address(), 
            compute_selector("_assert_is_player_one(Field)"),
            [player]
        ); 

        // validate nums
        context.call_private_function(
            context.this_address(),
            compute_selector("_is_valid_nums(Field)"), 
            [secret_num]
        ); 

        let mut secret_num_note = SecretNumberNote::new(secret_num, player);
        storage.secret_num_one.initialize(
            &mut secret_num_note, 
            Option::some(secret_num_note.owner),
            true
        );
    }

    #[aztec(private)]
    fn add_num_two(player: Field, secret_num:Field) {
        assert(context.msg_sender() == player, "invalid player");

        // check caller validitiy
        context.call_public_function(
            context.this_address(), 
            compute_selector("_assert_is_player_two(Field)"),
            [player]
        ); 

        // validate nums
        context.call_private_function(
            context.this_address(),
            compute_selector("_is_valid_nums(Field)"), 
            [secret_num]
        ); 

        let mut secret_num_note = SecretNumberNote::new(secret_num, player);
        storage.secret_num_two.initialize(
            &mut secret_num_note, 
            Option::some(secret_num_note.owner),
            true
        );
    }


    #[aztec(private)]
    fn call_num_one(player: Field, call_num:Field) {
        assert(context.msg_sender() == player, "invalid player");

        context.call_public_function(
            context.this_address(), 
            compute_selector("_assert_invalid_caller(Field)"),
            [player]
        ); 

        // validate nums
        context.call_private_function(
            context.this_address(),
            compute_selector("_is_valid_nums(Field)"), 
            [call_num]
        );

        let mut secret_nums: [Field;3] = [0;3]; 
        let secret_num_note: SecretNumberNote = storage.secret_num_one.get_note(true);
        let secret_num: Field = secret_num_note.secret_num;

        // check results
        let ret = context.call_private_function(
            context.this_address(),
            compute_selector("_check_result(Field,Field)"), 
            [call_num, secret_num]
        );
        
        // records results
        context.call_public_function(
            context.this_address(), 
            compute_selector("_record_result(Field,Field,Field,Field)"), 
            [2, call_num, ret[0], ret[1]]
        );      
    }

    #[aztec(private)]
    fn call_num_two(player: Field, call_num:Field) {

        context.call_public_function(
            context.this_address(), 
            compute_selector("_assert_invalid_caller(Field)"),
            [player]
        ); 

        // validate nums
        context.call_private_function(
            context.this_address(),
            compute_selector("_is_valid_nums(Field)"), 
            [call_num]
        );

        let mut secret_nums: [Field;3] = [0;3]; 
        let secret_num_note: SecretNumberNote = storage.secret_num_two.get_note(true);
        let secret_num: Field = secret_num_note.secret_num;

        // check results
        let ret = context.call_private_function(
            context.this_address(),
            compute_selector("_check_result(Field,Field)"), 
            [call_num, secret_num]
        );
        
        // records results
        context.call_public_function(
            context.this_address(), 
            compute_selector("_record_result(Field,Field,Field,Field)"), 
            [1, call_num, ret[0], ret[1]]
        );
    }

    #[aztec(private)]
    internal fn _check_result(
        _call_num: Field, 
        _secret_num: Field,
    ) -> [Field;2] {

        let mut call_num = _call_num as u8;
        let mut secret_num = _secret_num as u8;

        let mut modulus: u8 = 100;
        let mut call_nums: [u8;3] = [0;3];
        let mut secret_nums: [u8;3] = [0;3];

        for i in 0..2 {
            let subtractor = call_num - (call_num % modulus);
            call_nums[i] = subtractor / modulus;
            call_num = call_num - subtractor;
            modulus = modulus / 10;
        }

        modulus = 100;

        for i in 0..2 {
            let subtractor = secret_num - (secret_num % modulus);
            secret_nums[i] = subtractor / modulus;
            secret_num = secret_num - subtractor;
            modulus = modulus / 10;
        }


        let mut ret: [Field;2] = [0;2];

        for i in 0..call_nums.len() {
            
            for j in 0..secret_nums.len() {

                   if (i == j) & (call_nums[i] == secret_nums[j]) {
                      ret[0] = ret[0] + 1;
                   } 

                   if (i != j) & (call_nums[i] == secret_nums[j]) {
                      ret[1] = ret[1] + 1;
                   }
            }
        }

        ret
    }

    #[aztec(private)]
    internal fn _is_valid_nums(_num: Field) {

        let mut num = _num as u8;
        let mut modulus: u8 = 100;
        let mut nums: [u8;3] = [0;3];

        for i in 0..2 {
            let subtractor = num - (num % modulus);
            nums[i] = subtractor / modulus;
            num = num - subtractor;
            modulus = modulus / 10;
        }

        assert((nums[0] != nums[1]) & (nums[1] != nums[2]) & (nums[2] != nums[0]), "duplication not allowed");
        assert((nums[0] < 10) & (nums[1] < 10) & (nums[2] < 10), "nums should be less than 10");
    }

    #[aztec(public)]
    internal fn _record_result(player_id: Field, call_num:Field, eat:Field, bite:Field) {
      let current_epoch: Field = storage.epoch.read();
      let result = Result::new(call_num, eat, bite);

      if (player_id == 1) {
        storage.results_one.at(current_epoch).write(result);
        storage.is_first.write(false);
      } else {
        storage.results_two.at(current_epoch).write(result);
        storage.is_first.write(true);
        storage.epoch.write(current_epoch + 1);
      }
    }

    #[aztec(public)]
    internal fn _assert_invalid_caller(player: Field) {
        if (storage.player_one.at(player).read()) {
            assert(!storage.is_first.read(), "invalid turn: player 1");
        } else if (storage.player_two.at(player).read()) {
            assert(storage.is_first.read(), "invalid turn: player 2");
        } else {
            assert(false, "invalid caller");
        }
    }

    #[aztec(public)]
    internal fn _assert_is_player_one(player: Field) {
         assert(storage.player_one.at(player).read(), "not player_one");
    }

    #[aztec(public)]
    internal fn _assert_is_player_two(player: Field) {
         assert(storage.player_two.at(player).read(), "not player_two");
    }

    #[aztec(public)]
    internal fn _initialize(_player_one: Field, _player_two: Field) {
        assert((_player_one != 0) & (_player_two != 0), "invalid player addresses");
        storage.player_one.at(_player_one).write(true);
        storage.player_two.at(_player_two).write(true);
        storage.epoch.write(0);
        storage.is_first.write(true);
    }

    unconstrained fn get_is_player_one(player: Field) -> bool {
        storage.player_one.at(player).read()
    }

    unconstrained fn get_is_player_two(player: Field) -> bool {
        storage.player_two.at(player).read()
    }

    unconstrained fn get_player_one_secret_num() -> Field {
        let note = storage.secret_num_one.view_note();
        note.secret_num
    }

    unconstrained fn get_player_two_secret_num() -> Field {
        let note = storage.secret_num_two.view_note();
        note.secret_num
    }

    unconstrained fn is_note_one_initialized() -> bool {
        let note = storage.secret_num_one.view_note();
        let is_initialized = storage.secret_num_one.is_initialized(
            Option::some(note.owner)
        );
        is_initialized
    }

    unconstrained fn is_note_two_initialized() -> bool {
        let note = storage.secret_num_two.view_note();
        let is_initialized = storage.secret_num_two.is_initialized(
            Option::some(note.owner)
        );
        is_initialized
    }

    unconstrained fn get_result_one(epoch: Field) -> [Field; 2] {
       let mut result: [Field; 2] = [0;2];
       let res: Result = storage.results_one.at(epoch).read();
       
       result[0] = res.eat;
       result[1] = res.bite;

       result
    }

    unconstrained fn get_result_two(epoch: Field) -> [Field; 2] {
       let mut result: [Field; 2] = [0;2];
       let res: Result = storage.results_two.at(epoch).read();
       
       result[0] = res.eat;
       result[1] = res.bite;

       result
    }

    unconstrained fn get_epoch() -> Field {
        storage.epoch.read()
    }

    unconstrained fn get_is_first() -> bool {
        storage.is_first.read()
    }

    unconstrained fn compute_note_hash_and_nullifier(contract_address: Field, nonce: Field, storage_slot: Field, serialized_note: [Field; SECRET_NUM_NOTE_LEN]) -> [Field; 4] {
        let note_header = NoteHeader::new(contract_address, nonce, storage_slot);
        note_utils::compute_note_hash_and_nullifier(SecretNumberNoteMethods, note_header, serialized_note)
    }
}