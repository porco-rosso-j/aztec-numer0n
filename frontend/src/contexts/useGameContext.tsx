import { createContext, useContext, useState, ReactNode } from "react";

const GameContext = createContext<GameContextState | null>(null);

export const GameContextProvider = GameContext.Provider;

interface GameContextState {
	contractAddress: string;
	player1Address: string;
	player2Address: string;
	playerId: number;
	secretNumber: number;
	playersReady: boolean;
	saveContractAddress: (address: string) => void;
	savePlayer1Address: (address: string) => void;
	savePlayer2Address: (address: string) => void;
	savePlayerId: (id: number) => void;
	saveSecretNumber: (num: number) => void;
	savePlayersReady: (hasJoined: boolean) => void;
	logout: () => void;
}

export const useGameContext = () => {
	const context = useContext(GameContext);
	if (!context) {
		throw new Error("useGameContext must be used within a GameContextProvider");
	}
	return context;
};

interface GameContextProps {
	children: ReactNode;
}

export const GameContextProviderComponent: React.FC<GameContextProps> = ({
	children,
}) => {
	const [contractAddress, setContractAddress] = useState<string>("");
	const [player1Address, setPlayer1Address] = useState<string>("");
	const [player2Address, setPlayer2Address] = useState<string>("");
	const [playerId, setPlayerId] = useState<number>(0);
	const [secretNumber, setSecretNumber] = useState<number>(0);
	const [playersReady, setPlayersReady] = useState<boolean>(false);

	const savePlayer1Address = (_player1_address: string) => {
		setPlayer1Address(_player1_address);
		localStorage.setItem(`player1_address`, JSON.stringify(_player1_address));
	};

	const savePlayer2Address = (_player2_address: string) => {
		setPlayer2Address(_player2_address);
		localStorage.setItem(`player2_address`, JSON.stringify(_player2_address));
	};

	const removeAddresses = () => {
		setPlayer1Address("");
		setPlayer2Address("");
		setContractAddress("");
		localStorage.removeItem(`player1_address`);
		localStorage.removeItem(`player2_address`);
		localStorage.removeItem(`contract_address`);
	};

	const saveContractAddress = (_contractAddress: string) => {
		setContractAddress(_contractAddress);
		localStorage.setItem(`contract_address`, JSON.stringify(_contractAddress));
	};

	const savePlayerId = (_id: number) => {
		setPlayerId(_id);
		localStorage.setItem(`player_id`, JSON.stringify(_id.toString()));
	};

	const removePlayerId = () => {
		localStorage.removeItem(`player_id`);
	};

	const saveSecretNumber = (_num: number) => {
		setSecretNumber(_num);
		localStorage.setItem(`secret_num`, JSON.stringify(_num.toString()));
	};

	const removeSecretNumber = () => {
		localStorage.removeItem(`secret_num`);
	};

	const savePlayersReady = (_hasJoined: boolean) => {
		setPlayersReady(_hasJoined);
	};

	const logout = () => {
		removeAddresses();
		setContractAddress("");
		setPlayersReady(false);
		setPlayerId(0);
		removePlayerId();
		setSecretNumber(0);
		removeSecretNumber();
	};

	const contextValue: GameContextState = {
		contractAddress,
		player1Address,
		player2Address,
		playerId,
		secretNumber,
		playersReady,
		savePlayer1Address,
		savePlayer2Address,
		saveContractAddress,
		savePlayerId,
		saveSecretNumber,
		savePlayersReady,
		logout,
	};
	return (
		<GameContextProvider value={contextValue}>{children}</GameContextProvider>
	);
};
