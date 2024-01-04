/* eslint-disable no-mixed-spaces-and-tabs */
import { Table } from "@mantine/core";
import { useGameContext } from "../contexts/useGameContext";
import { getResult, getRound } from "../scripts";
import { useState, useEffect } from "react";

type CallHistoryType = {
	isOpponent: boolean;
	isFirst: boolean;
};

type ResultRow = {
	guess: number;
	eat: number;
	bite: number;
};

export default function CallHistory(props: CallHistoryType) {
	const { player1Address, player2Address, playerId, contractAddress } =
		useGameContext();
	const [resultRows, setResultRows] = useState<ResultRow[]>([]);
	const [currentTurn, setCurrentTurn] = useState<boolean>(true);
	const [currentRound, setCurrentRound] = useState<bigint>(1n);

	useEffect(() => {
		const checkResults = async () => {
			const round = await getRound(contractAddress);
			console.log("round: ", round);

			if (props.isFirst != currentTurn && round > 0n) {
				console.log("props.isFirst: ", props.isFirst);
				console.log("currentTurn: ", currentTurn);
				const resultRow: ResultRow[] = [];
				let result: number[] = [];

				const _playerAddr = playerId == 1 ? player1Address : player2Address;
				const _opponentAddr = playerId == 1 ? player2Address : player1Address;

				const playerAddr = props.isOpponent ? _opponentAddr : _playerAddr;
				console.log("playerAddr: ", playerAddr);

				const _round = props.isFirst ? Number(round) - 1 : round;

				for (let i = 1; i <= _round; i++) {
					result = await getResult(playerAddr, BigInt(i), contractAddress);
					console.log("result: ", result);
					const newResult: ResultRow = {
						guess: Number(result[0]),
						eat: Number(result[1]),
						bite: Number(result[2]),
					};
					resultRow.push(newResult);
				}
				console.log("resultRow: ", resultRow);

				if (Number(round) - 1 >= 0) {
					setResultRows(resultRow);
				}

				setCurrentTurn(!currentTurn);
				setCurrentRound(round);
			}
		};
		const intervalId = setInterval(checkResults, 5000);
		return () => {
			clearInterval(intervalId);
		};
	}, [
		player1Address,
		player2Address,
		playerId,
		contractAddress,
		props.isFirst,
		currentTurn,
		currentRound,
		resultRows,
		props.isOpponent,
	]);

	const cellStyle: React.CSSProperties = {
		border: "1px solid #ddd",
		padding: "10px",
		fontSize: "16px",
		textAlign: "center",
	};

	const tableRows = resultRows.map((row, index) => (
		<tr key={index}>
			<td style={cellStyle}>{row.guess}</td>
			<td style={cellStyle}>{row.eat}</td>
			<td style={cellStyle}>{row.bite}</td>
		</tr>
	));

	return !props.isOpponent ? (
		<Table striped highlightOnHover>
			<thead>
				<tr
					style={{
						fontSize: "15px",
						backgroundColor: "blue",
						color: "white",
					}}
				>
					<th style={{ padding: "10px" }}>Your guess</th>
					<th style={{ padding: "10px" }}>Eat</th>
					<th style={{ padding: "10px" }}>Bite</th>
				</tr>
			</thead>
			<tbody style={{ textAlign: "center" }}>{tableRows}</tbody>
		</Table>
	) : (
		<Table striped highlightOnHover>
			<thead>
				<tr
					style={{
						fontSize: "15px",
						backgroundColor: "red",
						color: "white",
					}}
				>
					<th style={{ padding: "10px" }}>Opp's guess</th>
					<th style={{ padding: "10px" }}>Eat</th>
					<th style={{ padding: "10px" }}>Bite</th>
				</tr>
			</thead>
			<tbody style={{ textAlign: "center" }}>{tableRows}</tbody>
		</Table>
	);
}
