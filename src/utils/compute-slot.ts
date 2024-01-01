import {
	Fr,
	createPXEClient,
	init,
	getSandboxAccountsWallets,
	AccountWalletWithPrivateKey,
	AztecAddress,
	TxHash,
	ExtendedNote,
	Note,
	CheatCodes,
} from "@aztec/aztec.js";

const SANDBOX_URL = "http://localhost:8080";
const SECRET_NUM_SLOT = new Fr(2);
const GAME_ID_SLOT = new Fr(5);

export async function getSlot() {
	const pxe = createPXEClient(SANDBOX_URL);

	await init();
	const accounts: AccountWalletWithPrivateKey[] =
		await getSandboxAccountsWallets(pxe);

	const cheatCodes = CheatCodes.create(SANDBOX_URL, pxe);

	const slotForP1 = cheatCodes.aztec.computeSlotInMap(
		2n,
		accounts[0].getAddress()
	);
	const slotForP2 = cheatCodes.aztec.computeSlotInMap(
		2n,
		accounts[1].getAddress()
	);

	console.log("slotForP1: ", slotForP1);
	console.log("slotForP2: ", slotForP2);
}

getSlot();
