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
			console.log("numer0n: ", numer0n.address.toString());

			// Add the contract public key to the PXE
			await pxe.registerRecipient(receipt.contract.completeAddress);
		}, 120_000);

		it("check result 1", async () => {
			const call_num = 932n;
			const secret_num = 293n;

			const ret = await numer0n.methods
				.check_result(call_num, secret_num)
				.view();
			console.log("ret: ", ret);

			const call_num2 = 125n;
			const secret_num2 = 486n;
			const ret2 = await numer0n.methods
				.check_result(call_num2, secret_num2)
				.view();
			console.log("ret2: ", ret2);

			const call_num3 = 25n;
			const secret_num3 = 406n;
			const ret3 = await numer0n.methods
				.check_result(call_num3, secret_num3)
				.view();
			console.log("ret3: ", ret3);

			const call_num4 = 984n;
			const secret_num4 = 460n;
			const ret4 = await numer0n.methods
				.check_result(call_num4, secret_num4)
				.view();
			console.log("ret4: ", ret4);
		});

		it.skip("is_valid_nums", async () => {
			const num = 51n;
			const ret = await numer0n.methods.is_valid_nums(num).view();
			console.log("ret: ", ret);

			const num2 = 609n;
			const ret2 = await numer0n.methods.is_valid_nums(num2).view();
			console.log("ret2: ", ret2);

			const num3 = 250n;
			const ret3 = await numer0n.methods.is_valid_nums(num3).view();
			console.log("ret3: ", ret3);
		});
	});
});
