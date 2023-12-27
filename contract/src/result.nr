use dep::aztec::types::type_serialization::TypeSerializationInterface;

global RESULT_SERIALIZED_LEN: Field = 2;

struct Result {
    eat: Field,
    bite: Field
}

impl Result {
    pub fn new(eat: Field, bite: Field) -> Self {
        Result { eat, bite }
    } 
}

fn deserializeResult(fields: [Field; RESULT_SERIALIZED_LEN]) -> Result {
    Result { eat: fields[0], bite: fields[1]}
}

fn serializeResult(result: Result) -> [Field; RESULT_SERIALIZED_LEN] {
    [result.eat, result.bite]
}



global ResultSerializationMethods = TypeSerializationInterface {
    deserialize: deserializeResult,
    serialize: serializeResult,
};
