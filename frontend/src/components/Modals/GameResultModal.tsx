/* eslint-disable react-hooks/exhaustive-deps */
import { Modal, Text, Box } from "@mantine/core";
import { useEffect } from "react";

type GameResultModalType = {
	isOpen: boolean;
	onClose: () => void;
	winnerId: number;
	playerId: number;
};

function GameResultModal(props: GameResultModalType) {
	useEffect(() => {
		const timerToClose = async () => {
			console.log("props.isOpen: ", props.isOpen);
			if (props.isOpen) {
				//await delay(3);
				props.onClose();
			}
		};
		const intervalId = setInterval(timerToClose, 3000);
		return () => {
			clearInterval(intervalId);
		};
	}, [props.isOpen, props.onClose]);
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
				{props.winnerId == props.playerId ? (
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
