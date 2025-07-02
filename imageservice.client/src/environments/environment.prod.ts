export const environment = {
  production: true,
  authApi: import.meta.env.VITE_AUTH_URL,   // Cloud Run 由環境變數注入
  imageApi: import.meta.env.VITE_IMAGE_URL
};
