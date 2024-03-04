import {
	Fr,
	PXE,
	AztecAddress,
	AccountWalletWithPrivateKey,
	ExtendedNote,
	Note,
} from "@aztec/aztec.js";
import { Numer0nContract } from "../artifacts/Numer0n.js";
import { addGameIdNote } from "../utils/add_note.js";

export const setup = async (
	pxe: PXE,
	deployer: AccountWalletWithPrivateKey,
	player1: AccountWalletWithPrivateKey,
	player2: AccountWalletWithPrivateKey
): Promise<any> => {
	const game_id = 123n;

	const receipt = await Numer0nContract.deploy(
		deployer,
		game_id,
		player1.getAddress()
	)
		.send()
		.wait();

	const numer0n = receipt.contract;

	// Add the contract public key to the PXE
	// await pxe.registerRecipient(receipt.contract.completeAddress);

	await addGameIdNote(
		pxe,
		player1.getAddress(),
		numer0n.address,
		receipt.txHash,
		new Fr(game_id)
	);

	await numer0n
		.withWallet(player2)
		.methods.join_game(game_id, player2.getAddress())
		.send()
		.wait();

	return numer0n;
};
