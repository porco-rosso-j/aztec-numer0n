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
		new ExtendedNote(new Note([game_id]), owner, contract, GAME_ID_SLOT, txHash)
	);
};
