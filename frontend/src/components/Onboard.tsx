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
	CopyButton,
	Anchor,
} from "@mantine/core";
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
		savePlayerId,
		saveSecretNumber,
		saveGameId,
	} = useGameContext();

	// gameID = game count + game password
	const [gameID, setGameID] = useState<string>("");
	const [isGameCreated, setIsGameCreated] = useState<boolean>(false);
	const [isGameJoined, setIsGameJoined] = useState<boolean>(false);
	const [loadingCreate, setLoadingCreate] = useState(false);
	const [loadingJoin, setLoadingJoin] = useState(false);

	// Restore data from browser storage
	useEffect(() => {
		const restoreData = async () => {
			const storedData1 = localStorage.getItem(`player1_address`);
			const player1_address = storedData1 ? JSON.parse(storedData1) : undefined;
			console.log("player1_address: ", player1_address);

			const storedData2 = localStorage.getItem(`player2_address`);
			const player2_address = storedData2 ? JSON.parse(storedData2) : undefined;
			console.log("player2_address: ", player2_address);

			const storedData3 = localStorage.getItem(`contract_address`);
			const contract_address = storedData3
				? JSON.parse(storedData3)
				: undefined;
			console.log("contract_address: ", contract_address);

			const storedData4 = localStorage.getItem(`player_id`);
			const player_id = storedData4 ? JSON.parse(storedData4) : undefined;
			console.log("player_id: ", player_id);

			const storedData5 = localStorage.getItem(`secret_num`);
			const secret_num = storedData5 ? JSON.parse(storedData5) : undefined;
			console.log("secret_num: ", secret_num);

			const storedData6 = localStorage.getItem(`game_id`);
			const game_id = storedData6 ? JSON.parse(storedData6) : undefined;
			console.log("game_id: ", game_id);

			if (
				player1_address &&
				player2_address &&
				contract_address &&
				player_id &&
				secret_num &&
				game_id
			) {
				savePlayer1Address(player1_address),
					savePlayer2Address(player2_address),
					saveContractAddress(contract_address),
					savePlayerId(player_id),
					saveSecretNumber(secret_num),
					saveGameId(game_id),
					savePlayersReady(true);
			}
		};

		// Call the function immediately if needed or just set the interval
		if (!playersReady) {
			restoreData();
			const intervalId = setInterval(restoreData, 5000);
			return () => {
				clearInterval(intervalId);
			};
		}
	}, [
		contractAddress,
		isGameCreated,
		playersReady,
		savePlayer2Address,
		savePlayersReady,
		savePlayerId,
		savePlayer1Address,
		saveContractAddress,
		saveSecretNumber,
		saveGameId,
	]);

	// Player 1 starts the game as player 2 joins
	useEffect(() => {
		const startGame = async () => {
			if (isGameCreated && contractAddress != "") {
				const is_ready = await getIfPlayersAdded(contractAddress);
				if (is_ready) {
					const player2 = await getPlayerAddr(2, contractAddress);
					savePlayer2Address(player2);
					savePlayersReady(true);
					savePlayerId(1);
				}
			}
		};

		// Call the function immediately if needed or just set the interval
		if (isGameCreated && contractAddress !== "") {
			startGame();
		}

		const intervalId = setInterval(startGame, 5000);
		return () => {
			clearInterval(intervalId);
		};
	}, [
		contractAddress,
		isGameCreated,
		savePlayer2Address,
		savePlayersReady,
		savePlayerId,
	]);

	async function handleCreateNewGame() {
		setLoadingCreate(true);

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
		saveGameId(gameID);

		setIsGameCreated(true);
		setLoadingCreate(false);
	}

	// Player 2 joins game
	const handleJoinGame = async () => {
		if (!isGameJoined && !isGameCreated && gameID != "") {
			setLoadingJoin(true);
			const _gameContractId = gameID.slice(5);
			const _gamePassword = gameID.slice(0, 5);
			const gameContractAddress = await getGameContractByGameId(
				BigInt(_gameContractId)
			);

			console.log("gameContractAddress: ", gameContractAddress);

			const player2 = (await getSandboxAccountsWallets(pxe()))[1];

			const _is_ready = await getIfPlayersAdded(gameContractAddress);
			if (!_is_ready) {
				await joinGame(player2, gameContractAddress, BigInt(_gamePassword));
			}

			const is_ready = await getIfPlayersAdded(gameContractAddress);
			const player1 = await getPlayerAddr(1, gameContractAddress);

			if (is_ready) {
				saveContractAddress(gameContractAddress);
				savePlayer1Address(player1);
				savePlayer2Address(player2.getAddress().toString());
				savePlayersReady(true);
				savePlayerId(2);
				saveGameId(gameID);

				setIsGameJoined(true);
			}

			setLoadingJoin(false);
		}
	};

	return (
		<>
			{!playersReady ? (
				<Container mt={100}>
					<Box mb={100}>
						<Text
							style={{
								marginTop: 50,
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
							Numer0n is a number-guessing game like a "Hit & Blow". <br />{" "}
							Built on Aztec Sandbox.
						</Text>
					</Box>
					{isGameCreated ? (
						<Text style={{ textAlign: "center" }}>
							A new game was successfully created! <br />
							Please share your game id:{" "}
							<CopyButton value={gameID}>
								{({ copied, copy }) => (
									<Anchor onClick={copy} style={{ cursor: "pointer" }}>
										{copied ? "copied! " : gameID}
									</Anchor>
								)}
							</CopyButton>{" "}
							with your friend and wait for them joining...
						</Text>
					) : (
						<Center style={{ flexDirection: "column" }}>
							{!loadingJoin && (
								<Button
									style={{ textAlign: "center" }}
									onClick={handleCreateNewGame}
									loading={loadingCreate}
								>
									Create a new game
								</Button>
							)}
							{!loadingCreate && (
								<Box>
									<Text
										style={{
											fontSize: "15px",
											textAlign: "center",
										}}
										mt={45}
										mb={25}
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
										<Button
											mt={10}
											mx={35}
											variant="filled"
											color="cyan"
											style={{ textAlign: "center" }}
											onClick={handleJoinGame}
											loading={loadingJoin}
										>
											Join game
										</Button>
									</Stack>
								</Box>
							)}
						</Center>
					)}
				</Container>
			) : (
				<Game gameId={gameID} />
			)}
		</>
	);
}
