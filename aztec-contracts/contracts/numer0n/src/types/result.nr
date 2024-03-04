use dep::aztec::protocol_types::{traits::{Serialize, Deserialize}};

global RESULT_SERIALIZED_LEN: Field = 5;

struct Result {
    call_num: Field,
    eat: Field,
    bite: Field,
    item: Field,
    item_result: Field
}

impl Result {
    pub fn new(call_num: Field, eat: Field, bite: Field, item: Field, item_result: Field) -> Self {
        Result { call_num, eat, bite, item, item_result }
    } 
}

impl Deserialize<RESULT_SERIALIZED_LEN> for Result {
    fn deserialize(fields: [Field; RESULT_SERIALIZED_LEN]) -> Self {
    Result { 
        call_num: fields[0], 
        eat: fields[1], 
        bite: fields[2],
        item: fields[3],
        item_result: fields[4] 
    }
    }
}

impl Serialize<RESULT_SERIALIZED_LEN> for Result {
    fn serialize(self) -> [Field; RESULT_SERIALIZED_LEN] {
    [self.call_num, self.eat, self.bite, self.item, self.item_result]
    }
}
