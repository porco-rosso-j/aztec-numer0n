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
	FieldLike,
	TxStatus,
} from "@aztec/aztec.js";

import { Numer0nContract } from "./artifacts/Numer0n.js";
import { addSecretNumNote } from "./utils/add_note.js";

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
	const accounts: AccountWalletWithPrivateKey[] =
		await getSandboxAccountsWallets(pxe);
	player1 = accounts[0];
	player2 = accounts[1];
	deployer = accounts[2];
}, 120_000);

describe("E2E Numer0n", () => {
	describe("deploy_numer0n contract(..)", () => {
		// Setup: Deploy the oracle
		beforeAll(async () => {
			// Deploy the token
			const receipt = await Numer0nContract.deploy(
				deployer,
				player1.getAddress().toBuffer(),
				player2.getAddress().toBuffer()
			)
				.send()
				.wait();

			numer0n = receipt.contract;

			// Add the contract public key to the PXE
			await pxe.registerRecipient(receipt.contract.completeAddress);

			// await addNotesToPXE(player1.getAddress());
		}, 120_000);

		it("validate initial public states", async () => {
			console.log("numer0n: ", numer0n.address.toString());

			const is_player_one = await numer0n.methods
				.get_is_player_one(player1.getAddress())
				.view();
			expect(is_player_one).toBe(true);

			const is_player_two = await numer0n.methods
				.get_is_player_two(player2.getAddress())
				.view();
			expect(is_player_two).toBe(true);

			const is_first = await numer0n.methods.get_is_first().view();
			expect(is_first).toBe(true);

			expect(await numer0n.methods.get_epoch().view()).toEqual(0n);
			expect(await numer0n.methods.get_result_one(0).view()).toEqual([0n, 0n]);
			expect(await numer0n.methods.get_result_two(0).view()).toEqual([0n, 0n]);
		});

		it("should add nums correctly:player 1", async () => {
			const secret_num = 125n;

			const tx = await numer0n
				.withWallet(player1)
				.methods.add_num_one(player1.getAddress(), secret_num)
				.send()
				.wait();

			console.log("tx: ", tx.txHash.toString());
			expect(tx.status).toBe("mined");

			const is_initialized = await numer0n
				.withWallet(player1)
				.methods.is_note_one_initialized()
				.view();

			console.log("is_initialized: ", is_initialized);
			expect(is_initialized).toEqual(true);

			const _secert_num = await numer0n
				.withWallet(player1)
				.methods.get_player_one_secret_num()
				.view();

			console.log("_secert_num: ", _secert_num);
			expect(_secert_num).toEqual(secret_num);
		});

		it("should add nums correctly:player 2", async () => {
			const secret_num = 932n;

			const tx = await numer0n
				.withWallet(player2)
				.methods.add_num_two(player2.getAddress(), secret_num)
				.send()
				.wait();

			console.log("tx: ", tx.txHash.toString());
			expect(tx.status).toBe("mined");

			const is_initialized = await numer0n
				.withWallet(player2)
				.methods.is_note_two_initialized()
				.view();

			console.log("is_initialized: ", is_initialized);
			expect(is_initialized).toEqual(true);

			const _secert_num = await numer0n
				.withWallet(player2)
				.methods.get_player_two_secret_num()
				.view();

			console.log("_secert_num: ", _secert_num);
			expect(_secert_num).toEqual(secret_num);
		});

		it("player1 should call player2's secret num correctly", async () => {
			// player 2 should initiate tx
			// or player 1 calls but it's delegated from 2

			const call_num = 932n;

			const tx = await numer0n
				.withWallet(player2)
				.methods.call_num_two(player2.getAddress(), call_num)
				.send()
				.wait();

			console.log("tx: ", tx.txHash.toString());
			expect(tx.status).toBe("mined");

			const result_one = await numer0n.methods.get_result_one(0).view();

			console.log("result_one: ", result_one);
			expect(result_one).toEqual([3n, 0n]); // 3 eat, 0 bite
		});

		it("player2 should call player1's secret num correctly", async () => {
			// player 1 should initiate tx
			// or player 2 calls but it's delegated from 1

			const call_num = 125n;

			const tx = await numer0n
				.withWallet(player1)
				.methods.call_num_one(player1.getAddress(), call_num)
				.send()
				.wait();

			console.log("tx: ", tx.txHash.toString());
			expect(tx.status).toBe("mined");

			const result_two = await numer0n.methods.get_result_two(0).view();

			console.log("result_two: ", result_two);
			expect(result_two).toEqual([3n, 0n]); // 3 eat, 0 bite
		});

		// add_num
		// 1: player 1 & 2
		// 2: invalid nums
		// 3: invalid sender

		// call_num
		// 1: player 1 & 2
		// 2: recorded results
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
