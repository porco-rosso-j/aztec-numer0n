import { Group, Text, Button } from "@mantine/core";
import { useGameContext } from "../contexts/useGameContext";
import { useEffect } from "react";
import { pxe } from "../scripts";
import { SANDBOX_URL } from "../scripts/constants";

export default function Header() {
	const { logout } = useGameContext();

	useEffect(() => {
		const check = async () => {
			console.log("SANDBOX_URL: ", SANDBOX_URL);
			const pxe_service = pxe();
			console.log("pxe()", pxe_service);
			const info = await pxe_service.getNodeInfo();
			console.log("info", info);
		};

		check();
	});
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
