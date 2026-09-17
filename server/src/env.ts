export type WorkerEnv = {
  DB: D1Database;
  IMAGES?: R2Bucket;
  ADMIN_SECRET?: string;
  ALLOWED_ORIGINS?: string;
  /** Public API base for media URLs, e.g. https://petti-api.*.workers.dev */
  MEDIA_PUBLIC_URL?: string;
  CLOUDINARY_CLOUD_NAME?: string;
  CLOUDINARY_API_KEY?: string;
  CLOUDINARY_API_SECRET?: string;
};
