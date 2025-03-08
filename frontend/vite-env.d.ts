/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_API_ROOT_URL: string;
  // Add other VITE_* variables here
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
