import { useEffect, useState } from "react";
import { Container, Group, SimpleGrid, Text } from "@mantine/core";
import PlayerBoard from "./PlayerBoard";
import Call from "./Call";
import AddNumMoodal from "./Modals/AddNumModal";
import { useGameContext } from "../contexts/useGameContext";
import CallHistory from "./CallHistory";
import { getIsFirst, getRound, getIsFinished } from "../scripts";

export default function Game() {
	const { secretNumber, playerId, contractAddress } = useGameContext();
	const [IsAddNumModalOpen, setOpenAddNumModal] = useState(false);
	const [isFirst, setIsFirst] = useState(true);
	const [round, setRount] = useState(0);
	const [isFinished, setIsFinished] = useState(false);

	// set turn
	useEffect(() => {
		const checkStates = async () => {
			const _isFirst = await getIsFirst(contractAddress);
			const _round = await getRound(contractAddress);
			const _isFinished = await getIsFinished(contractAddress);
			console.log("isFinished: ", _isFinished);
			setIsFirst(_isFirst);
			setRount(Number(_round));
			setIsFinished(_isFinished);
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

	// const incrementCallCount = async (isOpponent: boolean) => {
	// 	if (isOpponent) {
	// 		setOpponentCallCount(opponentCallCount + 1);
	// 	} else {
	// 		setPlayerCallCount(playerCallCount + 1);
	// 	}
	// };

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
				<Group grow>
					<Text style={{ flex: 1, textAlign: "center" }}>Game ID: 0x35511</Text>
					<Text style={{ flex: 1, textAlign: "center" }}>
						Who's turn: {getWhosTurn()}{" "}
					</Text>
					<Text style={{ flex: 1, textAlign: "center" }}>Round: {round}</Text>
				</Group>
				<SimpleGrid cols={2}>
					<PlayerBoard playerId={playerId} isOpponent={false} />
					<PlayerBoard playerId={playerId == 1 ? 2 : 1} isOpponent={true} />
				</SimpleGrid>
				<SimpleGrid cols={2}>
					<CallHistory
						isOpponent={false}
						isFirst={isFirst}
						// callCount={playerCallCount}
					/>
					<CallHistory
						isOpponent={true}
						isFirst={isFirst}
						// callCount={opponentCallCount}
					/>
				</SimpleGrid>
				<Call playerId={playerId} />
				<AddNumMoodal isOpen={IsAddNumModalOpen} onClose={closeModal} />
			</Container>
		</>
	);
}
