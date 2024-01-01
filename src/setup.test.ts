import {
	init,
	Fr,
	PXE,
	createPXEClient,
	getSandboxAccountsWallets,
	waitForSandbox,
	AztecAddress,
	AccountWalletWithPrivateKey,
} from "@aztec/aztec.js";

import { Numer0nContract } from "./artifacts/Numer0n.js";
import { addGameIdNote } from "./utils/add_note.js";
import { setup } from "./utils/deploy.js";

const ADDRESS_ZERO = AztecAddress.fromBigInt(0n);

let pxe: PXE;
let numer0n: Numer0nContract;

let player1: AccountWalletWithPrivateKey;
let player2: AccountWalletWithPrivateKey;
let deployer: AccountWalletWithPrivateKey;

let player1Addr: AztecAddress;
let player2Addr: AztecAddress;

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

	player1Addr = player1.getAddress();
	player2Addr = player2.getAddress();
}, 120_000);

describe("E2E Numer0n setup, deploy, join game", () => {
	it.skip("should fail due to invalid game id", async () => {
		await expect(
			Numer0nContract.deploy(deployer, 0n, player1Addr).send().wait()
		).rejects.toThrowError(
			"Assertion failed: invalid game_id:zero 'game_id != 0'"
		);

		const receipt = await Numer0nContract.deploy(deployer, 123n, player1Addr)
			.send()
			.wait();

		numer0n = receipt.contract;

		// Add the contract public key to the PXE
		await pxe.registerRecipient(receipt.contract.completeAddress);

		await addGameIdNote(
			pxe,
			player1Addr,
			numer0n.address,
			receipt.txHash,
			new Fr(123n)
		);

		await expect(
			numer0n
				.withWallet(player2)
				.methods.join_game(0n, player2Addr)
				.send()
				.wait()
		).rejects.toThrowError(
			"Assertion failed: invalid game_id:zero 'game_id != 0'"
		);

		await expect(
			numer0n
				.withWallet(player2)
				.methods.join_game(321n, player2Addr)
				.send()
				.wait()
		).rejects.toThrowError(
			"Assertion failed: invalid game_id 'game_id == game_id_note.value'"
		);
	});

	it.skip("should fail in invalid player address", async () => {
		const game_id = 123n;

		await expect(
			Numer0nContract.deploy(deployer, game_id, ADDRESS_ZERO).send().wait()
		).rejects.toThrowError(
			"Assertion failed: invalid player address '_player != 0'"
		);

		const receipt = await Numer0nContract.deploy(deployer, 123n, player1Addr)
			.send()
			.wait();

		numer0n = receipt.contract;

		// Add the contract public key to the PXE
		await pxe.registerRecipient(receipt.contract.completeAddress);

		await addGameIdNote(
			pxe,
			player1Addr,
			numer0n.address,
			receipt.txHash,
			new Fr(123n)
		);

		await expect(
			numer0n
				.withWallet(player2)
				.methods.join_game(game_id, ADDRESS_ZERO)
				.send()
				.wait()
		).rejects.toThrowError(
			"Assertion failed: invalid player address '_player != 0'"
		);
	});

	it("should fail as players already exist", async () => {
		const game_id = 123n;

		const receipt = await Numer0nContract.deploy(deployer, game_id, player1Addr)
			.send()
			.wait();

		numer0n = receipt.contract;

		// Add the contract public key to the PXE
		await pxe.registerRecipient(receipt.contract.completeAddress);

		await addGameIdNote(
			pxe,
			player1Addr,
			numer0n.address,
			receipt.txHash,
			new Fr(123n)
		);

		await expect(
			numer0n
				.withWallet(player1)
				.methods.join_game(game_id, player1Addr)
				.send()
				.wait()
		).rejects.toThrowError(
			"Assertion failed: player already exists '!player.is_player'"
		);

		await numer0n
			.withWallet(player2)
			.methods.join_game(game_id, player2Addr)
			.send()
			.wait();

		await expect(
			numer0n
				.withWallet(player2)
				.methods.join_game(game_id, player2Addr)
				.send()
				.wait()
		).rejects.toThrowError(
			"Assertion failed: player already exists '!player.is_player'"
		);
	});

	it("should fail to add or call num after game started", async () => {
		numer0n = await setup(pxe, deployer, player1, player2);

		// add num => error

		// await addNums();

		// call => error
	});
});
