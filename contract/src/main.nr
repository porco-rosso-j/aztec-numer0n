mod secret_num_note;
mod result;

contract Numer0n {
    use dep::std::option::Option;
    use dep::aztec::{
        context::{PrivateContext, PublicContext, Context},
        state_vars::{
            map::Map, public_state::PublicState, singleton::Singleton,
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
        SecretNumberNote, SecretNumberNoteInterface, SECRET_NUM_NOTE_LEN,
    };

    use crate::result::{RESULT_SERIALIZED_LEN, Result, ResultSerializationMethods};

    // storage
    struct Storage {
        players: Map<PublicState<bool, BOOL_SERIALIZED_LEN>>,
        secret_num_one: Singleton<SecretNumberNote, SECRET_NUM_NOTE_LEN>, // player one's secret num
        secret_num_two: Singleton<SecretNumberNote, SECRET_NUM_NOTE_LEN>, // player two's secret num
        results_one: Map<PublicState<Result, RESULT_SERIALIZED_LEN>>, // epoch => Result: { eat, bite }
        results_two: Map<PublicState<Result, RESULT_SERIALIZED_LEN>>,
        epoch: PublicState<Field, FIELD_SERIALIZED_LEN>,
        is_player_two_turn: PublicState<bool, BOOL_SERIALIZED_LEN>, // default false
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
                        BoolSerializationMethods,
                    )
                },
            ),
            secret_num_one: Singleton::new(
                context, 
                2, 
                SecretNumberNoteInterface
            ),
            secret_num_two: Singleton::new(
                context, 
                3, 
                SecretNumberNoteInterface
            ),
            results_one: Map::new(
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
            results_two: Map::new(
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
            epoch: PublicState::new(
                context,
                6,
                FieldSerializationMethods,
            ),
            is_player_two_turn: PublicState::new(
                context,
                7,
                BoolSerializationMethods,
            )
        }
      }
    }


    // docs:start:constructor
    #[aztec(private)]
    fn constructor(player_one: Field, player_two: Field) {
        let selector = compute_selector("_initialize(Field, Field)");
        context.call_public_function(context.this_address(), selector, [player_one, player_two]);
    }

    #[aztec(private)]
    fn add_num(player: Field, nums: [Field; 3]) {
        assert(storage.players.at(context.msg_sender()).read(), "caller is not player");

        // validate nums
        context.call_private_function(
            context.this_address(),
            compute_selector("_is_valid_nums(Field, Field, Field)"), 
            [nums[0], nums[1], nums[2]]
        );  

        let mut secret_num_note = SecretNumberNote::new(nums, player);

        if (!storage.is_player_two_turn.read()) {
            storage.secret_num_one.initialize(
                &mut secret_num_note, 
                Option::some(secret_num_note.owner),
                true
            );
        } else {
            storage.secret_num_two.initialize(
                &mut secret_num_note, 
                Option::some(secret_num_note.owner), 
                true
            );
        }
    }

    #[aztec(private)]
    fn call_num(player: Field, call_nums: [Field; 3]) {
        assert(storage.players.at(context.msg_sender()).read(), "caller is not player");

        // validate call_nums
        context.call_private_function(
            context.this_address(),
            compute_selector("_is_valid_nums(Field, Field, Field)"), 
            [call_nums[0], call_nums[1], call_nums[2]]
        );

        let mut player_num: Field = 0;
        let mut secret_nums: [Field;3] = [0;3];
        
        if (!storage.is_player_two_turn.read()) {
            player_num = 1;
            let secret_num_note: SecretNumberNote = storage.secret_num_one.get_note(true);

            for i in 0..2 {
                secret_nums[0] = secret_num_note.secret_num[i];
            }

        } else {
            player_num = 2;
            let secret_num_note: SecretNumberNote = storage.secret_num_two.get_note(true);

            for i in 0..2 {
                secret_nums[0] = secret_num_note.secret_num[i];
            }
        }

        // check results
        // may have length 4 somehow
        let ret = context.call_private_function(
            context.this_address(),
            compute_selector("_check_result(Field, Field, Field, Field, Field, Field)"), 
            [call_nums[0], call_nums[1], call_nums[2], secret_nums[0], secret_nums[1], secret_nums[2]]
        );
        
        // records results
        context.call_public_function(
            context.this_address(), 
            compute_selector("_record_result(Field,Field,Field)"), 
            [player_num, ret[0], ret[1]]
        );
    }


    #[aztec(private)]
    internal fn _check_result(
        call_num_hunds: Field, 
        call_num_tens: Field,
        call_num_ones: Field,
        secret_num_hunds: Field,
        secret_num_tens: Field,
        secret_num_ones: Field
    ) -> [Field;2] {
        let mut call_nums: [Field;3] = [0;3];
        call_nums[0] = call_num_hunds;
        call_nums[1] = call_num_tens;
        call_nums[2] = call_num_ones;

        let mut secret_nums: [Field;3] = [0;3];
        secret_nums[0] = secret_num_hunds;
        secret_nums[1] = secret_num_tens;
        secret_nums[2] = secret_num_ones;

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
    internal fn _is_valid_nums(hunds: Field, tens: Field, ones: Field) {
        assert((hunds != tens) & (tens != ones) & (ones != hunds), "duplication not allowed");
        assert((hunds as u8 < 10) & (tens as u8 < 10) & (ones as u8 < 10), "nums should be less than 10");
    }

    #[aztec(public)]
    internal fn _record_result(player_num: Field, eat:Field, bite:Field) {
      let current_epoch: Field = storage.epoch.read();
      let result = Result::new(eat, bite);

      if (player_num == 1) {
        storage.results_one.at(current_epoch).write(result);
        storage.is_player_two_turn.write(true);
      } else {
        storage.results_two.at(current_epoch).write(result);
        storage.is_player_two_turn.write(false);
        storage.epoch.write(current_epoch + 1);
      }
    }

    #[aztec(public)]
    internal fn _initialize(player_one: Field, player_two: Field) {
        assert((player_one != 0) & (player_two != 0), "invalid player_one address");
        storage.players.at(player_one).write(true);
        storage.players.at(player_two).write(true);
        storage.epoch.write(0);
    }

    // Computes note hash and nullifier.
    // Note 1: Needs to be defined by every contract producing logs.
    // Note 2: Having it in all the contracts gives us the ability to compute the note hash and nullifier differently for different kind of notes.
    unconstrained fn compute_note_hash_and_nullifier(contract_address: Field, nonce: Field, storage_slot: Field, serialized_note: [Field; VALUE_NOTE_LEN]) -> [Field; 4] {
        let note_header = NoteHeader::new(contract_address, nonce, storage_slot);
        note_utils::compute_note_hash_and_nullifier(ValueNoteMethods, note_header, serialized_note)
    }
}

