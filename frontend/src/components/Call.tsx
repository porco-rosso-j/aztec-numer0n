import { Button, Center, Stack, PinInput } from "@mantine/core";
import { useState } from "react";
import { numLen } from "../scripts/constants";

export default function Call() {
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
		console.log(nums);
	}

	return (
		<>
			<Center mt={30}>
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
		// <NumberInput
		//   min={0}
		//   max={9}
		//   // disabled={isInit}
		//   value={num}
		//   onChange={onSetNum}
		//   isAllowed={isValidNum}
		// />
	);
}
