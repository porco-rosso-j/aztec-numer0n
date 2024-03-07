use dep::aztec::{
    state_vars::{
            singleton::Singleton,
    },
};
use crate::types::{
    secret_num_note::SecretNumberNote,
};

use crate::num_lib;

global ITEM_HIGH_LOW: Field = 1; // see buttom in this file
global ITEM_SLASH: Field = 2; // 2 ~ 9
global ITEM_TARGET: Field = 3; // 0 or 1, 2, 3
global ITEM_CHANGE: Field = 4; // 1, 2, 3
global ITEM_SHUFFLE: Field = 5; // nothing

global LOW: Field = 1;
global HIGH: Field = 2;
global CRACK: u32 = 5;

// high&low result
// global LOW_lOW_HIGH: Field = 112; 
// global LOW_HIGH_HIGH: Field = 122; 
// global LOW_HIGH_lOW: Field = 121; 
// global HIGH_HIGH_LOW: Field = 221; 
// global HIGH_LOW_LOW: Field = 211; 
// global HIGH_lOW_HIGH: Field = 212; 

fn get_high_and_low(_note: Singleton<SecretNumberNote>) -> Field {
    let note = _note.get_note(true);
    _get_high_and_low(note.secret_num)
}

pub fn _get_high_and_low(_num:Field) -> Field {
    let mut num = _num as u32;
    let mut modulus: u32 = 100;
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



fn get_slash(_note: Singleton<SecretNumberNote>) -> Field {
    let note = _note.get_note(true);
    _get_slash(note.secret_num)
}

pub fn _get_slash(_nums:Field) -> Field {
    let nums: [u32;3] = num_lib::arrarify_num(_nums);

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

fn get_target(_note: Singleton<SecretNumberNote>, _target_num: Field) -> Field {
    let note = _note.get_note(true);
    _get_target(note.secret_num, _target_num)
}

// digit 
// 1 -> 1's place
// 2 -> 10's place
// 3 -> 100's place

// result
// 31 -> target num 3 and digit is 1
// 3 -> taget num 0 and digit is 100
// 90 -> target 9 and not found

pub fn _get_target(_nums: Field, _target_num: Field) -> Field {
    let nums: [u32;3] = num_lib::arrarify_num(_nums);
    let mut digit: u32 = 0;
    for i in 0..3 {
        if (nums[i] == _target_num as u32) {
            digit = 3-i;
        }
    }

    let result = digit + ( 10 * _target_num as u32);
    result as Field
}

   
fn is_valid_changed_num(_current_secret_num:Field, _new_secret_num:Field) -> bool {
    _is_valid_changed_num(_current_secret_num, _new_secret_num)
}

// fn is_valid_changed_num(_note: Singleton<SecretNumberNote>, _new_secret_num:Field) -> bool {
//     let note = _note.get_note(false);
//     _is_valid_changed_num(note.secret_num, _new_secret_num)
// }

pub fn _is_valid_changed_num(_current_secret_num:Field, _new_secret_num:Field) -> bool {
       let current_nums: [u32;3] = num_lib::arrarify_num(_current_secret_num);
       let new_nums: [u32;3] = num_lib::arrarify_num(_new_secret_num);

        let mut diff_count: Field = 0;

        for i in 0..3 {
            if (current_nums[i] != new_nums[i]) {
                diff_count += 1;
            }

        }
            
        diff_count == 1
}

fn is_valid_new_shuffled_num(_current_secret_num:Field, _new_secret_num:Field) -> bool {
    _is_valid_new_shuffled_num(_current_secret_num, _new_secret_num)
}

// fn is_valid_new_shuffled_num(_note: Singleton<SecretNumberNote>, _new_secret_num:Field) -> bool {
//     let note = _note.get_note(false);
//     _is_valid_new_shuffled_num(note.secret_num, _new_secret_num)
// }

pub fn _is_valid_new_shuffled_num(_current_secret_num:Field, _new_secret_num:Field) -> bool {
       let current_nums: [u32;3] = num_lib::arrarify_num(_current_secret_num);
       let new_nums: [u32;3] = num_lib::arrarify_num(_new_secret_num);

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

        // let ret = result == 0;
        // ret

        result == 0
}

