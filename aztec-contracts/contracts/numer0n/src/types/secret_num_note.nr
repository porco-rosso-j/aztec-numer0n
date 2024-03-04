use dep::aztec::{
    note::{
        note_header::NoteHeader,
        note_interface::NoteInterface,
        utils::compute_note_hash_for_consumption,
    },
    protocol_types::address::AztecAddress,
    oracle::{
        nullifier_key::get_nullifier_secret_key,
        get_public_key::get_public_key,
    },
    log::emit_encrypted_log,
    hash::pedersen_hash,
    context::PrivateContext,
};

global SECRET_NUM_NOTE_LEN: Field = 2;

struct SecretNumberNote {
    secret_num: Field,
    owner: AztecAddress, 
    header: NoteHeader,
}

impl SecretNumberNote {
    pub fn new(secret_num: Field, owner: AztecAddress) -> Self {
        SecretNumberNote {
            secret_num,
            owner,
            header: NoteHeader::empty(),
        }
    }
}


impl NoteInterface<SECRET_NUM_NOTE_LEN> for SecretNumberNote {
    fn serialize_content(self) -> [Field; SECRET_NUM_NOTE_LEN] {
        let res: [Field; SECRET_NUM_NOTE_LEN] = [self.secret_num, self.owner.to_field()];
        res
    }

    fn deserialize_content(serialized_note: [Field; SECRET_NUM_NOTE_LEN]) -> Self {
        SecretNumberNote { secret_num: serialized_note[0], owner:AztecAddress::from_field(serialized_note[1]), header: NoteHeader::empty() }
    }

    fn compute_note_content_hash(self) -> Field {
        pedersen_hash(self.serialize_content(), 0)
    }

    fn compute_nullifier(self, context: &mut PrivateContext) -> Field {
        let note_hash_for_nullify = compute_note_hash_for_consumption(self);
        let secret = context.request_nullifier_secret_key(self.owner);
        pedersen_hash([
            note_hash_for_nullify,
            secret.high,
            secret.low,
        ],0)
    }

    fn compute_nullifier_without_context(self) -> Field {
        let note_hash_for_nullify = compute_note_hash_for_consumption(self);
        let secret = get_nullifier_secret_key(self.owner);
        pedersen_hash([
            note_hash_for_nullify,
            secret.high,
            secret.low,
        ],0)
    }

    fn set_header(&mut self, header: NoteHeader) {
        self.header = header;
    }

    fn get_header(note: SecretNumberNote) -> NoteHeader {
        note.header
    }


    // Broadcasts the note as an encrypted log on L1.
    pub fn broadcast(self, context: &mut PrivateContext, slot: Field) {
        let encryption_pub_key = get_public_key(self.owner);
        emit_encrypted_log(
            context,
            (*context).this_address(),
            slot,
            Self::get_note_type_id(),
            encryption_pub_key,
            self.serialize_content(),
        );
    }

    fn get_note_type_id() -> Field {
        0
    }
}