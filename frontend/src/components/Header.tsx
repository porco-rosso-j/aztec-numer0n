import { Group, Text, Button } from "@mantine/core";
import { useGameContext } from "../contexts/useGameContext";

export default function Header() {
	const { logout } = useGameContext();
	return (
		<Group
			py={10}
			style={{ backgroundColor: "#808080" }}
			justify="space-between"
		>
			<Text size="xl" ml={35} style={{ color: "white" }}>
				Numer0n
			</Text>
			<Button onClick={logout} mr={35}>
				Leave
			</Button>
		</Group>
	);
}
