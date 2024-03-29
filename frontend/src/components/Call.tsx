import { Button, Center, Stack, PinInput, Text } from "@mantine/core";
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

type CallType = {
	playerId: number;
	isFirst: boolean;
	isFinished: boolean;
	updateStates: () => void;
};

export default function Call(props: CallType) {
	const { player1Address, player2Address, contractAddress } = useGameContext();
	const [input, setInput] = useState<string>();
	const [callDisabled, setCallDisabled] = useState<boolean>(true);
	const [calling, setCalling] = useState<boolean>(false);
	const [nums, setNums] = useState<number[]>();
	const [IsCallnumOpen, setOpenCallNumModal] = useState(false);
	const [result, setResult] = useState<number[]>([]);
	const [errorMessage, setErrorMessage] = useState("");

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
			if (result[0] != 0) {
				setResult(result);
				openModal();
				props.updateStates();
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
						size="xl"
						onComplete={handleFilledNums}
					/>
					<Button
						variant="filled"
						loading={calling}
						onClick={handleCall}
						disabled={callDisabled}
					>
						Call
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
			<CallNumModal
				isOpen={IsCallnumOpen}
				onClose={closeModal}
				result={result}
			/>
		</>
	);
}
