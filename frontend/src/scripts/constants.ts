export const REGISTRY_ADDRESS =
	import.meta.env.VITE_ENV == "LOCAL"
		? "0x28dae8654df38eb5d797a651abf7e31711fda32527eac0c3beade27116f17b5d"
		: import.meta.env.VITE_ENV == "REMOTE"
			? "0x0006a61e1aa2cb82c6da8eb2fa4a2fc31d9d988c1608d9c9f5d10a2c6206994d"
			: "";

export const SANDBOX_URL =
	import.meta.env.VITE_ENV == "LOCAL"
		? "http://localhost:8080"
		: import.meta.env.VITE_ENV == "REMOTE"
			? "https://aztec.hmlab.xyz/"
			: "";


export const SANDBOX_ADDRESS_1 =
	"0x06357cc85cb8fc561adbf741f63cd75efa26ffba1c80d431ec77d036d8edf022";
export const SANDBOX_ADDRESS_2 =
	"0x1b18a972d54db0283a04abaace5f7b03c3fca5a4b2c0cf113b457de6ea4991e7";
export const SANDBOX_ADDRESS_3 =
	"0x1d30d4de97657983408587c7a91ba6587774b30f0e70224a0658f0357092f495";

export const numLen = 3;

export enum ItemType {
	HIGH_AND_LOW = 1,
	SLASH,
	TARGET,
	CHANGE,
	SHUFFLE,
}

export const itemName = (type: ItemType): string => {
	console.log("itemNameeeeeeeeeeeee",)
	switch (type) {
		case ItemType.HIGH_AND_LOW:
			return "H&L"
		case ItemType.SLASH:
			return "Slash"
		case ItemType.TARGET:
			return "Target"
		case ItemType.CHANGE:
			return "Change"
		case ItemType.SHUFFLE:
			return "Shuffle"
	}
};

export const HighLow = (num: number) => {
	if (num == LOW_lOW_LOW) {
		return "↓↓↓";
	} else if (num == LOW_HIGH_lOW) {
		return "↓↑↓";
	} else if (num == LOW_lOW_HIGH) {
		return "↓↓↑";
	} else if (num == LOW_HIGH_HIGH) {
		return "↓↑↑";
	} else if (num == HIGH_HIGH_HIGH) {
		return "↑↑↑";
	} else if (num == HIGH_lOW_HIGH) {
		return "↑↓↑";
	} else if (num == HIGH_HIGH_LOW) {
		return "↑↑↓";
	} else if (num == HIGH_LOW_LOW) {
		return "↑↓↓";
	} else {
		return "";
	}
};

const LOW_lOW_LOW = 111;
const LOW_lOW_HIGH = 112;
const LOW_HIGH_HIGH = 122;
const LOW_HIGH_lOW = 121;
const HIGH_HIGH_HIGH = 222;
const HIGH_HIGH_LOW = 221;
const HIGH_LOW_LOW = 211;
const HIGH_lOW_HIGH = 212;
