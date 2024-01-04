use dep::aztec::types::type_serialization::TypeSerializationInterface;
use dep::aztec::{
    state_vars::{
            singleton::Singleton,
    },
};
use crate::types::{
    secret_num_note::{SecretNumberNote, SECRET_NUM_NOTE_LEN},
};

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

// global LOW_lOW_HIGH: Field = 112; 
// global LOW_HIGH_HIGH: Field = 122; 
// global LOW_HIGH_lOW: Field = 121; 
// global HIGH_HIGH_LOW: Field = 221; 
// global HIGH_LOW_LOW: Field = 211; 
// global HIGH_lOW_HIGH: Field = 212; 

