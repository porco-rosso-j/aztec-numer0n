import { useEffect, useState } from "react";
import { Center, Container, Group, SimpleGrid, Text } from "@mantine/core";
import PlayerBoard from "./PlayerBoard";
import Call from "./Call";
import Item from "./Item";
import AddNumMoodal from "./Modals/AddNumModal";
import { useGameContext } from "../contexts/useGameContext";
import CallHistory from "./CallHistory";
import { getIsFirst, getRound, getIsFinished, getWinner } from "../scripts";

type GameType = {
	gameId: string;
};

export default function Game(props: GameType) {
	const { secretNumber, playerId, contractAddress } = useGameContext();
	const [IsAddNumModalOpen, setOpenAddNumModal] = useState(false);
	const [isFirst, setIsFirst] = useState(true);
	const [round, setRount] = useState(0);
	const [isFinished, setIsFinished] = useState(false);
	const [winnerId, setWinnerId] = useState(0);
	const [itemUsed, setIsItemUsed] = useState(false);
	const [opponentSecretNum, setOpponentSecretNum] = useState<string>("");

	// set turn
	useEffect(() => {
		const checkStates = async () => {
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
		const intervalId = setInterval(checkStates, 5000);
		return () => {
			clearInterval(intervalId);
		};
	}, [contractAddress, setIsFirst, setIsFinished]);

	// Add secret num
	useEffect(() => {
		(async () => {
			if (secretNumber == 0) {
				openModal();
			}
		})();
	}, [secretNumber]);

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

	const getWhosTurn = () => {
		if (playerId == 1 && isFirst) {
			return "You!";
		} else if (playerId == 1 && !isFirst) {
			return "Opponent";
		} else if (playerId == 2 && isFirst) {
			return "Opponent";
		} else if (playerId == 2 && !isFirst) {
			return "You";
		} else {
			return "?";
		}
	};

	return (
		<>
			<Container mt={20}>
				<Group grow ml={10}>
					<Text style={{ flex: 1, textAlign: "center" }}>
						Game ID: {props.gameId}
					</Text>
					<Text style={{ flex: 1, textAlign: "center" }}>
						Who's turn: {getWhosTurn()}{" "}
					</Text>
					<Text style={{ flex: 1, textAlign: "center" }}>Round: {round}</Text>
					{winnerId != 0 && isFinished ? (
						<Center>
							<Text style={{ textAlign: "center", fontSize: "16px" }}>
								Result:{" "}
								{winnerId == playerId ? (
									<Text style={{ color: "#dd227f", fontSize: "16px" }}>
										You won!
									</Text>
								) : (
									<Text style={{ color: "#4169e1", fontSize: "16px" }}>
										You lost
									</Text>
								)}
							</Text>
						</Center>
					) : null}
				</Group>
				<SimpleGrid cols={2}>
					<PlayerBoard
						playerId={playerId}
						isOpponent={false}
						opponentSecretNum={opponentSecretNum}
					/>
					<PlayerBoard
						playerId={playerId == 1 ? 2 : 1}
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
				<Group grow mx={130} mt={100}>
					<Item playerId={playerId} usedItem={usedItem} />
					<Call playerId={playerId} />
				</Group>

				<AddNumMoodal isOpen={IsAddNumModalOpen} onClose={closeModal} />
			</Container>
		</>
	);
}
