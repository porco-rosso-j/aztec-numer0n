export function shortenAddress(address: string) {
	return (
		address.substring(0, 6) + "..." + address.substring(address.length - 5)
	);
}

export async function delay(sec: number) {
	await new Promise((resolve) => setTimeout(resolve, sec * 1000));
}
