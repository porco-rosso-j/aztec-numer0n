import { Container, Group, Text } from "@mantine/core";

export default function Header() {
	return (
		<Group py={10} style={{ backgroundColor: "#808080" }}>
			<Text size="xl" ml={35} style={{ color: "white" }}>
				Numer0n
			</Text>
			{/* Add other elements here if needed, like buttons or icons */}
		</Group>
	);
}
