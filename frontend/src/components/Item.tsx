/* eslint-disable react-hooks/rules-of-hooks */
import { Button, Center, Stack, Select } from "@mantine/core";
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
import { ItemType, itemName } from "../scripts/constants";
import { useDisclosure } from "@mantine/hooks";
import { Result } from "./CallHistory";

type ItemProps = {
	playerId: number;
	usedItem: () => void;
};

export default function Item(props: ItemProps) {
	const { player1Address, player2Address, contractAddress } = useGameContext();
	const [selectedItem, selectItem] = useState<ItemType | 0>(0);
	const [callDisabled, setCallDisabled] = useState<boolean>(true);
	const [calling, setCalling] = useState<boolean>(false);
	const [openedUseItemModal, { open: openUseItemModal, close: closeUseItemModal }] = useDisclosure(false);
	const [IsUseDefenseItemModalOpen, setOpenUseDefenseItemModal] =
		useState(false);
	const [result, setResult] = useState<Result>();

	async function handleCall() {
		switch (selectedItem) {
			case ItemType.HIGH_AND_LOW:
			case ItemType.SLASH:
			case ItemType.TARGET:
				try {
					setCalling(true);
					const playerAddr =
						props.playerId == 1 ? player1Address : player2Address;
					const opponentAddr =
						props.playerId == 1 ? player2Address : player1Address;
					const player = await getAccountByAddress(playerAddr);
					const opponent = await getAccountByAddress(opponentAddr);

					await useAttackItem(
						player,
						opponent,
						BigInt(selectedItem),
						contractAddress,
						0n
					);

					const round = await getRound(contractAddress);
					const resResult = await getResult(playerAddr, round, contractAddress);
					console.log("result: ", resResult);
					if (resResult.item) {
						setResult(result);
						openUseItemModal();
					}

					props.usedItem();
				} finally {
					setCalling(false);
				}
				break

			case ItemType.CHANGE:
			case ItemType.SHUFFLE:
				try {
					setCalling(true);
					openDefenseItemModal();
				} finally {
					setCalling(false);
				}
		}
	}

	const openDefenseItemModal = () => {
		setOpenUseDefenseItemModal(true);
	};

	// Function to close the modal from the parent
	const closeDeffeseItemModal = () => {
		setOpenUseDefenseItemModal(false);
	};

	const handleSelectedNum = (value: string | null) => {
		if (value) {
			selectItem(Number(value));
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
						value={selectedItem.toString()}
						onChange={handleSelectedNum}
						data={[
							{ value: ItemType.HIGH_AND_LOW.toString(), label: itemName(ItemType.HIGH_AND_LOW) },
							{ value: ItemType.SLASH.toString(), label: itemName(ItemType.SLASH) },
							{ value: ItemType.TARGET.toString(), label: itemName(ItemType.TARGET) },
							{ value: ItemType.CHANGE.toString(), label: itemName(ItemType.CHANGE) },
							{ value: ItemType.SHUFFLE.toString(), label: itemName(ItemType.SHUFFLE) },
						]}
					/>
					<Button
						mt={10}
						variant="filled"
						loading={calling}
						onClick={handleCall}
						disabled={callDisabled}
					>
						Use
					</Button>
				</Stack>
			</Center>
			<UseItemModal
				isOpen={openedUseItemModal}
				onClose={closeUseItemModal}
				result={result as Result}
			/>
			<DefenseItemModal
				isOpen={IsUseDefenseItemModalOpen}
				onClose={closeDeffeseItemModal}
				itemType={selectedItem}
				playerId={props.playerId}
			/>
		</>
	);
}
