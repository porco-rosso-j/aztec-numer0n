use dep::aztec::types::type_serialization::TypeSerializationInterface;

global PLAYER_SERIALIZED_LEN: Field = 2;

struct Player {
    player_id: Field,
    is_player: bool
}

impl Player {
    pub fn new(player_id:Field, is_player: bool) -> Self {
        Player { player_id, is_player }
    } 
}

fn deserializePlayer(fields: [Field; PLAYER_SERIALIZED_LEN]) -> Player {
    Player { player_id: fields[0], is_player: fields[1] as bool}
}

fn serializePlayer(player: Player) -> [Field; PLAYER_SERIALIZED_LEN] {
    [player.player_id, player.is_player as Field ]
}

global PlayerSerializationMethods = TypeSerializationInterface {
    deserialize: deserializePlayer,
    serialize: serializePlayer,
};