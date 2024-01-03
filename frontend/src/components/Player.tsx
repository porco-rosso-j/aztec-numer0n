import { Grid } from "@mantine/core";
import { useState, useEffect } from "react";
import Card from "./Card";
import { useGameContext } from "../contexts/useGameContext";
import { numLen } from "../scripts/constants";

type PlayerType = { isOpponent: boolean };

export default function Player(props: PlayerType) {
	const { secretNumber } = useGameContext();
	const [nums, setNums] = useState<number[]>(Array(numLen).fill(null));
	// const [isInit, setIsInit] = useState(false);
	// console.log(nums)

	// function handleSetNum(i: number) {
	// 	return (num: number | string) => {
	// 		if (nums.includes(Number(num))) return;

	// 		const nextNums = nums.slice();
	// 		nextNums[i] = Number(num);
	// 		setNums(nextNums);
	// 	};
	// }

	// Add secret num
	useEffect(() => {
		(async () => {
			if (!props.isOpponent && secretNumber != 0) {
				const arrayNum = secretNumber
					.toString()
					.split("")
					.map((num) => parseInt(num, 10));

				setNums(arrayNum);
			}
		})();
	}, [props.isOpponent, secretNumber]);

	return (
		<>
			<Grid my={10}>
				{nums.map((_, i) => {
					return <Card key={i} num={nums[i]} />;
				})}
			</Grid>
		</>
	);
}
