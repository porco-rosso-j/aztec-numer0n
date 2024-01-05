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

type CallNumModalType = {
	isOpen: boolean;
	onClose: () => void;
	result: number[];
};

type ResultRow = {
	guess: string;
	eat: number;
	bite: number;
	item: number;
	item_result: number;
};

const emptyRow: ResultRow = {
	guess: "0",
	eat: 0,
	bite: 0,
	item: 0,
	item_result: 0,
};

function CallNumModal(props: CallNumModalType) {
	const [resultRow, setResultRow] = useState<ResultRow>(emptyRow);

	const handleResult = () => {
		const newResult: ResultRow = {
			guess: props.result[0].toString(),
			eat: props.result[1],
			bite: props.result[2],
			item: props.result[3],
			item_result: props.result[4],
		};

		console.log("moda; newResult] ", newResult);
		setResultRow(newResult);
	};

	useEffect(() => {
		console.log("resultRow?.guess: ", resultRow.guess);
		if (props.isOpen && resultRow.guess == "0") {
			handleResult();
			const intervalId = setInterval(handleResult, 10000);
			return () => {
				clearInterval(intervalId);
			};
		}
	}, [handleResult]);

	const handleClose = () => {
		setResultRow(emptyRow);
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
							<Text>{resultRow?.guess}</Text>
							<Text>{resultRow?.eat}</Text>
							<Text>{resultRow?.bite}</Text>
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
