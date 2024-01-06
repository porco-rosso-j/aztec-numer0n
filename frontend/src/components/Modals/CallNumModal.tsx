/* eslint-disable react-hooks/exhaustive-deps */
import {
	Modal,
	Text,
	Button,
	Box,
	Group,
	Divider,
	Center,
	Stack,
} from "@mantine/core";
import { useState, useEffect } from "react";
import { stringfyAndPaddZero } from "../../scripts/utils";

type CallNumModalType = {
	isOpen: boolean;
	onClose: () => void;
	result: number[];
};

type CallResult = {
	guess: string;
	eat: number;
	bite: number;
};

const emptyResult: CallResult = {
	guess: "0",
	eat: 0,
	bite: 0,
};

function CallNumModal(props: CallNumModalType) {
	const [callResult, setCallResult] = useState<CallResult>(emptyResult);

	const handleResult = () => {
		const newResult: CallResult = {
			guess: stringfyAndPaddZero(props.result[0]),
			eat: props.result[1],
			bite: props.result[2],
		};

		console.log("moda; newResult] ", newResult);
		setCallResult(newResult);
	};

	useEffect(() => {
		console.log("callResult?.guess: ", callResult.guess);
		if (props.isOpen && callResult.guess == "0") {
			handleResult();
			const intervalId = setInterval(handleResult, 10000);
			return () => {
				clearInterval(intervalId);
			};
		}
	}, [handleResult]);

	const handleClose = () => {
		setCallResult(emptyResult);
		props.onClose();
	};

	return (
		<Modal
			size="xs"
			opened={props.isOpen}
			onClose={handleClose}
			centered
			withCloseButton={false}
		>
			<Box
				style={{
					backgroundColor: "#white",
					color: "black",
					textAlign: "center",
				}}
			>
				<Text size="lg" mt={5} mb={10} style={{ fontSize: "20px" }}>
					Call Result
				</Text>
				<Box
					style={{
						margin: "auto",
						display: "flex",
						flexDirection: "column",
						alignItems: "center",
						justifyContent: "space-between",
					}}
				>
					<Group align="stretch" mb={15}>
						<Stack
							gap="5px"
							style={{
								fontSize: 16,
								textAlign: "start",
								marginRight: "2rem",
							}}
						>
							<Text>- Guess:</Text>
							<Text>- Eat:</Text>
							<Text>- Bite:</Text>
						</Stack>
						<Stack gap="5px" style={{ fontSize: 16, textAlign: "center" }}>
							<Text>{callResult?.guess}</Text>
							<Text>{callResult?.eat}</Text>
							<Text>{callResult?.bite}</Text>
						</Stack>
					</Group>
				</Box>
				<Divider my="sm" />
				<Center mt={15} mb={5}>
					<Group>
						<Button color="gray" onClick={handleClose}>
							Close
						</Button>
					</Group>
				</Center>
			</Box>
		</Modal>
	);
}

export default CallNumModal;
