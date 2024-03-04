// use dep::aztec::types::type_serialization::TypeSerializationInterface;
use dep::aztec::protocol_types::{traits::{Serialize, Deserialize}};

global PLAYER_SERIALIZED_LEN: Field = 2;

struct Player {
    player_id: Field,
    is_player: bool
}

impl Deserialize<PLAYER_SERIALIZED_LEN> for Player {
    fn deserialize(fields: [Field; PLAYER_SERIALIZED_LEN]) -> Self {
        Player { player_id: fields[0], is_player: fields[1] as bool}
    }
}

impl Serialize<PLAYER_SERIALIZED_LEN> for Player {
    fn serialize(self) -> [Field; PLAYER_SERIALIZED_LEN] {
         [self.player_id, self.is_player as Field ]
    }
}
