import { useEffect, useState } from "react";
import { Button, Box, Container, Text } from "@mantine/core";
import React from "react";
import { useGameContext } from "../contexts/useGameContext";
import Game from "./Game";

export default function Onboard() {
	// const { player1Address, savePlayer1Address } = useGameContext();
	const { playersReady, savePlayersReady } = useGameContext();

	async function handleCreateNewGame() {
		savePlayersReady(true);
	}

	return (
		<>
			{!playersReady ? (
				<Container>
					<Text>Welcome To Numer0n!</Text>
					<Button onClick={handleCreateNewGame}>Create New Game</Button>
				</Container>
			) : (
				<Game />
			)}
		</>
	);
}
