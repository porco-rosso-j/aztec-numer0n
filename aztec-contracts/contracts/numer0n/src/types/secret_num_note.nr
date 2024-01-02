use dep::aztec::{
    note::{
        note_header::NoteHeader,
        note_interface::NoteInterface,
        utils::compute_note_hash_for_read_or_nullify,
    },
    oracle::{
        get_secret_key::get_secret_key,
        get_public_key::get_public_key,
    },
    log::emit_encrypted_log,
    hash::pedersen_hash,
    context::PrivateContext,
};

// global SECRET_NUM_NOTE_LEN: Field = 4;
global SECRET_NUM_NOTE_LEN: Field = 2;

struct SecretNumberNote {
    secret_num: Field,
    owner: Field, // We store the owner address only to get the secret key to compute the nullifier
    header: NoteHeader,
}

impl SecretNumberNote {
    pub fn new(secret_num: Field, owner: Field) -> Self {
        SecretNumberNote {
            secret_num,
            owner,
            header: NoteHeader::empty(),
        }
    }

    pub fn serialize(self) -> [Field; SECRET_NUM_NOTE_LEN] {
        let res: [Field; SECRET_NUM_NOTE_LEN] = [self.secret_num, self.owner];
        res
    }

    pub fn deserialize(serialized_note: [Field; SECRET_NUM_NOTE_LEN]) -> Self {
        SecretNumberNote { secret_num: serialized_note[0], owner: serialized_note[1], header: NoteHeader::empty() }
    }
    
    pub fn compute_note_hash(self) -> Field {
        pedersen_hash(self.serialize(), 0)
    }

    pub fn compute_nullifier(self) -> Field {
        let note_hash_for_nullify = compute_note_hash_for_read_or_nullify(SecretNumberNoteMethods, self);
        let secret = get_secret_key(self.owner);
        // TODO(#1205) Should use a non-zero generator index.
        pedersen_hash([
            note_hash_for_nullify,
            secret.low,
            secret.high,
        ],0)
    }

    pub fn set_header(&mut self, header: NoteHeader) {
        self.header = header;
    }

    // Broadcasts the note as an encrypted log on L1.
    pub fn broadcast(self, context: &mut PrivateContext, slot: Field) {
        let encryption_pub_key = get_public_key(self.owner);
        emit_encrypted_log(
            context,
            (*context).this_address(),
            slot,
            encryption_pub_key,
            self.serialize(),
        );
    }
}

fn serialize(note: SecretNumberNote) -> [Field; SECRET_NUM_NOTE_LEN] {
    note.serialize()
}

fn deserialize(serialized_note: [Field; SECRET_NUM_NOTE_LEN]) -> SecretNumberNote {
    SecretNumberNote::deserialize(serialized_note)
}

fn compute_note_hash(note: SecretNumberNote) -> Field {
    note.compute_note_hash()
}

fn compute_nullifier(note: SecretNumberNote) -> Field {
    note.compute_nullifier()
}

fn get_header(note: SecretNumberNote) -> NoteHeader {
    note.header
}

fn set_header(note: &mut SecretNumberNote, header: NoteHeader) {
    note.set_header(header);
}

// Broadcasts the note as an encrypted log on L1.
fn broadcast(context: &mut PrivateContext, slot: Field, note: SecretNumberNote) {
    note.broadcast(context, slot);
}

global SecretNumberNoteMethods = NoteInterface {
    deserialize,
    serialize,
    compute_note_hash,
    compute_nullifier,
    get_header,
    set_header,
    broadcast,
};