import { useEffect, useState } from "react";
import {
	Button,
	Container,
	Center,
	Text,
	TextInput,
	Group,
	Stack,
	Box,
	Loader,
} from "@mantine/core";
import React from "react";
import { useGameContext } from "../contexts/useGameContext";
import Game from "./Game";
import {
	createGame,
	getGameContractByGameId,
	getIfPlayersAdded,
	getPlayerAddr,
	joinGame,
	pxe,
} from "../scripts";
import { getSandboxAccountsWallets, Fr } from "@aztec/aztec.js";

export default function Onboard() {
	const {
		playersReady,
		contractAddress,
		savePlayersReady,
		saveContractAddress,
		savePlayer1Address,
		savePlayer2Address,
	} = useGameContext();

	// gameID = game count + game password
	const [gameID, setGameID] = useState<string>("");
	const [isGameCreated, setIsGameCreated] = useState<boolean>(false);
	const [loading, setLoading] = useState(false);
	// const [gameID, setGameID] = useState<number>(0);
	// const [gamePassword, setGamePassword] = useState<string>("");

	async function handleCreateNewGame() {
		setLoading(true);

		const player1 = (await getSandboxAccountsWallets(pxe()))[0];

		// generate game password
		const gamePassword = Fr.random().toShortString().slice(0, 5);
		console.log("gamePassword: ", gamePassword);

		// deploy
		const gameCreated = await createGame(player1, BigInt(gamePassword));
		console.log("gameCreated: ", gameCreated);
		const gameID = gamePassword.concat(gameCreated.gameCount.toString());
		console.log("gameID: ", gameID);

		savePlayer1Address(player1.getAddress().toString());
		saveContractAddress(gameCreated.contractAddress.toString());
		setGameID(gameID);

		setIsGameCreated(true);
		setLoading(false);
	}

	// Player 1 starts the game
	useEffect(() => {
		(async () => {
			if (contractAddress != "") {
				const is_ready = await getIfPlayersAdded(contractAddress);
				if (is_ready) {
					const player2 = await getPlayerAddr(2, contractAddress);
					savePlayer2Address(player2);
					savePlayersReady(true);
				}
			}
		})();
	}, [contractAddress, savePlayer2Address, savePlayersReady]);

	// Player 2 joins the game
	useEffect(() => {
		(async () => {
			if (gameID != "" && !isGameCreated) {
				const _gameContractId = gameID.slice(5);
				const _gamePassword = gameID.slice(0, 5);
				const gameContractAddress = await getGameContractByGameId(
					Number(_gameContractId)
				);

				const player2 = (await getSandboxAccountsWallets(pxe()))[1];
				await joinGame(player2, gameContractAddress, BigInt(_gamePassword));

				const is_ready = await getIfPlayersAdded(gameContractAddress);
				const player1 = await getPlayerAddr(1, gameContractAddress);

				if (is_ready) {
					saveContractAddress(gameContractAddress);
					savePlayer1Address(player1);
					savePlayer2Address(player2.getAddress().toString());
					savePlayersReady(true);
				}
			}
		})();
	}, [
		gameID,
		isGameCreated,
		saveContractAddress,
		savePlayer1Address,
		savePlayer2Address,
		savePlayersReady,
	]);

	return (
		<>
			{!playersReady ? (
				<Container my={150}>
					<Text
						style={{
							marginTop: 100,
							fontSize: "35px",
							textAlign: "center",
						}}
					>
						Welcome To Numer0n!
					</Text>
					<Text
						style={{
							marginTop: 20,
							fontSize: "20px",
							textAlign: "center",
						}}
						mx={40}
						mb={50}
					>
						Numer0n is a number-guessing game in which two persons are against
						each other. <br /> Built on Aztec Sandbox.
					</Text>
					{isGameCreated ? (
						<Text style={{ textAlign: "center" }}>
							New Game successfully Created! <br /> Share your game id: {gameID}{" "}
							with your friend!
						</Text>
					) : (
						<Center style={{ height: "30vh", flexDirection: "column" }}>
							<Button
								style={{ textAlign: "center" }}
								onClick={handleCreateNewGame}
							>
								Create a new game
							</Button>
							{loading ? (
								<Center style={{ marginTop: "20px", marginBottom: "10px" }}>
									<Loader color="gray" size="sm" />{" "}
									{/* 'size' and 'color' can be adjusted as needed */}
								</Center>
							) : (
								<Box>
									<Text
										style={{
											fontSize: "15px",
											textAlign: "center",
										}}
										// my={15}
										mt={45}
										mb={15}
									>
										Or join a game ↓
									</Text>
									<Stack mt={15} mx={10}>
										<Group align="center" style={{ fontSize: "15px" }}>
											<Text style={{ flex: 3 }}> Game ID:</Text>
											<TextInput
												onChange={(event) =>
													setGameID(event.currentTarget.value)
												}
												value={gameID}
												placeholder="0x1253"
												style={{ flex: "none", width: "150px" }}
											/>
										</Group>
									</Stack>
								</Box>
							)}
						</Center>
					)}
				</Container>
			) : (
				<Game />
			)}
		</>
	);
}
