/* eslint-disable react-hooks/exhaustive-deps */
import { Modal, Text, Box } from "@mantine/core";

type GameResultModalType = {
	isOpen: boolean;
	onClose: () => void;
	winnerId: number;
	playerId: number;
};

function GameResultModal(props: GameResultModalType) {
	return (
		<Modal size="xs" opened={props.isOpen} onClose={props.onClose} centered>
			<Box
				style={{
					backgroundColor: "#white",
					color: "black",
					textAlign: "center",
				}}
				p={30}
				mb={50}
			>
				{props.winnerId == 3 ? (
					<Text fw={700} style={{ fontSize: "25px" }}>
						🙃 Draw game 🙃
					</Text>
				) : props.winnerId == props.playerId ? (
					<Text fw={700} style={{ color: "#dd227f", fontSize: "25px" }}>
						🎉🎉 You won! 🎉🎉
					</Text>
				) : (
					<Text
						fw={700}
						style={{
							color: "#4169e1",
							fontSize: "25px",
						}}
					>
						{" "}
						😭😭 You lost 😭😭
					</Text>
				)}
			</Box>
		</Modal>
	);
}

export default GameResultModal;
