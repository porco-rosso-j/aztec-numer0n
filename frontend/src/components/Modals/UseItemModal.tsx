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
import { HighLow, Target, item } from "../../scripts/constants";

type UseItemModalType = {
	isOpen: boolean;
	onClose: () => void;
	itemRsult: number[];
	targetNum: number;
};

type ItemResult = {
	item: string;
	item_result: string;
};

const emptyItemResult: ItemResult = {
	item: "",
	item_result: "",
};

function UseItemModal(props: UseItemModalType) {
	const [itemResult, setItemResult] = useState<ItemResult>(emptyItemResult);

	const handleResult = () => {
		const newResult: ItemResult = {
			item: item(props.itemRsult[3]),
			item_result: "",
		};

		if (props.itemRsult[3] == 1) {
			newResult.item_result = HighLow(props.itemRsult[4]);
		} else if (props.itemRsult[3] == 3) {
			newResult.item_result = Target(props.itemRsult[4]);
		} else {
			newResult.item_result = props.itemRsult[4].toString();
		}

		console.log("moda; newResult] ", newResult);
		setItemResult(newResult);
	};

	useEffect(() => {
		console.log("itemResult.itemResult: ", itemResult.item);
		if (props.isOpen && itemResult.item == "") {
			handleResult();
			const intervalId = setInterval(handleResult, 10000);
			return () => {
				clearInterval(intervalId);
			};
		}
	}, [handleResult]);

	const handleClose = () => {
		setItemResult(emptyItemResult);
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
					Item Result
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
							<Text>- Item:</Text>
							<Text>- Result:</Text>
						</Stack>
						<Stack gap="5px" style={{ fontSize: 16, textAlign: "center" }}>
							<Text>{itemResult.item}</Text>
							<Text>{itemResult.item_result}</Text>
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

export default UseItemModal;
