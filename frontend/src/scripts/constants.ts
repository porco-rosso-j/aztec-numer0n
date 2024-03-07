export const REGISTRY_ADDRESS =
	import.meta.env.VITE_ENV == "LOCAL"
		? "0x1dd2b709690892bc10e8abde0cb62ff36cfcfff328de9918891764cff9d131fb"
		: import.meta.env.VITE_ENV == "REMOTE"
		? import.meta.env.VITE_REGISRTY_ADDRESS
		: "";

export const SANDBOX_URL =
	import.meta.env.VITE_ENV == "LOCAL"
		? "http://127.0.0.1:8080"
		: import.meta.env.VITE_ENV == "REMOTE"
		? "https://aztec-pxe.abstract-crypto.com"
		: "";

export const SANDBOX_ADDRESS_1 =
	"0x2fd4503a9b855a852272945df53d7173297c1469cceda31048b85118364b09a3";
export const SANDBOX_ADDRESS_2 =
	"0x054ae9af363c6388cc6242c6eb0ed8a5860c15290744c81ecd5109434f9bb8b1";
export const SANDBOX_ADDRESS_3 =
	"0x0d919c38d75484f8dd410cebaf0e17ccd196901d554d88f81b7e079375a4335d";

export const numLen = 3;

export const item = (num: number) => {
	console.log("num num:  ");
	if (num == 1) {
		return "H&L";
	} else if (num == 2) {
		return "Slash";
	} else if (num == 3) {
		return "Target";
	} else if (num == 4) {
		return "Change";
	} else if (num == 5) {
		return "Shuffle";
	} else {
		return "";
	}
};

export const Target = (result: number) => {
	let target;
	let place;

	// target <= 3
	if (result <= 3) {
		target = "0";
		place = result;
	} else {
		target = result.toString().slice(0, 1);
		place = Number(result.toString().slice(1));
	}
	console.log("target: ", target);

	if (place == 0) {
		return target + " : No";
	} else if (place == 1) {
		return target + " : 1s";
	} else if (place == 2) {
		return target + " : 10s";
	} else if (place == 3) {
		return target + " : 100s";
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
