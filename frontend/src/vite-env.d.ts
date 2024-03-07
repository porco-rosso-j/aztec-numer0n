/// <reference types="vite/client" />

interface ImportMetaEnv {
	readonly VITE_ENV: string;
	readonly VITE_REGISRTY_ADDRESS: string;
	// more env variables...
}

interface ImportMeta {
	readonly env: ImportMetaEnv;
}
