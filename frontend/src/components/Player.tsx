import { Grid } from "@mantine/core";
import { useState, useEffect } from "react";
import Card from "./Card";
import { useGameContext } from "../contexts/useGameContext";
import { numLen } from "../scripts/constants";
import { paddHeadZero } from "../scripts/utils";

type PlayerType = { isOpponent: boolean; opponentSecretNum: string };

export default function Player(props: PlayerType) {
	const { secretNumber } = useGameContext();
	const [nums, setNums] = useState<number[]>(Array(numLen).fill(null));
	const [opponentNums, setOpponentNums] = useState<number[]>(
		Array(numLen).fill(null)
	);

	// Add opponent secret num
	useEffect(() => {
		(async () => {
			if (props.opponentSecretNum != "") {
				const arrayNum = props.opponentSecretNum
					.split("")
					.map((num) => parseInt(num, 10));

				if (Number(props.opponentSecretNum) < 100) {
					paddHeadZero(arrayNum);
				}

				setOpponentNums(arrayNum);
			}
		})();
	}, [props.opponentSecretNum]);

	// Add secret num
	useEffect(() => {
		(async () => {
			if (!props.isOpponent && secretNumber != 0) {
				const arrayNum = secretNumber
					.toString()
					.split("")
					.map((num) => parseInt(num, 10));

				if (secretNumber < 100) {
					paddHeadZero(arrayNum);
				}
				setNums(arrayNum);
			}
		})();
	}, [props.isOpponent, secretNumber]);

	return (
		<>
			{!props.isOpponent ? (
				<Grid mb={5}>
					{nums.map((_, i) => {
						return <Card key={i} num={nums[i]} isOpponent={props.isOpponent} />;
					})}
				</Grid>
			) : (
				<Grid mb={5}>
					{opponentNums.map((_, i) => {
						return (
							<Card
								key={i}
								num={opponentNums[i]}
								isOpponent={props.isOpponent}
							/>
						);
					})}
				</Grid>
			)}
		</>
	);
}
