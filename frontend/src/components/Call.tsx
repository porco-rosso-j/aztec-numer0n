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
import CallNumModal from "./Modals/CallNumModal";
import { Result } from "./CallHistory";

type CallType = {
	playerId: number;
};

export default function Call(props: CallType) {
	const { player1Address, player2Address, contractAddress } = useGameContext();
	const [input, setInput] = useState<string>();
	const [callDisabled, setCallDisabled] = useState<boolean>(true);
	const [calling, setCalling] = useState<boolean>(false);
	const [nums, setNums] = useState<number[]>();
	const [IsCallnumOpen, setOpenCallNumModal] = useState(false);
	const [result, setResult] = useState<Result>();

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
		if (!nums) return;
		try {
			setCalling(true);

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

			console.log("round: ", round);
			const result = await getResult(playerAddr, round, contractAddress);
			console.log("call result: ", result);
			// await delay(3);
			if (!result.bite) {
				setResult(result);
				openModal();
			}
		} finally {
			setCalling(false);
		}
	}

	const openModal = () => {
		setOpenCallNumModal(true);
	};

	// Function to close the modal from the parent
	const closeModal = () => {
		setOpenCallNumModal(false);
	};

	return (
		<>
			<Center>
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
					<Button
						variant="filled"
						loading={calling}
						onClick={handleCall}
						disabled={callDisabled}
					>
						Call
					</Button>
				</Stack>
			</Center>
			<CallNumModal
				isOpen={IsCallnumOpen}
				onClose={closeModal}
				result={result as Result}
			/>
		</>
	);
}
