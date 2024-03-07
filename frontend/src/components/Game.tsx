import { useEffect, useState } from "react";
import { Box, Container, Group, SimpleGrid, Text } from "@mantine/core";
import PlayerBoard from "./PlayerBoard";
import Call from "./Call";
import Item from "./Item";
import AddNumMoodal from "./Modals/AddNumModal";
import { useGameContext } from "../contexts/useGameContext";
import CallHistory from "./CallHistory";
import { getIsFirst, getRound, getIsFinished, getWinner } from "../scripts";
import TurnNotificationModal from "./Modals/TurnNotificationModal";
import GameResultModal from "./Modals/GameResultModal";

type GameType = {
	gameId: string;
};

export default function Game(props: GameType) {
	const { secretNumber, playerId, contractAddress, gameId } = useGameContext();
	const [IsAddNumModalOpen, setOpenAddNumModal] = useState(false);
	const [IsTurnNotificationModalOpen, setOpenTurnNotificationModal] =
		useState(false);
	const [isGameResultModalOpen, setIsGameResultModalOpen] = useState(false);

	const [isFirst, setIsFirst] = useState(true);
	const [round, setRount] = useState(0);
	const [isFinished, setIsFinished] = useState(false);
	const [winnerId, setWinnerId] = useState(0);
	const [itemUsed, setIsItemUsed] = useState(false);
	const [opponentSecretNum, setOpponentSecretNum] = useState<string>("");
	const [myTurn, setMyTurn] = useState(false);
	const [currentTurn, setCurrentTurn] = useState(0);

	// eslint-disable-next-line react-hooks/exhaustive-deps
	const updateStates = async () => {
		const _isFirst = await getIsFirst(contractAddress);
		const _round = await getRound(contractAddress);
		const _isFinished = await getIsFinished(contractAddress);
		const _winner = await getWinner(contractAddress);
		console.log("isFinished: ", _isFinished);
		setIsFirst(_isFirst);
		setRount(Number(_round));
		setIsFinished(_isFinished);
		if (_winner != 0n) {
			console.log("_winner: ", _winner);
			setWinnerId(Number(_winner));
		}
	};

	// set turn
	useEffect(() => {
		const intervalId = setInterval(updateStates, 5000);
		return () => {
			clearInterval(intervalId);
		};
		// updateStates();
	}, [updateStates]);

	// Add secret num
	useEffect(() => {
		(async () => {
			if (secretNumber == 0) {
				openModal();
			}
		})();
	}, [secretNumber]);

	useEffect(() => {
		if (winnerId != 0 && isFinished) {
			setIsGameResultModalOpen(true);
		}
	}, [winnerId, isFinished]);

	useEffect(() => {
		(async () => {
			let turn = 0;
			if (playerId == 1 && isFirst) {
				turn = 1;
			} else if (playerId == 1 && !isFirst) {
				turn = 2;
			} else if (playerId == 2 && isFirst) {
				turn = 2;
			} else if (playerId == 2 && !isFirst) {
				turn = 1;
			}

			if (turn == 1) {
				// setOpenTurnNotificationModal(true);
				setMyTurn(true);
				// return "You";

				if (turn != currentTurn && round > 0 && !isFinished) {
					setOpenTurnNotificationModal(true);
				}
			} else if (turn == 2) {
				setMyTurn(false);
				// return "Opponent";
			}

			if (round > 0) {
				setCurrentTurn(turn);
			}
		})();
	}, [currentTurn, isFirst, myTurn, playerId, round, isFinished, setMyTurn]);

	const openModal = () => {
		setOpenAddNumModal(true);
	};

	// Function to close the modal from the parent
	const closeModal = () => {
		setOpenAddNumModal(false);
	};

	const usedItem = () => {
		setIsItemUsed(true);
	};

	const historyUpdated = () => {
		setIsItemUsed(false);
	};

	const getOpponentSecretNum = (num: string) => {
		if (isFinished) {
			setOpponentSecretNum(num);
		}
	};

	const closeTurnNotificationModal = () => {
		setOpenTurnNotificationModal(false);
	};

	const closeGameResultModal = () => {
		setIsGameResultModalOpen(false);
	};

	return (
		<>
			<Container>
				<Box
					mt={20}
					style={{
						padding: "20px",
						backgroundColor: "white",
						borderRadius: "20px",
					}}
				>
					<Group
						grow
						ml={10}
						pb={10}
						style={{
							borderBottomStyle: "solid",
							borderBottomColor: "#c4c3d0",
							borderWidth: "1px",
						}}
					>
						<Text style={{ flex: 1, textAlign: "center" }}>
							Game ID: {props.gameId != "" ? props.gameId : gameId}
						</Text>
						{!isFinished ? (
							<Text style={{ flex: 1, textAlign: "center" }}>
								Who's turn: {round != 0 && myTurn ? "You!" : "Opponent"}{" "}
							</Text>
						) : (
							<Text style={{ flex: 1, textAlign: "center" }}>
								This game is over:{" "}
								{winnerId == 3
									? "draw"
									: winnerId == playerId
									? "you won"
									: "you lost"}
							</Text>
						)}

						<Text style={{ flex: 1, textAlign: "center" }}>Round: {round}</Text>
					</Group>
					<SimpleGrid cols={2}>
						<PlayerBoard
							playerId={playerId}
							isOpponent={false}
							opponentSecretNum={opponentSecretNum}
						/>
						<PlayerBoard
							playerId={playerId === 1 ? 2 : 1}
							isOpponent={true}
							opponentSecretNum={opponentSecretNum}
						/>
					</SimpleGrid>
					<SimpleGrid cols={2}>
						<CallHistory
							isOpponent={false}
							isFirst={isFirst}
							itemUsed={itemUsed}
							historyUpdated={historyUpdated}
							isFinished={isFinished}
							getOpponentSecretNum={getOpponentSecretNum}
						/>
						<CallHistory
							isOpponent={true}
							isFirst={isFirst}
							itemUsed={itemUsed}
							historyUpdated={historyUpdated}
							isFinished={isFinished}
							getOpponentSecretNum={getOpponentSecretNum}
						/>
					</SimpleGrid>

					<SimpleGrid cols={2} mx={30} mt={50} pb={100}>
						<Item
							playerId={playerId}
							isFirst={isFirst}
							isFinished={isFinished}
							usedItem={usedItem}
						/>
						<Call
							playerId={playerId}
							isFirst={isFirst}
							isFinished={isFinished}
							updateStates={updateStates}
						/>
					</SimpleGrid>
				</Box>

				<AddNumMoodal isOpen={IsAddNumModalOpen} onClose={closeModal} />
				<TurnNotificationModal
					isOpen={IsTurnNotificationModalOpen}
					onClose={closeTurnNotificationModal}
				/>
				<GameResultModal
					isOpen={isGameResultModalOpen}
					onClose={closeGameResultModal}
					winnerId={winnerId}
					playerId={playerId}
				/>
			</Container>
		</>
	);
}
