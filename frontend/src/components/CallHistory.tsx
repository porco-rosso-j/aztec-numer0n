/* eslint-disable no-mixed-spaces-and-tabs */
import { Center, Table } from "@mantine/core";

type CallHistoryType = { isOpponent: boolean };

const CallHistory = (props: CallHistoryType) => {
	// Sample data, replace with your own
	const rows1 = [
		{ guess: "167", eat: "1", bite: "0" },
		{ guess: "325", eat: "0", bite: "1" },
		// Add more guess entries here...
	];

	const rows2 = [
		{ guess: "345", eat: "1", bite: "0" },
		{ guess: "512", eat: "1", bite: "2" },
		// Add more guess entries here...
	];

	const cellStyle: React.CSSProperties = {
		border: "1px solid #ddd",
		padding: "10px",
		fontSize: "16px",
		textAlign: "center",
	};

	const tableRows = !props.isOpponent
		? rows1.map((row, index) => (
				<tr key={index}>
					<td style={cellStyle}>{row.guess}</td>
					<td style={cellStyle}>{row.eat}</td>
					<td style={cellStyle}>{row.bite}</td>
				</tr>
		  ))
		: rows2.map((row, index) => (
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
};

export default CallHistory;
