# ─── 1. Build 階段：Node.js 18 ───────────────────────
FROM node:18-slim AS build
WORKDIR /src

# 安裝所有依賴（含 devDependencies，以確保 ng build 可用）
COPY package*.json ./
RUN npm ci

COPY . .
RUN npm run build -- --configuration production --output-path=/dist

# ─── 2. Runtime 階段：Nginx ─────────────────────────
FROM nginx:stable-alpine
# 宣告 Cloud Run 預設使用的監聽埠
ENV PORT 8080

# 先清空預設靜態檔資料夾
RUN rm -rf /usr/share/nginx/html/*
# 把打包好的前端檔案放到 Nginx root
COPY --from=build /dist/ /usr/share/nginx/html/

# 修改 Nginx 設定：
# 1. 把 listen 80 → listen 8080
# 2. Deep-link 路由 fallback
RUN sed -i 's|listen       80;|listen       8080;|g' /etc/nginx/conf.d/default.conf \
 && sed -i 's|index  index.html;|try_files $uri $uri/ /index.html;|g'   /etc/nginx/conf.d/default.conf

EXPOSE 8080

CMD ["nginx", "-g", "daemon off;"]
