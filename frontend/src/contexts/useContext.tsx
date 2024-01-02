import { useState } from "react";

const useContext = () => {
	const [contractAddress, setContractAddress] = useState<string>("");
	const [player1Address, setPlayer1Address] = useState<string>("");
	const [player2Address, setPlayer2Address] = useState<string>("");
	const [hasPlayersJoined, setHasPlayersJoined] = useState<boolean>(false);

	const savePlayer1Address = (_player1_address: string) => {
		setPlayer1Address(_player1_address);
		localStorage.setItem(`player1_address`, JSON.stringify(_player1_address));
	};

	const savePlayer2Address = (_player2_address: string) => {
		setPlayer2Address(_player2_address);
		localStorage.setItem(`player2_address`, JSON.stringify(_player2_address));
	};

	const removePlayerAddresses = () => {
		setPlayer1Address("");
		setPlayer2Address("");
		localStorage.removeItem(`player1_address`);
		localStorage.removeItem(`player2_address`);
	};

	const saveContractAddress = (_contractAddress: string) => {
		setContractAddress(_contractAddress);
		localStorage.setItem(`contract_address`, JSON.stringify(_contractAddress));
	};

	const saveHasPlayersJoined = (_hasJoined: boolean) => {
		setHasPlayersJoined(_hasJoined);
	};

	const logout = () => {
		removePlayerAddresses();
		setContractAddress("");
		setHasPlayersJoined(false);
	};

	return {
		contractAddress,
		player1Address,
		player2Address,
		hasPlayersJoined,
		savePlayer1Address,
		savePlayer2Address,
		saveContractAddress,
		saveHasPlayersJoined,
		logout,
	};
};

export default useContext;
