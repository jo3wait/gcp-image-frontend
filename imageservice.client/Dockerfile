# 1. Build 階段：Node.js 18
FROM node:18-slim AS build
WORKDIR /src

# 只裝 production 依賴
COPY package*.json ./
RUN npm ci --omit=dev

# 全域安裝 Angular CLI（版對齊專案）
RUN npm install -g @angular/cli@17.3.17

# 複製原始碼並打包
COPY . .
RUN ng build --configuration production --output-path=/dist

# 2. Runtime 階段：Nginx
FROM nginx:stable-alpine
ENV PORT 8080

# 取出 build 好的檔案
COPY --from=build /dist /usr/share/nginx/html

# 支援 Angular Router deep-link；並改成聽 $PORT
RUN sed -i 's|listen       80;|listen       ${PORT};|g' /etc/nginx/conf.d/default.conf \
 && sed -i 's|index  index.html;|try_files $uri $uri/ /index.html;|g' /etc/nginx/conf.d/default.conf

EXPOSE 8080

# 啟動前注入環境變數到 config，然後啟動 nginx
CMD ["sh", "-c", "envsubst '$PORT' < /etc/nginx/conf.d/default.conf > /etc/nginx/conf.d/default.conf && nginx -g 'daemon off;'"]
