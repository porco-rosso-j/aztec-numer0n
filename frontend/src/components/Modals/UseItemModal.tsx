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
// import { useState, useEffect } from "react";
import { HighLow, ItemType, itemName } from "../../scripts/constants";
import { ItemResult } from "../Item";
import { Result } from "../CallHistory";

type UseItemModalType = {
	isOpen: boolean;
	onClose: () => void;
	result: Result;
};

function UseItemModal({ isOpen, onClose: handleClose, result }: UseItemModalType) {
	if (!result) return
	console.log("i================================= ")
	let itemResult = result.item_result.toString()
	switch (result.item) {
		case ItemType.HIGH_AND_LOW:
			itemResult = HighLow(result.item_result)
	}

	return (
		<Modal
			size="xs"
			opened={isOpen}
			centered
			onClose={handleClose}
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
							<Text>{itemName(result.item)}</Text>
							<Text>{itemResult}</Text>
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
