import { Grid, Card as MantineCard } from "@mantine/core";

export default function Card({
	num,
	// onSetNum,
	// isInit
}) {
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
				{num == null ? "?" : num}
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
