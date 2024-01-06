// export const REGISTRY_ADDRESS = () => {
// 	const VITE_ENV = import.meta.env.VITE_ENV;
// 	console.log("VITE_ENV REGISTRY_ADDRESS: ", VITE_ENV);
// 	if (VITE_ENV == "LOCAL") {
// 		console.log("local registry");
// 		return "0x0bb62f3406a62182192f45644ed90301dbe9a6298464926a4aa62ac7f4c5a1e9";
// 	} else if (VITE_ENV == "REMOTE") {
// 		console.log("remote registry");
// 		return "0x10e03bf804f3e817e7bdf1bbb8bd9e0245ea56731dc9a91ff474cda5411bf134";
// 	}
// };

// export const SANDBOX_URL = () => {
// 	const VITE_ENV = import.meta.env.VITE_ENV;
// 	console.log("VITE_ENV SANDBOX_URL: ", VITE_ENV);
// 	if (VITE_ENV == "LOCAL") {
// 		console.log("local");
// 		return "http://localhost:8080";
// 	} else if (VITE_ENV == "REMOTE") {
// 		console.log("remote");
// 		return "http://212.227.240.189:8080";
// 	}
// };

export const REGISTRY_ADDRESS =
	import.meta.env.VITE_ENV == "LOCAL"
		? "0x0bb62f3406a62182192f45644ed90301dbe9a6298464926a4aa62ac7f4c5a1e9"
		: import.meta.env.VITE_ENV == "REMOTE"
		? "0x24a9716368f51c1436cac2c7d8cfe1f72eafd0de8de7513061b6c2d0462e4623"
		: "";

export const SANDBOX_URL =
	import.meta.env.VITE_ENV == "LOCAL"
		? "http://localhost:8080"
		: import.meta.env.VITE_ENV == "REMOTE"
		? "http://212.227.240.189:8080"
		: "";

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
