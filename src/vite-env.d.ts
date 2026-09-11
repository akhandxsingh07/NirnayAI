/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_NIRNAY_ADMIN_EMAIL?: string;
  readonly VITE_NIRNAY_ADMIN_PASSCODE?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
