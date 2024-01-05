use dep::aztec::types::type_serialization::TypeSerializationInterface;
use dep::aztec::{
    state_vars::{
            singleton::Singleton,
    },
};
use crate::types::{
    secret_num_note::{SecretNumberNote, SECRET_NUM_NOTE_LEN},
};

use crate::num_lib;

global ITEM_HIGH_LOW: Field = 1; // see buttom in this file
global ITEM_SLASH: Field = 2; // 2 ~ 9
global ITEM_TARGET: Field = 3; // 0 or 1, 2, 3
global ITEM_CHANGE: Field = 4; // 1, 2, 3
global ITEM_SHUFFLE: Field = 5; // nothing

global LOW: Field = 1;
global HIGH: Field = 2;
global CRACK: u16 = 5;

fn get_high_and_low(_note: Singleton<SecretNumberNote, SECRET_NUM_NOTE_LEN>) -> Field {
    let note = _note.get_note(true);
    let secret_num: Field = note.secret_num;

    let mut num = secret_num as u16;
    let mut modulus: u16 = 100;
    let mut result: Field = 0;

    for i in 0..3 {
        if ((i == 0) & (num < 100)) {
            result += (LOW * modulus as Field);
        } else {
           let subtractor = num - (num % modulus);
           let crack = CRACK * modulus;

           if ( subtractor < crack ) {
            // low
            result += (LOW * modulus as Field);
           } else {
            // high
            result += (HIGH * modulus as Field);
           }

            num = num - subtractor;

        }

        modulus = modulus / 10;
    }

    result
}

fn is_valid_new_shuffled_num(_current_secret_num:Field, _new_secret_num:Field) -> Field {

       let current_nums: [u16;3] = num_lib::arrarify_num(_current_secret_num);
       let new_nums: [u16;3] = num_lib::arrarify_num(_new_secret_num);

        let mut result: Field = 0;

        for i in 0..3 {
            let mut found: bool = false;

            for j in 0..3 {

                if (current_nums[i] == new_nums[j]) {
                    found = true;
                }

            }
            
            if (!found) {
               result = 1;
            }
        }

        result
}

pub fn get_slash(_note: Singleton<SecretNumberNote, SECRET_NUM_NOTE_LEN>) -> Field {
    let note = _note.get_note(true);
    let nums: [u16;3] = num_lib::arrarify_num(note.secret_num);

    let mut min = nums[0];
    let mut max = nums[0];
    
    if (nums[1] > max) {
        max = nums[1];
    } else if (nums[1] < min) { 
        min = nums[1];
    }

    if (nums[2] > max) {
        max = nums[2];
    } else if (nums[2] < min) { 
        min = nums[2];
    }

    // let mut result: Field
    let result = max - min;
    result as Field
}

    // for testing purpose
    pub fn _get_high_and_low(_num:Field) -> Field {

    let mut num = _num as u16;
    let mut modulus: u16 = 100;
    let mut result: Field = 0;

    for i in 0..3 {
        if ((i == 0) & (num < 100)) {
            result += (LOW * modulus as Field);
        } else {
           let subtractor = num - (num % modulus);
           let crack = CRACK * modulus;

           if ( subtractor < crack ) {
            // low
            result += (LOW * modulus as Field);
           } else {
            // high
            result += (HIGH * modulus as Field);
           }

            num = num - subtractor;

        }

        modulus = modulus / 10;
    }

    result
    }

pub fn _is_valid_new_shuffled_num(_current_secret_num:Field, _new_secret_num:Field) -> Field {

       let current_nums: [u16;3] = num_lib::arrarify_num(_current_secret_num);
       let new_nums: [u16;3] = num_lib::arrarify_num(_new_secret_num);

        let mut result: Field = 0;

        for i in 0..3 {
            let mut found: bool = false;

            for j in 0..3 {

                if (current_nums[i] == new_nums[j]) {
                    found = true;
                }

            }
            
            if (!found) {
               result = 1;
            }
        }

        result
}

pub fn _get_slash(_nums:Field) -> Field {
    let nums: [u16;3] = num_lib::arrarify_num(_nums);

    let mut min = nums[0];
    let mut max = nums[0];
    
    if (nums[1] > max) {
        max = nums[1];
    } else if (nums[1] < min) { 
        min = nums[1];
    }

    if (nums[2] > max) {
        max = nums[2];
    } else if (nums[2] < min) { 
        min = nums[2];
    }

    // let mut result: Field
    let result = max - min;
    result as Field
}
   
   
// global LOW_lOW_HIGH: Field = 112; 
// global LOW_HIGH_HIGH: Field = 122; 
// global LOW_HIGH_lOW: Field = 121; 
// global HIGH_HIGH_LOW: Field = 221; 
// global HIGH_LOW_LOW: Field = 211; 
// global HIGH_lOW_HIGH: Field = 212; 

