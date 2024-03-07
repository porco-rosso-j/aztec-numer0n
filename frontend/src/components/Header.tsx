import { Group, Text, Button, Anchor } from "@mantine/core";
import { useGameContext } from "../contexts/useGameContext";
import { useEffect } from "react";
import { pxe } from "../scripts";
import { SANDBOX_URL } from "../scripts/constants";
import imgGithub from "../../public/github-mark.png";

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

			<Group>
				<Anchor
					href="https://github.com/porco-rosso-j/aztec-numer0n/blob/main/RuleBook.md"
					target="_blank"
					rel="noreferrer"
					mr={10}
				>
					<Text c={"black"} style={{ textDecoration: "underline" }}>
						RuleBook
					</Text>
				</Anchor>
				<Anchor
					href="https://github.com/porco-rosso-j/aztec-numer0n"
					target="_blank"
					rel="noreferrer"
					mt={8}
					mr={10}
				>
					<img src={imgGithub} alt="github" style={{ width: 25, height: 25 }} />
				</Anchor>
				<Button onClick={logout} mr={35} style={{ backgroundColor: "gray" }}>
					Leave
				</Button>
			</Group>
		</Group>
	);
}
