/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_CLERK_PUBLISHABLE_KEY: string;
  // other env variables...
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
