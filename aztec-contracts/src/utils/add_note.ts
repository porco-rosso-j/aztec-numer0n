import {
	Fr,
	PXE,
	AztecAddress,
	TxHash,
	ExtendedNote,
	Note,
} from "@aztec/aztec.js";

const SECRET_NUM_SLOT = new Fr(2);
const GAME_ID_SLOT = new Fr(5);

const SECRET_NUM_SLOT_P1 = new Fr(
	19315785164019649587960243669779561492516090978152003747728946662377934570544
);

const SECRET_NUM_SLOT_P2 = new Fr(
	1863661041172144959916477050756730819097479206290670118366042889332290539737
);

const SECRET_NUM_NOTE_TYPE_ID = new Fr(
	8310199114101116781171099810111478111116101
);
const FIELD_NOTE_TYPE_ID = new Fr(7010510110810078111116101);

export const addSecretNumNote = async (
	pxe: PXE,
	owner: AztecAddress,
	contract: AztecAddress,
	txHash: TxHash,
	secret_num: Fr,
	player: number
) => {
	const note: Note = new Note([secret_num, owner]);
	//console.log("toBuffer: ", note.toBuffer());

	const slot: Fr = player == 1 ? SECRET_NUM_SLOT_P1 : SECRET_NUM_SLOT_P2;

	console.log("note: ", note);
	console.log("owner: ", owner);
	console.log("contract: ", contract);
	console.log("slot: ", slot);
	console.log("SECRET_NUM_NOTE_TYPE_ID: ", SECRET_NUM_NOTE_TYPE_ID);
	console.log("txHash: ", txHash);

	const extendedNote = new ExtendedNote(
		note,
		owner,
		contract,
		slot,
		// SECRET_NUM_SLOT,
		SECRET_NUM_NOTE_TYPE_ID,
		txHash
	);

	await pxe.addNote(extendedNote);
};

export const addGameIdNote = async (
	pxe: PXE,
	owner: AztecAddress,
	contract: AztecAddress,
	txHash: TxHash,
	game_id: Fr
) => {
	await pxe.addNote(
		new ExtendedNote(
			new Note([game_id]),
			owner,
			contract,
			GAME_ID_SLOT,
			FIELD_NOTE_TYPE_ID,
			txHash
		)
	);
};
