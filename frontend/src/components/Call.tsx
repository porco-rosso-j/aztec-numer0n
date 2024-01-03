import { Button, Center, Stack, PinInput } from "@mantine/core";
import { useState } from "react";
import { numLen } from "../scripts/constants";
import { useGameContext } from "../contexts/useGameContext";
import {
	callNumber,
	getAccountByAddress,
	getResult,
	getRound,
} from "../scripts";

type CallType = {
	playerId: number;
	// incrementCallCount: () => void;
};

export default function Call(props: CallType) {
	const { player1Address, player2Address, contractAddress } = useGameContext();
	const [input, setInput] = useState<string>();
	const [callDisabled, setCallDisabled] = useState<boolean>(true);
	const [nums, setNums] = useState<number[]>();
	// const [input,setInput] = useState<string>()
	// console.log(input)

	// function isValidNum(newNum: NumberFormatValues) {
	//   return  Number(newNum.value) >= 0 && Number(newNum.value) <= 9
	// }

	function handleInput(input: string) {
		if (input.length != numLen) setCallDisabled(true);
		setInput(input);
	}

	function handleFilledNums(input: string) {
		const inputNums = input.split("").map(Number);
		// dup check
		if (inputNums.length === new Set(inputNums).size) {
			setCallDisabled(false);
			setNums(inputNums);
		} else {
			setCallDisabled(true);
		}
	}

	async function handleCall() {
		if (nums) {
			const num = Number(nums.join(""));
			console.log(num);

			const round = await getRound(contractAddress);

			console.log("playerId :", props.playerId);
			const playerAddr = props.playerId == 1 ? player1Address : player2Address;
			const opponentAddr =
				props.playerId == 1 ? player2Address : player1Address;
			console.log("playerAddr: ", playerAddr);
			console.log("opponentAddr: ", opponentAddr);
			const player = await getAccountByAddress(playerAddr);
			const opponent = await getAccountByAddress(opponentAddr);
			console.log("player: ", player.getAddress().toString());
			console.log("opponent: ", opponent.getAddress().toString());
			console.log("contractAddress: ", contractAddress);
			await callNumber(player, opponent, BigInt(num), contractAddress);

			const result = await getResult(playerAddr, round, contractAddress);
			console.log("result: ", result);

			// props.incrementCallCount();
		}
	}

	return (
		<>
			<Center mt={50}>
				<Stack>
					<PinInput
						type={/^[0-9]*$/}
						inputType="number"
						inputMode="numeric"
						autoFocus={true}
						value={input}
						onChange={handleInput}
						length={numLen}
						// radius="md"
						size="xl"
						// style={{ outline: "1px solid purple" }}
						onComplete={handleFilledNums}

						// disabled={isInit}
					/>
					<Button variant="filled" onClick={handleCall} disabled={callDisabled}>
						Call
					</Button>
				</Stack>
			</Center>
		</>
	);
}
