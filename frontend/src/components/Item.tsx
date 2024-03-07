/* eslint-disable react-hooks/rules-of-hooks */
import { Button, Center, Stack, Select, Text } from "@mantine/core";
import { useState } from "react";
import { useGameContext } from "../contexts/useGameContext";
import {
	useAttackItem,
	getAccountByAddress,
	getResult,
	getRound,
} from "../scripts";
import UseItemModal from "./Modals/UseItemModal";
import DefenseItemModal from "./Modals/useDefenseItemModal";

type ItemType = {
	playerId: number;
	isFirst: boolean;
	isFinished: boolean;
	usedItem: () => void;
};

export default function Item(props: ItemType) {
	const { player1Address, player2Address, contractAddress } = useGameContext();
	const [selectedNum, setSelectedNum] = useState<number>(0);
	const [targetNum, setTargetNum] = useState<number>(0);
	const [callDisabled, setCallDisabled] = useState<boolean>(true);
	const [calling, setCalling] = useState<boolean>(false);
	const [IsUseItemModalOpen, setOpenUseNumModal] = useState(false);
	const [IsUseDefenseItemModalOpen, setOpenUseDefenseItemModal] =
		useState(false);
	const [itemResult, setItemResult] = useState<number[]>([]);
	const [errorMessage, setErrorMessage] = useState("");

	console.log("targetNum", targetNum);

	async function handleCall() {
		setErrorMessage("");
		if (props.isFinished) {
			setErrorMessage("Game is over");
			setCalling(false);
			return;
		} else if (
			(props.isFirst && props.playerId == 2) ||
			(!props.isFirst && props.playerId == 1)
		) {
			setErrorMessage("Not your turn");
			setCalling(false);
			return;
		}
		if (selectedNum != 0 && selectedNum <= 3) {
			try {
				setCalling(true);
				const round = await getRound(contractAddress);
				const playerAddr =
					props.playerId == 1 ? player1Address : player2Address;
				const opponentAddr =
					props.playerId == 1 ? player2Address : player1Address;
				const player = await getAccountByAddress(playerAddr);
				const opponent = await getAccountByAddress(opponentAddr);

				await useAttackItem(
					player,
					opponent,
					BigInt(selectedNum),
					contractAddress,
					BigInt(targetNum)
				);
				const result = await getResult(playerAddr, round, contractAddress);
				console.log("result: ", result);
				if (result[3] != 0) {
					setItemResult(result);
					openModal();
				}

				props.usedItem();
			} finally {
				setCalling(false);
			}
		} else if (selectedNum > 3 && selectedNum < 6) {
			try {
				setCalling(true);
				openDefenseItemModal();
			} finally {
				setCalling(false);
			}
		}
	}

	const openModal = () => {
		setOpenUseNumModal(true);
	};

	// Function to close the modal from the parent
	const closeModal = () => {
		setOpenUseNumModal(false);
	};

	const openDefenseItemModal = () => {
		setOpenUseDefenseItemModal(true);
	};

	// Function to close the modal from the parent
	const closeDeffeseItemModal = () => {
		setOpenUseDefenseItemModal(false);
	};

	const handleSelectedNum = (value: string | null) => {
		if (value) {
			setSelectedNum(Number(value));
			setCallDisabled(false);
		}
	};

	return (
		<>
			<Center mb={6}>
				<Stack>
					<Select
						mt={20}
						placeholder="Select an item"
						value={selectedNum.toString()}
						onChange={(value) => handleSelectedNum(value)}
						data={[
							{ value: "1", label: "1. High & Low" },
							{ value: "2", label: "2. Slash" },
							{ value: "3", label: "3. Target" },
							{ value: "4", label: "4. Change" },
							{ value: "5", label: "5. Shuffle" },
						]}
					/>
					{selectedNum == 3 ? (
						<Select
							description={"target number"}
							placeholder="Select target number"
							value={targetNum.toString()}
							onChange={(value) => setTargetNum(Number(value))}
							data={["0", "1", "2", "3", "4", "5", "6", "7", "8", "9"]}
						/>
					) : null}
					<Button
						mt={10}
						variant="filled"
						loading={calling}
						onClick={handleCall}
						disabled={callDisabled}
					>
						Use
					</Button>
					{errorMessage ? (
						<Text c={"red"} style={{ textAlign: "center" }}>
							{errorMessage}
						</Text>
					) : (
						""
					)}
				</Stack>
			</Center>
			<UseItemModal
				isOpen={IsUseItemModalOpen}
				onClose={closeModal}
				itemRsult={itemResult}
				targetNum={targetNum}
			/>
			<DefenseItemModal
				isOpen={IsUseDefenseItemModalOpen}
				onClose={closeDeffeseItemModal}
				itemType={selectedNum}
				playerId={props.playerId}
			/>
		</>
	);
}
