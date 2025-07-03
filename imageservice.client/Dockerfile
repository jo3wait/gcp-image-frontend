# 1. Build 階段：Node.js 18
FROM node:18-slim AS build
WORKDIR /src

# 安裝所有依賴（包含 devDependencies）
COPY package*.json ./
RUN npm ci

# 複製原始碼並打包
COPY . .
RUN npm run build -- --configuration production --output-path=/dist

# 2. Runtime 階段：Nginx
FROM nginx:stable-alpine
ENV PORT 8080

# copy build 好的靜態檔
COPY --from=build /dist /usr/share/nginx/html

# 支援 Angular Router deep-link，並把 listen 改成 $PORT
RUN sed -i 's|listen       80;|listen       ${PORT};|g' /etc/nginx/conf.d/default.conf \
 && sed -i 's|index  index.html;|try_files $uri $uri/ /index.html;|g' /etc/nginx/conf.d/default.conf

EXPOSE 8080

# 啟動前注入環境變數，再啟動 nginx
CMD ["sh", "-c", "envsubst '$PORT' < /etc/nginx/conf.d/default.conf > /etc/nginx/conf.d/default.conf && nginx -g 'daemon off;'"]
