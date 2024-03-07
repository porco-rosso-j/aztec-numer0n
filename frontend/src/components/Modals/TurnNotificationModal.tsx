/* eslint-disable react-hooks/exhaustive-deps */
import { Modal, Text, Box } from "@mantine/core";
import { useEffect } from "react";

type TurnNotificationModalType = {
	isOpen: boolean;
	onClose: () => void;
};

function TurnNotificationModal(props: TurnNotificationModalType) {
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
				mb={50}
			>
				<Text size="30px" mt={5} mb={10} style={{ fontSize: "25px" }}>
					Your Turn!
				</Text>
			</Box>
		</Modal>
	);
}

export default TurnNotificationModal;
