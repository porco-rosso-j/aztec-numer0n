import { useEffect, useState } from "react";
import { Button, Container, SimpleGrid, TextInput, Text } from "@mantine/core";
import PlayerBoard from "./PlayerBoard";
import EnemyBoard from "./EnemyBoard";
import Call from "./Call";
import AddNumMoodal from "./Modals/AddNumModal";
import { useGameContext } from "../contexts/useGameContext";
import CallHistory from "./CallHistory";

export default function Game() {
	const { secretNumber, playerId } = useGameContext();
	const [IsAddNumModalOpen, setOpenAddNumModal] = useState(false);

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

	return (
		<>
			<Container mt={20}>
				<SimpleGrid cols={2}>
					<PlayerBoard playerId={playerId} isOpponent={false} />
					<PlayerBoard playerId={playerId == 1 ? 2 : 1} isOpponent={true} />
				</SimpleGrid>
				<SimpleGrid cols={2}>
					<CallHistory isOpponent={false} />
					<CallHistory isOpponent={true} />
				</SimpleGrid>
				<Call />
				<AddNumMoodal isOpen={IsAddNumModalOpen} onClose={closeModal} />
			</Container>
		</>
	);
}
