import { Grid, Card as MantineCard } from "@mantine/core";

type CardType = {
	num: number;
	isOpponent: boolean;
};
export default function Card(props: CardType) {
	const CardStyle = props.isOpponent
		? { fontSize: "30px", textAlign: "center", color: "#dd227f" }
		: { fontSize: "30px", textAlign: "center", color: "#4169e1" };
	return (
		<Grid.Col span={4}>
			<MantineCard
				style={CardStyle}
				shadow="sm"
				padding="lg"
				radius="lg"
				withBorder
			>
				{props.num == null ? "?" : props.num}
			</MantineCard>
		</Grid.Col>
	);
}
