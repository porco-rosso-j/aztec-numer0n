import {
	init,
	Fr,
	PXE,
	createPXEClient,
	getSandboxAccountsWallets,
	waitForSandbox,
	AztecAddress,
	AccountWalletWithPrivateKey,
	computeAuthWitMessageHash,
} from "@aztec/aztec.js";

import { Numer0nContract } from "./artifacts/Numer0n.js";
import { addGameIdNote, addSecretNumNote } from "./utils/add_note.js";
import { setup } from "./utils/deploy.js";

const ADDRESS_ZERO = AztecAddress.fromBigInt(0n);
const ZERO_FIELD = new Fr(0n);

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

describe("E2E Numer0n", () => {
	describe("test basic functions", () => {
		// Setup: Deploy the oracle
		beforeAll(async () => {
			numer0n = await setup(pxe, deployer, player1, player2);
		}, 120_000);

		it("should add nums correctly:player 1", async () => {
			const secret_num = 125n;

			const tx = await numer0n
				.withWallet(player1)
				.methods.add_num(player1Addr, secret_num)
				.send()
				.wait();

			console.log("tx: ", tx.txHash.toString());
			expect(tx.status).toBe("mined");

			const _secert_num = await numer0n.methods
				.get_secret_num(player1Addr)
				.view();

			console.log("_secert_num: ", _secert_num);
			expect(_secert_num).toEqual(secret_num);
		});

		it("should add nums correctly:player 2", async () => {
			const secret_num = 293n;

			const tx = await numer0n
				.withWallet(player2)
				.methods.add_num(player2Addr, secret_num)
				.send()
				.wait();

			console.log("tx: ", tx.txHash.toString());
			expect(tx.status).toBe("mined");

			const _secert_num = await numer0n.methods
				.get_secret_num(player2Addr)
				.view();

			console.log("_secert_num: ", _secert_num);
			expect(_secert_num).toEqual(secret_num);
		});

		it.skip("should fail due to call from invalid player", async () => {
			const secret_num = 125n;

			await expect(
				numer0n
					.withWallet(deployer)
					.methods.add_num(player1Addr, secret_num)
					.send()
					.wait()
			).rejects.toThrowError(
				"Assertion failed: invalid player 'context.msg_sender() == player'"
			);

			await expect(
				numer0n
					.withWallet(deployer)
					.methods.add_num(deployer.getAddress(), secret_num)
					.send()
					.wait()
			).rejects.toThrowError(
				"Assertion failed: not player 'storage.players.at(_player).read().is_player'"
			);
		});

		it.skip("should fail to add different num for the second time", async () => {
			const secret_num1 = 327n;

			await expect(
				numer0n
					.withWallet(player1)
					.methods.add_num(player1Addr, secret_num1)
					.send()
					.wait()
			).rejects.toThrowError(
				"Assertion failed: num 1 already has been set '!game.is_number_set[0]'"
			);

			const secret_num2 = 954n;

			await expect(
				numer0n
					.withWallet(player2)
					.methods.add_num(player2Addr, secret_num2)
					.send()
					.wait()
			).rejects.toThrowError(
				"Assertion failed: num 2 already has been set '!game.is_number_set[1]'"
			);
		});

		it.skip("should fail due to invalid caller", async () => {
			// player 2 should create authwitness for player 1 to send tx
			const call_num = 293n;

			const action = numer0n
				.withWallet(deployer)
				.methods.call_num(player1.getAddress(), call_num);
			const messageHash = computeAuthWitMessageHash(
				deployer.getAddress(),
				action.request()
			);

			const witness = await player1.createAuthWitness(messageHash);
			await deployer.addAuthWitness(witness);

			await expect(action.send().wait()).rejects.toThrowError(
				"Assertion failed: invalid player 'false"
			);
		});

		it.skip("shouldn't be able to call your secret num: caller == target", async () => {
			const call_num = 293n;

			const action = numer0n
				.withWallet(player1)
				.methods.call_num(player1.getAddress(), call_num);

			await expect(action.send().wait()).rejects.toThrowError(
				"Assertion failed: caller shouldn't be target 'target_address != context.msg_sender()'"
			);
		});

		it.skip("shouldn fail because of unknown auth witness", async () => {
			const call_num = 293n;

			const action = numer0n
				.withWallet(player2)
				.methods.call_num(player1.getAddress(), call_num);

			await expect(action.send().wait()).rejects.toThrow();
			// "Unknown auth witness for message hash 0x2d685771fe2d740f5c01ed6535f032369f271bd322a10a706cd293c87ab30aa1"
		});

		// only passes if it's called when only p2 has added num
		it.skip("shouldn fail as game hasn't started", async () => {
			// player 2 should create authwitness for player 1 to send tx
			const call_num = 293n;

			const action = numer0n
				.withWallet(player1)
				.methods.call_num(player2.getAddress(), call_num);

			const messageHash = computeAuthWitMessageHash(
				player1Addr,
				action.request()
			);

			const witness = await player2.createAuthWitness(messageHash);
			await player1.addAuthWitness(witness);

			await expect(action.send().wait()).rejects.toThrowError(
				"Assertion failed: game hasn't been started yet 'storage.game.read().started'"
			);
		});

		it.skip("shouldn fail as invalid turns for p2", async () => {
			const call_num = 293n;

			const action = numer0n
				.withWallet(player2)
				.methods.call_num(player1Addr, call_num);

			const messageHash = computeAuthWitMessageHash(
				player2Addr,
				action.request()
			);

			const witness = await player1.createAuthWitness(messageHash);
			await player2.addAuthWitness(witness);

			await expect(action.send().wait()).rejects.toThrowError(
				"Assertion failed: invalid turn for player 2 '!storage.game.read().is_first'"
			);
		});

		it.skip("shouldn fail as invalid turns for p1", async () => {
			const call_num = 293n;

			const action = numer0n
				.withWallet(player1)
				.methods.call_num(player2Addr, call_num);

			const messageHash = computeAuthWitMessageHash(
				player1Addr,
				action.request()
			);

			const witness = await player2.createAuthWitness(messageHash);
			await player1.addAuthWitness(witness);

			await action.send().wait();

			const action2 = numer0n
				.withWallet(player1)
				.methods.call_num(player2Addr, call_num);

			const messageHash2 = computeAuthWitMessageHash(
				player1Addr,
				action2.request()
			);

			const witness2 = await player2.createAuthWitness(messageHash2);
			await player1.addAuthWitness(witness2);

			await expect(action2.send().wait()).rejects.toThrowError(
				"Assertion failed: invalid turn for player 1 'storage.game.read().is_first'"
			);
		});

		it.skip("player1 should call player2's secret num wrongly: 0-3", async () => {
			// player 2 should create authwitness for player 1 to send tx
			const call_num = 932n;

			const action = numer0n
				.withWallet(player1)
				.methods.call_num(player2Addr, call_num);
			const messageHash = computeAuthWitMessageHash(
				player1Addr,
				action.request()
			);

			const witness = await player2.createAuthWitness(messageHash);
			await player1.addAuthWitness(witness);

			const tx = await action.send().wait();

			console.log("tx: ", tx.txHash.toString());
			expect(tx.status).toBe("mined");

			const round = await numer0n.methods.get_round().view();

			const result_one = await numer0n.methods
				.get_result(player1Addr, round)
				.view();

			console.log("result_one: ", result_one);
			expect(result_one.call_num).toEqual(call_num);
			expect(result_one.eat).toEqual(0n);
			expect(result_one.bite).toEqual(3n);
		});

		it.skip("player2 should call player1's secret num wrongly: 0-0", async () => {
			// player 1 should create authwitness for player 2 to send tx

			const round_before = await numer0n.methods.get_round().view();
			const is_first_before = await numer0n.methods.get_is_first().view();

			const call_num = 486n;

			const action = numer0n
				.withWallet(player2)
				.methods.call_num(player1Addr, call_num);
			const messageHash = computeAuthWitMessageHash(
				player2Addr,
				action.request()
			);

			const witness = await player1.createAuthWitness(messageHash);
			await player2.addAuthWitness(witness);

			const tx = await action.send().wait();

			console.log("tx: ", tx.txHash.toString());
			expect(tx.status).toBe("mined");

			const result_two = await numer0n.methods
				.get_result(player2Addr, round_before)
				.view();

			console.log("result_two: ", result_two);
			expect(result_two.call_num).toEqual(call_num); // 3 eat, 0 bite
			expect(result_two.eat).toEqual(0n);
			expect(result_two.bite).toEqual(0n);

			const round_after = await numer0n.methods.get_round().view();
			expect(round_after).toBe(round_before + 1n);

			const is_first_after = await numer0n.methods.get_is_first().view();
			expect(is_first_after).not.toBe(is_first_before);
		});

		it.skip("player1 should use high & low successfully", async () => {
			// player 2 should create authwitness for player 1 to send tx

			const action = numer0n
				.withWallet(player1)
				.methods.use_attack_item(player2Addr, 1n);
			const messageHash = computeAuthWitMessageHash(
				player1Addr,
				action.request()
			);

			const witness = await player2.createAuthWitness(messageHash);
			await player1.addAuthWitness(witness);

			const tx = await action.send().wait();

			console.log("tx hash: ", tx.txHash.toString());
			expect(tx.status).toBe("mined");

			const round = await numer0n.methods.get_round().view();

			const result_one = await numer0n.methods
				.get_result(player1Addr, round)
				.view();

			console.log("result_one: ", result_one);
			expect(result_one.item).toEqual(1n); // high & low
			expect(result_one.item_result).toEqual(121n);
		});

		it("player1 should use shuffle successfully", async () => {
			const new_secret_num = 521n; // current: 125

			const tx = await numer0n
				.withWallet(player1)
				.methods.use_defense_item(player1Addr, 5n, new_secret_num)
				.send()
				.wait();

			console.log("tx: ", tx.txHash.toString());
			expect(tx.status).toBe("mined");

			const _secert_num = await numer0n.methods
				.get_secret_num(player1Addr)
				.view();

			console.log("_secert_num: ", _secert_num);
			expect(_secert_num).toEqual(new_secret_num);
		});

		it.skip("player1 should call player2's secret num correctly", async () => {
			// player 2 should create authwitness for player 1 to send tx
			const call_num = 293n;

			const action = numer0n
				.withWallet(player1)
				.methods.call_num(player2Addr, call_num);
			const messageHash = computeAuthWitMessageHash(
				player1Addr,
				action.request()
			);

			const witness = await player2.createAuthWitness(messageHash);
			await player1.addAuthWitness(witness);

			const tx = await action.send().wait();

			console.log("tx hash: ", tx.txHash.toString());
			expect(tx.status).toBe("mined");

			const round = await numer0n.methods.get_round().view();

			const result_one = await numer0n.methods
				.get_result(player1Addr, round)
				.view();

			console.log("result_one: ", result_one);
			expect(result_one.call_num).toEqual(call_num); // 3 eat, 0 bite
			expect(result_one.eat).toEqual(3n);
			expect(result_one.bite).toEqual(0n);
		});

		it.skip("player2 should call player1's secret num correctly", async () => {
			// player 1 should create authwitness for player 2 to send tx
			const call_num = 125n;

			const action = numer0n
				.withWallet(player2)
				.methods.call_num(player1Addr, call_num);
			const messageHash = computeAuthWitMessageHash(
				player2Addr,
				action.request()
			);

			const witness = await player1.createAuthWitness(messageHash);
			await player2.addAuthWitness(witness);

			const tx = await action.send().wait();

			console.log("tx: ", tx.txHash.toString());
			expect(tx.status).toBe("mined");

			const round = await numer0n.methods.get_round().view();

			const result_two = await numer0n.methods
				.get_result(player2Addr, round)
				.view();

			console.log("result_two: ", result_two);
			expect(result_two.call_num).toEqual(call_num); // 3 eat, 0 bite
			expect(result_two.eat).toEqual(3n);
			expect(result_two.bite).toEqual(0n);

			const finished = await numer0n.methods.get_is_finished().view();
			expect(finished).toBe(true);
		});

		it.skip("get winner", async () => {
			const winner_num = await numer0n.methods.get_winner().view();
			expect(winner_num).toBe(3n); // draw
		});
	});
});
