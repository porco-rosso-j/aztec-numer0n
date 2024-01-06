/// <reference types="vite/client" />

interface ImportMetaEnv {
	readonly VITE_LOCAL: boolean;
	// more env variables...
}

interface ImportMeta {
	readonly env: ImportMetaEnv;
}
