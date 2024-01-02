import { createContext, useContext, useState, ReactNode } from "react";

const GameContext = createContext<GameContextState | null>(null);

export const GameContextProvider = GameContext.Provider;

interface GameContextState {
	contractAddress: string;
	player1Address: string;
	player2Address: string;
	playersReady: boolean;
	savePlayer1Address: (address: string) => void;
	savePlayer2Address: (address: string) => void;
	saveContractAddress: (address: string) => void;
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
	const [playersReady, setPlayersReady] = useState<boolean>(false);

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

	const savePlayersReady = (_hasJoined: boolean) => {
		setPlayersReady(_hasJoined);
	};

	const logout = () => {
		removePlayerAddresses();
		setContractAddress("");
		setPlayersReady(false);
	};

	const contextValue: GameContextState = {
		contractAddress,
		player1Address,
		player2Address,
		playersReady,
		savePlayer1Address,
		savePlayer2Address,
		saveContractAddress,
		savePlayersReady,
		logout,
	};
	return (
		<GameContextProvider value={contextValue}>{children}</GameContextProvider>
	);
};
