export type WorkerEnv = {
  DB: D1Database;
  ADMIN_SECRET?: string;
  ALLOWED_ORIGINS?: string;
  CLOUDINARY_CLOUD_NAME?: string;
  CLOUDINARY_API_KEY?: string;
  CLOUDINARY_API_SECRET?: string;
};
