# ─── 1. Build 階段：Node.js 18 ───────────────────────
FROM node:18-slim AS build
WORKDIR /src

# 1.1 安裝所有依賴
COPY package*.json ./
RUN npm ci

# 1.2 複製原始碼並執行 build
COPY . .
RUN npm run build -- --configuration production

# 2. Runtime 階段
FROM nginx:stable-alpine
ENV PORT 8080

RUN rm -rf /usr/share/nginx/html/*

# 這裡抓 angular.json 裡預設的 dist 資料夾
COPY --from=build /src/dist/imageservice.client/ /usr/share/nginx/html/
RUN ls -R /usr/share/nginx/html

# 2.3 修改 listen port 與 deep‑link 支援
RUN sed -i 's|listen       80;|listen       8080;|g' /etc/nginx/conf.d/default.conf \
 && sed -i 's|index  index.html;|try_files \$uri \$uri/ /index.html;|g' /etc/nginx/conf.d/default.conf

EXPOSE 8080

CMD ["nginx", "-g", "daemon off;"]
