use dep::aztec::types::type_serialization::TypeSerializationInterface;

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

fn deserializeResult(fields: [Field; RESULT_SERIALIZED_LEN]) -> Result {
    Result { 
        call_num: fields[0], 
        eat: fields[1], 
        bite: fields[2],
        item: fields[3],
        item_result: fields[4] 
    }
}

fn serializeResult(result: Result) -> [Field; RESULT_SERIALIZED_LEN] {
    [result.call_num, result.eat, result.bite, result.item, result.item_result]
}

global ResultSerializationMethods = TypeSerializationInterface {
    deserialize: deserializeResult,
    serialize: serializeResult,
};