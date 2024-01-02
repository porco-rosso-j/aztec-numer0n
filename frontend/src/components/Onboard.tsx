import { useEffect, useState } from "react";
import {
	MantineProvider,
	Box,
	Button,
	PinInput,
	Card as MantineCard,
	Grid,
	AspectRatio,
	Center,
	Container,
	AppShell,
	SimpleGrid,
	TextInput,
	Group,
	Badge,
	Text,
} from "@mantine/core";

export default function Onboard() {
	async function handleCreateNewGame() {}

	return (
		<>
			<Container style={{ outline: "1px solid pink" }}>
				<Text>Welcome To Numer0n!</Text>
				<Button onClick={handleCreateNewGame}>Create New Game</Button>
			</Container>
		</>
	);
}
