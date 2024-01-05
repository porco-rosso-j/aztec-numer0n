import {
	Modal,
	Text,
	Button,
	Box,
	Group,
	Divider,
	Center,
	PinInput,
} from "@mantine/core";
import { useState } from "react";
import { useGameContext } from "../../contexts/useGameContext";
import { addNumber, getAccountByAddress } from "../../scripts";

type AddNumModalType = {
	isOpen: boolean;
	onClose: () => void;
};

function AddNumMoodal(props: AddNumModalType) {
	const {
		contractAddress,
		playerId,
		player1Address,
		player2Address,
		saveSecretNumber,
	} = useGameContext();
	const [input, setInput] = useState<string>("");
	const [callDisabled, setCallDisabled] = useState<boolean>(true);
	const [nums, setNums] = useState<number[]>();
	const numLen = 3;
	const [loading, setLoading] = useState<boolean>(false);

	function handleInput(input: string) {
		console.log("handleInput input: ", input);
		if (input.length != numLen) setCallDisabled(true);
		setInput(input);
	}

	function handleFilledNums(input: string) {
		const inputNums = input.split("").map(Number);
		console.log("handleFilledNums input: ", input);
		// dup check
		if (inputNums.length === new Set(inputNums).size) {
			setCallDisabled(false);
			setNums(inputNums);
		} else {
			setCallDisabled(true);
		}
	}

	async function handleConfirm() {
		if (!nums) return;
		try {
			setLoading(true);
			const num = Number(nums.join(""));
			console.log(num);

			console.log("playerId :", playerId);
			const playerAddr = playerId == 1 ? player1Address : player2Address;
			const player = await getAccountByAddress(playerAddr);
			await addNumber(player, BigInt(num), contractAddress);
			saveSecretNumber(num);

			props.onClose();
		} finally {
			setLoading(false);
		}
	}

	return (
		<Modal
			size="xs"
			opened={props.isOpen}
			onClose={props.onClose}
			withCloseButton={false}
			centered
		>
			<Box
				style={{
					backgroundColor: "#white",
					color: "black",
					textAlign: "center",
				}}
			>
				<Text size="lg" mt={10} mb={20}>
					Set Your Secret Number
				</Text>
				<Center>
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
						mb={20}
					/>
				</Center>
				<Divider my="sm" />
				<Center mt={20} mb={10}>
					<Group>
						<Button color="gray" onClick={props.onClose}>
							Close
						</Button>
						<Button
							variant="filled"
							onClick={handleConfirm}
							disabled={callDisabled}
							loading={loading}
						>
							Confirm
						</Button>
					</Group>
				</Center>
			</Box>
		</Modal>
	);
}

export default AddNumMoodal;
