use dep::aztec::types::type_serialization::TypeSerializationInterface;

global GAME_SERIALIZED_LEN: Field = 8;

struct Game {
    players: [Field;2],
    is_number_set: [bool;2],
    started: bool, // true if both players are added and secret numers are set.
    finished: bool,
    round: Field,
    is_first: bool
}

impl Game {
    pub fn new(
        players: [Field;2],
        is_number_set: [bool;2],
        started: bool,
        finished: bool,
        round: Field,
        is_first: bool
    ) -> Self {

        Game { 
            players,
            is_number_set, 
            started, 
            finished, 
            round, 
            is_first
        }
    } 
}

fn deserializeResult(fields: [Field; GAME_SERIALIZED_LEN]) -> Game {
    let _players = [fields[0], fields[1]];
    let _is_number_set = [fields[2] as bool, fields[3] as bool];
    
    Game { 
        players: _players,
        is_number_set: _is_number_set,
        started: fields[4] as bool, 
        finished: fields[5] as bool, 
        round: fields[6], 
        is_first: fields[7] as bool
         }
}

fn serializeResult(game: Game) -> [Field; GAME_SERIALIZED_LEN] {
    [
        game.players[0],
        game.players[1],
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