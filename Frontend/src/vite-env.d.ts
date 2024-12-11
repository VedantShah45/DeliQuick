/// <reference types="vite/client" />

interface ImportMetaEnv {
    VITE_GOOGLE_API_KEY: string
    // more env variables...
  }
  
  interface ImportMeta {
    readonly env: ImportMetaEnv
  }