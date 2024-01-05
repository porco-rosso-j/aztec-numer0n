import { Group, Text, Button } from "@mantine/core";
import { useGameContext } from "../contexts/useGameContext";

export default function Header() {
	const { logout } = useGameContext();
	return (
		<Group
			py={5}
			mt={10}
			// style={{ backgroundColor: "#808080" }}
			justify="space-between"
		>
			<Text size="25px" ml={35} style={{ color: "black" }}>
				Numer0n
			</Text>
			<Button onClick={logout} mr={35} style={{ backgroundColor: "gray" }}>
				Leave
			</Button>
		</Group>
	);
}
