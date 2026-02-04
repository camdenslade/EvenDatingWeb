/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_API_BASE_URL: string
  readonly VITE_ADMIN_FIREBASE_API_KEY?: string
  readonly VITE_ADMIN_FIREBASE_AUTH_DOMAIN?: string
  readonly VITE_ADMIN_FIREBASE_PROJECT_ID?: string
  readonly VITE_ADMIN_FIREBASE_STORAGE_BUCKET?: string
  readonly VITE_ADMIN_FIREBASE_MESSAGING_SENDER_ID?: string
  readonly VITE_ADMIN_FIREBASE_APP_ID?: string
  // Add other env variables here as needed
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}

