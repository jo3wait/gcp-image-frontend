export const environment = {
  production: false,
  authApi: window.__env.AUTH_URL  || 'https://localhost:8080',   // dev fallback
  imageApi: window.__env.IMAGE_URL || 'https://localhost:8082'
};
