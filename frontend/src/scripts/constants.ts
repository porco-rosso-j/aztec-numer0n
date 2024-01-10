export const REGISTRY_ADDRESS =
	import.meta.env.VITE_ENV == "LOCAL"
		? "0x0bb62f3406a62182192f45644ed90301dbe9a6298464926a4aa62ac7f4c5a1e9"
		: import.meta.env.VITE_ENV == "REMOTE"
			? "0x270f36a9591ead4c6da394cfb04f6bcf84b6cd10005c059acea082eed2bb609d"
			: "";

export const SANDBOX_URL =
	import.meta.env.VITE_ENV == "LOCAL"
		? "http://localhost:8080"
		: import.meta.env.VITE_ENV == "REMOTE"
			? "https://aztec.hmlab.xyz/"
			: "";

// ? "http://212.227.240.189:8080"
export const SANDBOX_ADDRESS_1 =
	"0x06357cc85cb8fc561adbf741f63cd75efa26ffba1c80d431ec77d036d8edf022";
export const SANDBOX_ADDRESS_2 =
	"0x1b18a972d54db0283a04abaace5f7b03c3fca5a4b2c0cf113b457de6ea4991e7";
export const SANDBOX_ADDRESS_3 =
	"0x1d30d4de97657983408587c7a91ba6587774b30f0e70224a0658f0357092f495";

export const numLen = 3;

export const item = (num: number) => {
	console.log("num num:  ");
	if (num == 1) {
		return "H&L";
	} else if (num == 2) {
		return "Slash";
	} else if (num == 5) {
		return "Shuffle";
	} else {
		return "";
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
