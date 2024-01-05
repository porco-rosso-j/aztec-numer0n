/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-mixed-spaces-and-tabs */
import { Table } from "@mantine/core";
import { useGameContext } from "../contexts/useGameContext";
import { getResult, getRound } from "../scripts";
import { useState, useEffect } from "react";
import { item, HighLow } from "../scripts/constants";

type CallHistoryType = {
	isOpponent: boolean;
	isFirst: boolean;
	itemUsed: boolean;
	historyUpdated: () => void;
	isFinished: boolean;
	getOpponentSecretNum: (num: string) => void;
};

type ResultRow = {
	guess: string;
	eat: number;
	bite: number;
	item: number;
	item_result: number;
};
const emptyRow: ResultRow = {
	guess: "0",
	eat: 0,
	bite: 0,
	item: 0,
	item_result: 0,
};

export default function CallHistory(props: CallHistoryType) {
	const initialRows: ResultRow[] = Array(5).fill(emptyRow);

	const { player1Address, player2Address, playerId, contractAddress } =
		useGameContext();
	const [resultRows, setResultRows] = useState<ResultRow[]>(initialRows);
	const [currentTurn, setCurrentTurn] = useState<boolean>(true);
	const [currentRound, setCurrentRound] = useState<bigint>(1n);
	const [refreshed, setRefreshed] = useState<boolean>(true);
	const [_isFinished, _setIsFinished] = useState<boolean>(false);

	const updateHistry = async () => {
		const round = await getRound(contractAddress);
		console.log("round: ", round);

		console.log("props.isFirst: ", props.isFirst);
		console.log("currentTurn: ", currentTurn);
		const isTurnChanged = props.isFirst != currentTurn && round > 0n;
		console.log("isTurnChanged: ", isTurnChanged);
		console.log("refreshed: ", refreshed);
		console.log("props.isFinished: ", props.isFinished);
		console.log("isFinished: ", _isFinished);
		console.log("props.itemUsed: ", props.itemUsed);

		const isFinished = !_isFinished ? _setIsFinished(props.isFinished) : false;

		if (
			(refreshed && round > 0) ||
			isTurnChanged ||
			props.itemUsed ||
			isFinished
		) {
			setRefreshed(false);
			setCurrentTurn(!currentTurn);
			setCurrentRound(round);
			_setIsFinished(false);
			props.historyUpdated();
			console.log("props.isFirst: ", props.isFirst);
			console.log("currentTurn: ", currentTurn);
			let resultRow: ResultRow[] = [];
			let result: number[] = [];

			const _playerAddr = playerId == 1 ? player1Address : player2Address;
			const _opponentAddr = playerId == 1 ? player2Address : player1Address;

			const playerAddr = props.isOpponent ? _opponentAddr : _playerAddr;
			console.log("playerAddr: ", playerAddr);

			for (let i = 0; i < round; i++) {
				result = await getResult(playerAddr, BigInt(i + 1), contractAddress);
				console.log("result: ", result);

				if (result[0] != 0 || result[4] != 0) {
					console.log("result[3]: ", result[3]);
					const newResult: ResultRow = {
						guess: result[0].toString(),
						// !props.itemUsed && !refreshed && result[0] < 100
						// 	? result[0].toString()
						// 	: result[0].toString(),
						eat: result[1],
						bite: result[2],
						item: result[3],
						item_result: result[4],
					};
					console.log("newResult: ", newResult);

					resultRow.push(newResult);
				}
			}
			console.log("resultRow: ", resultRow);

			if (resultRow.length <= 5) {
				const complacement = 5 - resultRow.length;
				const fillingRows: ResultRow[] = Array(complacement).fill(emptyRow);
				resultRow = resultRow.concat(fillingRows);
			}

			const currentRoundRow = Number(round) - 1;
			if (currentRoundRow >= 0) {
				setResultRows(resultRow);
			}

			if (resultRows[currentRoundRow].eat == 3) {
				props.getOpponentSecretNum(resultRows[currentRoundRow].guess);
			}

			console.log("resultRows: ", resultRows);
		}
	};

	useEffect(() => {
		console.log("11");
		updateHistry();
		const intervalId = setInterval(updateHistry, 10000);
		console.log("intervalId");
		return () => {
			clearInterval(intervalId);
		};
	}, [updateHistry]);

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
			<td style={cellStyle}>
				{item(row.item)}: {row.item == 1 ? HighLow(row.item_result) : null}
			</td>
		</tr>
	));

	return (
		<>
			{!props.isOpponent ? (
				<Table bg={"white"} striped highlightOnHover>
					<thead>
						<tr
							style={{
								fontSize: "15px",
								backgroundColor: "#4169e1",
								color: "white",
							}}
						>
							<th style={{ padding: "10px" }}>Your guess</th>
							<th style={{ padding: "10px" }}>Eat</th>
							<th style={{ padding: "10px" }}>Bite</th>
							<th style={{ padding: "10px" }}>Item</th>
						</tr>
					</thead>
					<tbody style={{ textAlign: "center" }}>{tableRows}</tbody>
				</Table>
			) : (
				<Table bg={"white"} striped highlightOnHover>
					<thead>
						<tr
							style={{
								fontSize: "15px",
								backgroundColor: "#dd227f",
								color: "white",
							}}
						>
							<th style={{ padding: "10px" }}>Opp's guess</th>
							<th style={{ padding: "10px" }}>Eat</th>
							<th style={{ padding: "10px" }}>Bite</th>
							<th style={{ padding: "10px" }}>Item</th>
						</tr>
					</thead>
					<tbody style={{ textAlign: "center" }}>{tableRows}</tbody>
				</Table>
			)}
		</>
	);
}
