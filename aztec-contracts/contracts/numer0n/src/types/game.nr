use dep::aztec::protocol_types::{traits::{Serialize, Deserialize}};

struct Game {
    players: [Field;2],
    is_number_set: [bool;2],
    started: bool, // true if both players are added and secret numers are set.
    finished: bool,
    round: Field,
    is_first: bool
}

global GAME_SERIALIZED_LEN: Field = 8;

impl Deserialize<GAME_SERIALIZED_LEN> for Game {
    fn deserialize(fields: [Field; GAME_SERIALIZED_LEN]) -> Self {

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
}

impl Serialize<GAME_SERIALIZED_LEN> for Game {
    fn serialize(self) -> [Field; GAME_SERIALIZED_LEN] {
        [
        self.players[0],
        self.players[1],
        self.is_number_set[0] as Field,
        self.is_number_set[1] as Field,
        self.started as Field, 
        self.finished as Field, 
        self.round, 
        self.is_first as Field
    ]
    }
}