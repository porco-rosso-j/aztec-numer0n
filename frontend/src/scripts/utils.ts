export function shortenAddress(address: string) {
	return (
		address.substring(0, 6) + "..." + address.substring(address.length - 5)
	);
}

export async function delay(sec: number) {
	await new Promise((resolve) => setTimeout(resolve, sec * 1000));
}

export async function paddHeadZero(nums: number[]) {
	return nums.unshift(0);
}

export function stringfyAndPaddZero(num: number) {
	if (num != 0 && num < 100) {
		return "0" + num.toString();
	} else {
		return num.toString();
	}
}
