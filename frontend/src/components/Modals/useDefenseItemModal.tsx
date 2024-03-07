/* eslint-disable react-hooks/rules-of-hooks */
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
import {
	getAccountByAddress,
	useDefenseItem,
	getIsValidShuffle,
} from "../../scripts";
import { numLen } from "../../scripts/constants";

type DefenseItemModalType = {
	isOpen: boolean;
	onClose: () => void;
	itemType: number;
	playerId: number;
};

function DefenseItemModal(props: DefenseItemModalType) {
	const {
		contractAddress,
		playerId,
		player1Address,
		player2Address,
		secretNumber,
		saveSecretNumber,
	} = useGameContext();
	const [input, setInput] = useState<string>("");
	const [callDisabled, setCallDisabled] = useState<boolean>(true);
	const [nums, setNums] = useState<number[]>();
	const [loading, setLoading] = useState<boolean>(false);
	const [errorMessage, setErrorMessage] = useState<string>("");

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
			setErrorMessage("");
			setLoading(true);
			const num = Number(nums.join(""));

			let ret = false;

			if (props.itemType == 4) {
				// ret = await getIsValidShuffle(
				// 	BigInt(secretNumber),
				// 	BigInt(num),
				// 	contractAddress
				// );
				ret = true;
			} else if (props.itemType == 5) {
				ret = await getIsValidShuffle(
					BigInt(secretNumber),
					BigInt(num),
					contractAddress
				);
			}

			if (!ret) {
				setErrorMessage("Invalid Number");
				throw "invalid number";
			}
			console.log(num);

			console.log("playerId :", playerId);
			const playerAddr = props.playerId == 1 ? player1Address : player2Address;
			const player = await getAccountByAddress(playerAddr);
			const success = await useDefenseItem(
				player,
				BigInt(props.itemType),
				BigInt(num),
				contractAddress
			);
			if (success) {
				saveSecretNumber(num);
			}

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
					Set New Secret Number
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
				{errorMessage != "" ? (
					<Text style={{ color: "red" }}>{errorMessage}</Text>
				) : null}
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

export default DefenseItemModal;
