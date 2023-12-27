import {
	init,
	Fr,
	PXE,
	computeMessageSecretHash,
	createPXEClient,
	getSandboxAccountsWallets,
	waitForSandbox,
	AztecAddress,
	AccountWalletWithPrivateKey,
	computeAuthWitMessageHash,
	TxHash,
	ExtendedNote,
	Note,
	BatchCall,
} from "@aztec/aztec.js";

import { Numer0nContract } from "./artifacts/Numer0n.js";
// import { AnswerNote, QuestionNote } from "../../types/Notes.js";

const ADDRESS_ZERO = AztecAddress.fromBigInt(0n);
const ZERO_FIELD = new Fr(0n);

let pxe: PXE;
let numer0n: Numer0nContract;
let player1: AccountWalletWithPrivateKey;
let player2: AccountWalletWithPrivateKey;
let deployer: AccountWalletWithPrivateKey;

// Setup: Set the sandbox
beforeAll(async () => {
	const { SANDBOX_URL = "http://localhost:8080" } = process.env;
	pxe = createPXEClient(SANDBOX_URL);

	await init();
	await waitForSandbox(pxe);
	const accounts = getSandboxAccountsWallets(pxe);
	player1 = accounts[0];
	player2 = accounts[1];
}, 120_000);

describe("E2E Numer0n", () => {
	describe("deploy_numer0n contract(..)", () => {
		// Setup: Deploy the oracle
		beforeAll(async () => {
			// Deploy the token
			const numer0n = await Numer0nContract.deploy(
				deployer,
				player1.getAddress(),
				player2.getAddress()
			)
				.send()
				.deployed();

			// Add the contract public key to the PXE
			await pxe.registerRecipient(numer0n.completeAddress);

			// await addNotesToPXE(player1.getAddress());
		}, 120_000);

		it("check public variables", async () => {
			// let requesterBalance = await token
			// 	.withWallet(requester)
			// 	.methods.balance_of_private(requester.getAddress())
			// 	.view();
			// expect(requesterBalance).toEqual(MINT_AMOUNT);
		});
	});
});

// const addNotesToPXE = async (
// 	player: AztecAddress,
// 	numer0n: AztecAddress,
// 	fee: bigint,
// 	txHash: TxHash
// ) => {
// 	await Promise.all([
// 		// Add note for the payment token
// 		pxe.addNote(
// 			new ExtendedNote(
// 				new Note([token.toField()]),
// 				requester,
// 				oracle,
// 				PAYMENT_TOKEN_SLOT,
// 				txHash
// 			)
// 		),

// 		// Add note for the fee
// 		pxe.addNote(
// 			new ExtendedNote(
// 				new Note([new Fr(fee)]),
// 				requester,
// 				oracle,
// 				FEE_SLOT,
// 				txHash
// 			)
// 		),
// 	]);
// };
