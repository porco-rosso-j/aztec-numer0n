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
const SECRET_NUM_NOTE_TYPE_ID = new Fr(
	8310199114101116781171099810111478111116101n
);
const FIELD_NOTE_TYPE_ID = new Fr(7010510110810078111116101n);

export const addSecretNumNote = async (
	pxe: PXE,
	owner: AztecAddress,
	contract: AztecAddress,
	txHash: TxHash,
	secret_num: Fr
) => {
	await pxe.addNote(
		new ExtendedNote(
			new Note([secret_num, owner.toField()]),
			owner,
			contract,
			SECRET_NUM_SLOT,
			SECRET_NUM_NOTE_TYPE_ID,
			txHash
		)
	);
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
