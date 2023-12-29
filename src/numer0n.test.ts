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
import { addSecretNumNote } from "./utils/add_note.js";

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
	const { SANDBOX_URL = "http://212.227.240.189:8080" } = process.env;
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
	describe("deploy_numer0n contract(..)", () => {
		// Setup: Deploy the oracle
		beforeAll(async () => {
			// Deploy the token
			const receipt = await Numer0nContract.deploy(
				deployer,
				player1Addr,
				player2Addr
			)
				.send()
				.wait();

			numer0n = receipt.contract;

			// Add the contract public key to the PXE
			await pxe.registerRecipient(receipt.contract.completeAddress);
		}, 120_000);

		it.skip("validate initial public states", async () => {
			console.log("numer0n: ", numer0n.address.toString());

			const player_one = await numer0n.methods.get_player(player1Addr).view();
			// console.log("player_one: ", player_one);
			expect(player_one.player_id).toBe(1n);
			expect(player_one.is_player).toBe(true);
			expect(player_one.has_number).toBe(false);

			const player_two = await numer0n.methods.get_player(player2Addr).view();
			// console.log("player_two: ", player_two);
			expect(player_two.player_id).toBe(2n);
			expect(player_two.is_player).toBe(true);
			expect(player_two.has_number).toBe(false);

			const is_first = await numer0n.methods.get_is_first().view();
			expect(is_first).toBe(true);

			expect(await numer0n.methods.get_epoch().view()).toEqual(0n);

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

		it.skip("should fail due to invalid nums", async () => {
			await expect(
				numer0n
					.withWallet(player1)
					.methods.add_num(player1Addr, 100n)
					.send()
					.wait()
			).rejects.toThrowError(
				"Assertion failed: number should be bigger than 11 '_num as u16 >= 12'"
			);

			await expect(
				numer0n
					.withWallet(player1)
					.methods.add_num(player1Addr, 1000n)
					.send()
					.wait()
			).rejects.toThrowError(
				"Assertion failed: number should be lower than 988 '_num as u16 <= 987'"
			);

			await expect(
				numer0n
					.withWallet(player1)
					.methods.add_num(player1Addr, 220n)
					.send()
					.wait()
			).rejects.toThrowError(
				"Assertion failed: duplication not allowed '(nums[0] != nums[1]) & (nums[1] != nums[2]) & (nums[2] != nums[0])'"
			);

			await expect(
				numer0n
					.withWallet(player1)
					.methods.add_num(player1Addr, 202n)
					.send()
					.wait()
			).rejects.toThrowError(
				"Assertion failed: duplication not allowed '(nums[0] != nums[1]) & (nums[1] != nums[2]) & (nums[2] != nums[0])'"
			);

			await expect(
				numer0n
					.withWallet(player1)
					.methods.add_num(player1Addr, 122n)
					.send()
					.wait()
			).rejects.toThrowError(
				"Assertion failed: duplication not allowed '(nums[0] != nums[1]) & (nums[1] != nums[2]) & (nums[2] != nums[0])'"
			);
		});

		it("should add nums correctly:player 1", async () => {
			const secret_num = 125n;

			const tx = await numer0n
				.withWallet(player1)
				.methods.add_num(player1Addr, secret_num)
				.send()
				.wait();

			console.log("tx: ", tx.txHash.toString());
			expect(tx.status).toBe("mined");

			const _secert_num = await numer0n
				.withWallet(player1)
				.methods.get_player_secret_num(player1Addr)
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

			const _secert_num = await numer0n
				.withWallet(player2)
				.methods.get_player_secret_num(player2Addr)
				.view();

			console.log("_secert_num: ", _secert_num);
			expect(_secert_num).toEqual(secret_num);
		});

		it.skip("should fail to add num for the second time", async () => {
			const secret_num = 125n;

			await expect(
				numer0n
					.withWallet(player1)
					.methods.add_num(player1Addr, secret_num)
					.send()
					.wait()
			).rejects.toThrowError(
				"Assertion failed: num has already been added '!player.has_number'"
			);
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
			).rejects.toThrowError("Assertion failed: not player 'player.is_player");
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

			const result_one = await numer0n.methods
				.get_result(player1Addr, 0)
				.view();

			console.log("result_one: ", result_one);
			expect(result_one.call_num).toEqual(call_num);
			expect(result_one.eat).toEqual(0n);
			expect(result_one.bite).toEqual(3n);
		});

		it.skip("player2 should call player1's secret num wrongly: 0-0", async () => {
			// player 1 should create authwitness for player 2 to send tx
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
				.get_result(player2Addr, 0)
				.view();

			console.log("result_two: ", result_two);
			expect(result_two.call_num).toEqual(call_num); // 3 eat, 0 bite
			expect(result_two.eat).toEqual(0n);
			expect(result_two.bite).toEqual(0n);
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
			// player 2 should create authwitness for player 1 to send tx
			const call_num = 293n;

			const action = numer0n
				.withWallet(player1)
				.methods.call_num(player1.getAddress(), call_num);

			await expect(action.send().wait()).rejects.toThrowError(
				"Assertion failed: player_address shouldn't be msg.sender 'false'"
			);
		});

		it("player1 should call player2's secret num correctly", async () => {
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

			console.log("tx: ", tx);
			console.log("tx hash: ", tx.txHash.toString());
			expect(tx.status).toBe("mined");

			const result_one = await numer0n.methods
				.get_result(player1Addr, 0)
				.view();

			console.log("result_one: ", result_one);
			expect(result_one.call_num).toEqual(call_num); // 3 eat, 0 bite
			expect(result_one.eat).toEqual(3n);
			expect(result_one.bite).toEqual(0n);
		});

		it("player2 should call player1's secret num correctly", async () => {
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

			const result_two = await numer0n.methods
				.get_result(player2Addr, 0)
				.view();

			console.log("result_two: ", result_two);
			expect(result_two.call_num).toEqual(call_num); // 3 eat, 0 bite
			expect(result_two.eat).toEqual(3n);
			expect(result_two.bite).toEqual(0n);
		});
	});
});
