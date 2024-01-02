use dep::aztec::types::type_serialization::TypeSerializationInterface;

global GAME_SERIALIZED_LEN: Field = 6;

struct Game {
    is_number_set: [bool;2],
    started: bool, // true if both players are added and secret numers are set.
    finished: bool,
    round: Field,
    is_first: bool
}

impl Game {
    pub fn new(
        is_number_set: [bool;2],
        started: bool,
        finished: bool,
        round: Field,
        is_first: bool
    ) -> Self {

        Game { 
            is_number_set, 
            started, 
            finished, 
            round, 
            is_first
             }
    } 
}

fn deserializeResult(fields: [Field; GAME_SERIALIZED_LEN]) -> Game {
    let _is_number_set = [fields[0] as bool, fields[1] as bool];
    
    Game { 
        is_number_set: _is_number_set,
        started: fields[2] as bool, 
        finished: fields[3] as bool, 
        round: fields[4], 
        is_first: fields[5] as bool
         }
}

fn serializeResult(game: Game) -> [Field; GAME_SERIALIZED_LEN] {
    [
        game.is_number_set[0] as Field,
        game.is_number_set[1] as Field,
        game.started as Field, 
        game.finished as Field, 
        game.round, 
        game.is_first as Field
    ]
}

global GameSerializationMethods = TypeSerializationInterface {
    deserialize: deserializeResult,
    serialize: serializeResult,
};