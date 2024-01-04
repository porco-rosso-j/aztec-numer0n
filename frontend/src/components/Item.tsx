/* eslint-disable react-hooks/rules-of-hooks */
import { Button, Center, Stack, Select } from "@mantine/core";
import { useState } from "react";
import { useGameContext } from "../contexts/useGameContext";
import { useItem, getAccountByAddress, getResult, getRound } from "../scripts";

type ItemType = {
	playerId: number;
	usedItem: () => void;
};

export default function Item(props: ItemType) {
	const { player1Address, player2Address, contractAddress } = useGameContext();
	const [selectedNum, setSelectedNum] = useState<number>(0);
	const [callDisabled, setCallDisabled] = useState<boolean>(true);

	async function handleCall() {
		if (selectedNum != 0) {
			const round = await getRound(contractAddress);
			const playerAddr = props.playerId == 1 ? player1Address : player2Address;
			const opponentAddr =
				props.playerId == 1 ? player2Address : player1Address;
			const player = await getAccountByAddress(playerAddr);
			const opponent = await getAccountByAddress(opponentAddr);
			await useItem(player, opponent, BigInt(selectedNum), contractAddress);

			const result = await getResult(playerAddr, round, contractAddress);
			console.log("result: ", result);

			props.usedItem();
		}
	}

	const handleSelectedNum = (value: string | null) => {
		if (value) {
			setSelectedNum(Number(value));
			setCallDisabled(false);
		}
	};

	return (
		<>
			<Center>
				<Stack>
					<Select
						mb={25}
						placeholder="Select an item"
						value={selectedNum.toString()}
						onChange={(value) => handleSelectedNum(value)}
						data={[
							{ value: "1", label: "1. High & Low" },
							{ value: "2", label: "2. Slash" },
							{ value: "3", label: "3. Target" },
							{ value: "4", label: "4. Shuffle" },
							{ value: "5", label: "5. Change" },
						]}
					/>
					<Button variant="filled" onClick={handleCall} disabled={callDisabled}>
						Use
					</Button>
				</Stack>
			</Center>
		</>
	);
}
