import { Group, Text, Button } from "@mantine/core";
import { useGameContext } from "../contexts/useGameContext";

export default function Header() {
	const { logout } = useGameContext();
	return (
		<Group py={5} mt={10} justify="space-between">
			<Text
				size="25px"
				ml={35}
				style={{ color: "black", fontFamily: "Verdana, sans-serif" }}
			>
				Numer0n
			</Text>
			<Button onClick={logout} mr={35} style={{ backgroundColor: "gray" }}>
				Leave
			</Button>
		</Group>
	);
}
