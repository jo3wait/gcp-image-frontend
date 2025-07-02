export const environment = {
  production: false,
  authApi : import.meta.env.VITE_AUTH_URL  || 'https://localhost:8080',   // ← dev fallback
  imageApi: import.meta.env.VITE_IMAGE_URL || 'https://localhost:8082'
};
