// src/proxy.conf.js
module.exports = {
  '/api/auth': { target: 'https://localhost:8081', secure: false }, // 自簽憑證，關閉驗證
  '/api/image': { target: 'https://localhost:8083', secure: false }
};
