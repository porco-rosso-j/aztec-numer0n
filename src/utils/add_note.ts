import {
	Fr,
	PXE,
	AztecAddress,
	TxHash,
	ExtendedNote,
	Note,
} from "@aztec/aztec.js";

const SECRET_NUM_SLOT_ONE = new Fr(3);
const SECRET_NUM_SLOT_TWO = new Fr(4);

export const addSecretNumNote = async (
	pxe: PXE,
	owner: AztecAddress,
	contract: AztecAddress,
	txHash: TxHash,
	secret_num: Fr,
	is_player_first: boolean
) => {
	await pxe.addNote(
		new ExtendedNote(
			new Note([secret_num, owner.toField()]),
			owner,
			contract,
			is_player_first ? SECRET_NUM_SLOT_ONE : SECRET_NUM_SLOT_TWO,
			txHash
		)
	);
};
