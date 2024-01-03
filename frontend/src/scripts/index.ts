import {
	Fr,
	PXE,
	AztecAddress,
	AccountWalletWithPrivateKey,
	computeAuthWitMessageHash,
	createPXEClient,
	SignerlessWallet,
} from "@aztec/aztec.js";

import { Numer0nContract } from "../artifacts/Numer0n.js";
import { RegistryContract } from "../artifacts/Registry.js";
import { registryAddress, SANDBOX_URL } from "./constants.js";
import { addGameIdNote } from "./add_note.js";

type GameCreated = {
	contractAddress: AztecAddress;
	gameCount: number;
};

export const pxe = (): PXE => {
	return createPXEClient(SANDBOX_URL);
};

export async function createGame(
	player: AccountWalletWithPrivateKey,
	password: bigint
): Promise<GameCreated> {
	let contractAddress: AztecAddress;
	let gameCount: bigint;

	try {
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
		await registry.methods.add_game(receipt.contractAddress).send().wait();

		gameCount = await registry.methods.get_current_count().view();
		console.log("gameCount: ", gameCount);
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
	target: AccountWalletWithPrivateKey,
	call_num: bigint,
	contractAddress: string
) {
	try {
		const numer0n = await Numer0nContract.at(
			AztecAddress.fromString(contractAddress),
			player
		);

		const action = numer0n.methods.call_num(target.getAddress(), call_num);
		const messageHash = computeAuthWitMessageHash(
			player.getAddress(),
			action.request()
		);
		const witness = await target.createAuthWitness(messageHash);
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

// export async function getIfPlayersAdded(
// 	contractAddress: string
// ): Promise<boolean> {
// 	const numer0n = await Numer0nContract.at(
// 		AztecAddress.fromString(contractAddress),
// 		new SignerlessWallet(pxe())
// 	);
// 	return await numer0n.methods.get_if_players_added().view();
// }

export async function getIfPlayersAdded(
	contractAddress: string
): Promise<boolean> {
	const game = await getGame(contractAddress);
	if (game.is_number_set[0] && game.is_number_set[1]) {
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
	return game.players[player_id - 1].toString();
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
	game_id: number
): Promise<string> {
	const numer0n = await RegistryContract.at(
		AztecAddress.fromString(registryAddress),
		new SignerlessWallet(pxe())
	);
	return await numer0n.methods.get_game_address(game_id).view();
}
