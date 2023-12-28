use dep::aztec::types::type_serialization::TypeSerializationInterface;

global RESULT_SERIALIZED_LEN: Field = 3;

struct Result {
    call_num: Field,
    eat: Field,
    bite: Field
}

impl Result {
    pub fn new(call_num: Field, eat: Field, bite: Field) -> Self {
        Result { call_num, eat, bite }
    } 
}

fn deserializeResult(fields: [Field; RESULT_SERIALIZED_LEN]) -> Result {
    Result { call_num: fields[0], eat: fields[1], bite: fields[2]}
}

fn serializeResult(result: Result) -> [Field; RESULT_SERIALIZED_LEN] {
    [result.call_num, result.eat, result.bite]
}



global ResultSerializationMethods = TypeSerializationInterface {
    deserialize: deserializeResult,
    serialize: serializeResult,
};
