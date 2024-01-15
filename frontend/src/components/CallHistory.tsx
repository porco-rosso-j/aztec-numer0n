/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-mixed-spaces-and-tabs */
import { Table } from "@mantine/core";
import { useGameContext } from "../contexts/useGameContext";
import { getResult, getRound } from "../scripts";
import { useState, useEffect } from "react";
import { item, HighLow, itemName, ItemType } from "../scripts/constants";
import { stringfyAndPaddZero } from "../scripts/utils";

type CallHistoryType = {
	isOpponent: boolean;
	isFirst: boolean;
	itemUsed: boolean;
	historyUpdated: () => void;
	isFinished: boolean;
	getOpponentSecretNum: (num: string) => void;
};

export type Result = {
	call_num: number,
	eat: number,
	bite: number,
	item: ItemType,
	item_result: number,
};

const emptyResult: Result = {
	call_num: 0,
	eat: 0,
	bite: 0,
	item: 0,
	item_result: 0,
};

export default function CallHistory(props: CallHistoryType) {
	const initialRows: Result[] = Array(5).fill(emptyResult);

	const { player1Address, player2Address, playerId, contractAddress } =
		useGameContext();
	const [results, setResults] = useState<Result[]>(initialRows);
	const [currentTurn, setCurrentTurn] = useState<boolean>(true);
	const [refreshed, setRefreshed] = useState<boolean>(true);
	const [_isFinished, _setIsFinished] = useState<boolean>(false);

	const updateHistry = async () => {
		const round = await getRound(contractAddress);
		const isTurnChanged = props.isFirst != currentTurn && round > 0n;
		const isFinished = !_isFinished ? _setIsFinished(props.isFinished) : false;

		if (
			(refreshed && round > 0) ||
			isTurnChanged ||
			props.itemUsed ||
			isFinished
		) {
			setRefreshed(false);
			setCurrentTurn(!currentTurn);
			_setIsFinished(false);
			props.historyUpdated();
			console.log("props.isFirst: ", props.isFirst);
			console.log("currentTurn: ", currentTurn);
			let results: Result[] = [];

			const _playerAddr = playerId == 1 ? player1Address : player2Address;
			const _opponentAddr = playerId == 1 ? player2Address : player1Address;
			const playerAddr = props.isOpponent ? _opponentAddr : _playerAddr;
			console.log("playerAddr: ", playerAddr);

			for (let i = 0; i < round; i++) {
				const result = await getResult(playerAddr, BigInt(i + 1), contractAddress);
				console.log("result: ", result);

				if (result.bite != 0 || result.item) {
					console.log("result item: ", result.item);
					results.push(result);
				}
			}
			console.log("results: ", results);

			if (results.length <= 5)
				results = results.concat(
					Array(5 - results.length).fill(emptyResult)
				);

			const currentRoundRow = Number(round) - 1;

			if (currentRoundRow >= 0) setResults(results);
			if (results[currentRoundRow]?.eat == 3) {
				const guess = stringfyAndPaddZero(results[currentRoundRow].bite)
				props.getOpponentSecretNum(guess);
			}

			console.log("results: ", results);
		}
	};

	useEffect(() => {
		console.log("updateHistry");
		updateHistry();
		const intervalId = setInterval(updateHistry, 10000);
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

	const tableRows = results.map((row, index) => {
		let itemColumn = itemName(row.item)
		console.log("================", itemColumn)
		switch (row.item) {
			case ItemType.HIGH_AND_LOW:
				itemColumn += " : " + HighLow(row.item_result)
				break
			case ItemType.SLASH:
				itemColumn += " : " + row.item_result.toString()
				break
		}

		return (
			<tr key={index}>
				<td style={cellStyle}>{stringfyAndPaddZero(row.bite)}</td>
				<td style={cellStyle}>{row.eat + " - " + row.bite}</td>
				<td style={cellStyle}>{itemColumn}</td>
			</tr>
		)
	});

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
							<th style={{ padding: "10px", borderTopLeftRadius: "5px" }}>
								Your guess
							</th>
							<th style={{ padding: "10px" }}>Eat - Bite</th>
							<th style={{ padding: "10px", borderTopRightRadius: "5px" }}>
								Item
							</th>
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
							<th
								style={{
									padding: "10px",
									borderTopLeftRadius: "5px",
								}}
							>
								Opp's guess
							</th>
							<th style={{ padding: "10px" }}>Eat - Bite</th>
							<th style={{ padding: "10px", borderTopRightRadius: "5px" }}>
								Item
							</th>
						</tr>
					</thead>
					<tbody
						style={{
							textAlign: "center",
						}}
					>
						{tableRows}
					</tbody>
				</Table>
			)}
		</>
	);
}
