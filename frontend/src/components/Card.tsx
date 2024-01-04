import { Grid, Card as MantineCard } from "@mantine/core";

type CardType = {
	num: number;
};
export default function Card(
	props: CardType
	// onSetNum,
	// isInit
) {
	// function isValidNum(newNum: NumberFormatValues) {
	//   return  Number(newNum.value) >= 0 && Number(newNum.value) <= 9
	// }

	return (
		<Grid.Col
			// style={{outline: "1px solid red"}}
			span={4}
		>
			{/* <AspectRatio ratio={1080 / 720} maw={300} mx="auto"> */}
			<MantineCard
				style={{ fontSize: "25px", textAlign: "center" }}
				shadow="sm"
				padding="lg"
				radius="lg"
				withBorder
			>
				{props.num == null ? "?" : props.num}
			</MantineCard>
			{/* </AspectRatio> */}
		</Grid.Col>

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
