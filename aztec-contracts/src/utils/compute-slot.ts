import {
	Fr,
	createPXEClient,
	AccountWalletWithPrivateKey,
	AztecAddress,
	TxHash,
	ExtendedNote,
	Note,
	CheatCodes,
	initAztecJs,
} from "@aztec/aztec.js";
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
//@ts-ignore
import { getInitialTestAccountsWallets } from "@aztec/accounts/testing";

const SANDBOX_URL = "http://localhost:8080";
const SECRET_NUM_SLOT = new Fr(2);
const GAME_ID_SLOT = new Fr(5);

export async function getSlot() {
	const pxe = createPXEClient(SANDBOX_URL);

	await initAztecJs();
	const accounts: AccountWalletWithPrivateKey[] =
		await getInitialTestAccountsWallets(pxe);

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
