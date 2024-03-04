import {
	Fr,
	PXE,
	createPXEClient,
	AztecAddress,
	AccountWalletWithPrivateKey,
	initAztecJs,
} from "@aztec/aztec.js";
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
//@ts-ignore
import { getInitialTestAccountsWallets } from "@aztec/accounts/testing";

import { Numer0nContract } from "./artifacts/Numer0n.js";
import { addGameIdNote } from "./utils/add_note.js";
import { setup } from "./utils/deploy.js";
import { SANDBOX_URL } from "./utils/constants.js";

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
	pxe = createPXEClient(SANDBOX_URL);

	await initAztecJs();
	const accounts = await getInitialTestAccountsWallets(pxe);
	player1 = accounts[0];
	player2 = accounts[1];
	deployer = accounts[2];

	player1Addr = player1.getAddress();
	player2Addr = player2.getAddress();
}, 120_000);

describe("E2E Numer0n setup, deploy, join game", () => {
	describe("deploy and setup", () => {
		it("setup and validate initial public states", async () => {
			numer0n = await setup(pxe, deployer, player1, player2);

			console.log("numer0n: ", numer0n.address.toString());

			const player_one = await numer0n.methods.get_player(player1Addr).view();
			// console.log("player_one: ", player_one);
			expect(player_one.player_id).toBe(1n);
			expect(player_one.is_player).toBe(true);

			const player_two = await numer0n.methods.get_player(player2Addr).view();
			// console.log("player_two: ", player_two);
			expect(player_two.player_id).toBe(2n);
			expect(player_two.is_player).toBe(true);

			const is_first = await numer0n.methods.get_is_first().view();
			expect(is_first).toBe(false);

			const round = await numer0n.methods.get_round().view();
			expect(round).toBe(0n);

			const is_started = await numer0n.methods.get_is_started().view();
			expect(is_started).toBe(false);

			const is_finished = await numer0n.methods.get_is_finished().view();
			expect(is_finished).toBe(false);

			const winner = await numer0n.methods.get_winner().view();
			expect(winner).toBe(0n);

			const result_one = await numer0n.methods
				.get_result(player1Addr, 0)
				.view();
			// console.log("result_one: ", result_one);
			expect(result_one.call_num).toEqual(0n);

			const result_two = await numer0n.methods
				.get_result(player2Addr, 0)
				.view();
			// console.log("result_two: ", result_two);
			expect(result_two.call_num).toEqual(0n);
		});
	});

	it("should fail due to invalid game id", async () => {
		await expect(
			Numer0nContract.deploy(deployer, 0n, player1Addr).send().wait()
		).rejects.toThrowError(
			"Assertion failed: invalid game_id:zero 'game_id != 0'"
		);

		const receipt = await Numer0nContract.deploy(deployer, 123n, player1Addr)
			.send()
			.wait();

		numer0n = receipt.contract;

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

	it("should fail in invalid player address", async () => {
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

	it.skip("should fail as players already exist", async () => {
		const game_id = 123n;

		const receipt = await Numer0nContract.deploy(deployer, game_id, player1Addr)
			.send()
			.wait();

		numer0n = receipt.contract;

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
});
