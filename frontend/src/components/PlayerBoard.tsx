import { Text, Stack } from "@mantine/core";
import Player from "./Player";
import { useState, useEffect } from "react";
import { useGameContext } from "../contexts/useGameContext";
import { shortenAddress } from "../scripts/utils";

type PlayerBoardType = {
	playerId: number;
	isOpponent: boolean;
	opponentSecretNum: string;
};

export default function PlayerBoard(props: PlayerBoardType) {
	const { player1Address, player2Address } = useGameContext();
	const [playerAddr, setPlayerAddr] = useState<string>("");

	// Add secret num
	useEffect(() => {
		(async () => {
			const playerAddr = props.playerId == 1 ? player1Address : player2Address;
			setPlayerAddr(playerAddr);
		})();
	}, [player1Address, player2Address, props.playerId, setPlayerAddr]);
	return (
		<>
			<Stack
				my={20}
				px={10}
				py={10}
				style={{
					borderColor: "#c4c3d0",
					borderWidth: "1px",
					borderStyle: "solid",
					borderRadius: "3px",
				}}
			>
				{!props.isOpponent ? (
					<Text> You : {shortenAddress(playerAddr)} </Text>
				) : (
					<Text style={{ display: "flex", justifyContent: "flex-end" }}>
						{" "}
						Opponent : {shortenAddress(playerAddr)}{" "}
					</Text>
				)}
				<Player
					isOpponent={props.isOpponent}
					opponentSecretNum={props.opponentSecretNum}
				/>
			</Stack>
		</>
	);
}
