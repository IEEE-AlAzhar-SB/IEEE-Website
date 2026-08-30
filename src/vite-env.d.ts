/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_BACKEND_URL: string;
  readonly VITE_FRONTEND_URL: string;
  readonly VITE_CLOUDINARY_CLOUD_NAME: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}

declare module "*.WebP" {
  const src: string;
  export default src;
}
