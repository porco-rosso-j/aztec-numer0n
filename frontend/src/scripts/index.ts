import {
	Fr,
	PXE,
	AztecAddress,
	AccountWalletWithPrivateKey,
	computeAuthWitMessageHash,
	createPXEClient,
	SignerlessWallet,
	getSandboxAccountsWallets,
} from "@aztec/aztec.js";

import { Numer0nContract } from "../artifacts/Numer0n.js";
import { RegistryContract } from "../artifacts/Registry.js";
import {
	registryAddress,
	SANDBOX_ADDRESS_1,
	SANDBOX_ADDRESS_2,
	SANDBOX_URL,
} from "./constants.js";
import { addGameIdNote } from "./add_note.js";

type GameCreated = {
	contractAddress: AztecAddress;
	gameCount: number;
};

export const pxe = (): PXE => {
	return createPXEClient(SANDBOX_URL);
};

export const getAccountByAddress = async (
	player: string
): Promise<AccountWalletWithPrivateKey> => {
	if (player == SANDBOX_ADDRESS_1) {
		console.log("aaa");
		return (await getSandboxAccountsWallets(pxe()))[0];
	} else if (player == SANDBOX_ADDRESS_2) {
		console.log("bbb");
		return (await getSandboxAccountsWallets(pxe()))[1];
	} else {
		return (await getSandboxAccountsWallets(pxe()))[2];
	}
};
export async function createGame(
	player: AccountWalletWithPrivateKey,
	password: bigint
): Promise<GameCreated> {
	let contractAddress: AztecAddress;
	let gameCount: bigint;

	try {
		console.log("password: ", password);
		const receipt = await Numer0nContract.deploy(
			player,
			password,
			player.getAddress()
		)
			.send()
			.wait();

		contractAddress = receipt.contractAddress!;

		await pxe().registerRecipient(receipt.contract.completeAddress);

		await addGameIdNote(
			pxe(),
			player.getAddress(),
			contractAddress,
			receipt.txHash,
			new Fr(password)
		);

		const registry = await RegistryContract.at(
			AztecAddress.fromString(registryAddress),
			player
		);
		await registry.methods
			.add_game(receipt.contractAddress?.toField())
			.send()
			.wait();

		gameCount = await registry.methods.get_current_count().view();
	} catch (e) {
		console.log("e: ", e);
	}

	return {
		contractAddress: contractAddress!,
		gameCount: Number(gameCount!),
	} as GameCreated;
}

export async function joinGame(
	player: AccountWalletWithPrivateKey,
	contractAddress: string,
	password: bigint
) {
	try {
		const numer0n = await Numer0nContract.at(
			AztecAddress.fromString(contractAddress),
			player
		);
		await numer0n.methods
			.join_game(password, player.getAddress())
			.send()
			.wait();
	} catch (e) {
		console.log("e: ", e);
	}
}

export async function addNumber(
	player: AccountWalletWithPrivateKey,
	secert_num: bigint,
	contractAddress: string
) {
	console.log("player: ", player.getAddress().toString());
	console.log("secert_num: ", secert_num);
	try {
		const numer0n = await Numer0nContract.at(
			AztecAddress.fromString(contractAddress),
			player
		);
		await numer0n.methods
			.add_num(player.getAddress(), secert_num)
			.send()
			.wait();
	} catch (e) {
		console.log("e: ", e);
	}
}

export async function callNumber(
	player: AccountWalletWithPrivateKey,
	opponent: AccountWalletWithPrivateKey,
	call_num: bigint,
	contractAddress: string
) {
	try {
		const numer0n = await Numer0nContract.at(
			AztecAddress.fromString(contractAddress),
			player
		);

		const action = numer0n.methods.call_num(opponent.getAddress(), call_num);
		const messageHash = computeAuthWitMessageHash(
			player.getAddress(),
			action.request()
		);
		const witness = await opponent.createAuthWitness(messageHash);
		await player.addAuthWitness(witness);

		await action.send().wait();
	} catch (e) {
		console.log("e: ", e);
	}
}

// getters

export async function getIsFirst(contractAddress: string): Promise<boolean> {
	const numer0n = await Numer0nContract.at(
		AztecAddress.fromString(contractAddress),
		new SignerlessWallet(pxe())
	);

	return await numer0n.methods.get_is_first().view();
}

export async function getRound(contractAddress: string): Promise<bigint> {
	const numer0n = await Numer0nContract.at(
		AztecAddress.fromString(contractAddress),
		new SignerlessWallet(pxe())
	);
	return await numer0n.methods.get_round().view();
}

export async function getResult(
	player: string,
	round: bigint,
	contractAddress: string
): Promise<number[]> {
	const numer0n = await Numer0nContract.at(
		AztecAddress.fromString(contractAddress),
		new SignerlessWallet(pxe())
	);

	const res = await numer0n.methods
		.get_result(AztecAddress.fromString(player), round)
		.view();

	return [res.call_num, res.eat, res.bite];
}

export async function getPlayer(
	player: string,
	contractAddress: string
): Promise<bigint[]> {
	const numer0n = await Numer0nContract.at(
		AztecAddress.fromString(contractAddress),
		new SignerlessWallet(pxe())
	);

	const res = await numer0n.methods
		.get_player(AztecAddress.fromString(player))
		.view();

	return [res.player_id, res.is_player];
}

export async function checkResult(
	call_num: bigint,
	secert_num: bigint,
	contractAddress: string
): Promise<bigint[]> {
	const numer0n = await Numer0nContract.at(
		AztecAddress.fromString(contractAddress),
		new SignerlessWallet(pxe())
	);
	const res = await numer0n.methods.check_result(call_num, secert_num).view();
	return [res.eat, res.bite];
}

export async function isValidNum(
	num: bigint,
	contractAddress: string
): Promise<boolean> {
	const numer0n = await Numer0nContract.at(
		AztecAddress.fromString(contractAddress),
		new SignerlessWallet(pxe())
	);
	return await numer0n.methods.is_valid_nums(num).view();
}

export async function getIfPlayersAdded(
	contractAddress: string
): Promise<boolean> {
	const game = await getGame(contractAddress);
	if (game.players[0] != 0n && game.players[1] != 0n) {
		return true;
	} else {
		return false;
	}
}

export async function getPlayerAddr(
	player_id: number,
	contractAddress: string
): Promise<string> {
	const game = await getGame(contractAddress);
	// console.log("game: ", game);

	const addr = fromBigIntToHexStrAddress(game.players[player_id - 1]);
	// console.log("addr getPlayerAddr: ", addr);
	return addr;
}

export async function getIsFinished(contractAddress: string): Promise<boolean> {
	const game = await getGame(contractAddress);
	return game.finished;
}

export async function getWinner(contractAddress: string): Promise<bigint> {
	const numer0n = await Numer0nContract.at(
		AztecAddress.fromString(contractAddress),
		new SignerlessWallet(pxe())
	);

	return numer0n.methods.get_winner().view();
}

async function getGame(contractAddress: string) {
	const numer0n = await Numer0nContract.at(
		AztecAddress.fromString(contractAddress),
		new SignerlessWallet(pxe())
	);

	return numer0n.methods.get_game().view();
}

// registry

export async function getGameContractByGameId(
	game_id: bigint
): Promise<string> {
	const numer0n = await RegistryContract.at(
		AztecAddress.fromString(registryAddress),
		new SignerlessWallet(pxe())
	);

	const addr = await numer0n.methods.get_game_address(game_id).view();
	console.log("addr: ", addr);
	return fromBigIntToHexStrAddress(addr);
}

const fromBigIntToHexStrAddress = (addr: bigint) => {
	// return "0x" + BigInt(addr).toString(16);
	return AztecAddress.fromBigInt(addr).toString();
};
