export const registryAddress =
	"0x288e893b9a02944231c3a91be7b86caf69df9b159d1b35f7419ed2c1371cb353";

export const SANDBOX_URL = "http://212.227.240.189:8080";
// export const SANDBOX_URL = "http://localhost:8080";

export const SANDBOX_ADDRESS_1 =
	"0x06357cc85cb8fc561adbf741f63cd75efa26ffba1c80d431ec77d036d8edf022";
export const SANDBOX_ADDRESS_2 =
	"0x1b18a972d54db0283a04abaace5f7b03c3fca5a4b2c0cf113b457de6ea4991e7";
export const SANDBOX_ADDRESS_3 =
	"0x1d30d4de97657983408587c7a91ba6587774b30f0e70224a0658f0357092f495";

export const numLen = 3;

export const item = (num: number) => {
	return num == 1 ? "H&L" : "";
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
