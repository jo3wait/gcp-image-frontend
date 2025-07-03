# 1. Build 階段：Node.js 18
FROM node:18-slim AS build
WORKDIR /src
COPY package*.json ./
RUN npm ci --omit=dev
COPY . .
RUN npm run build -- --configuration production --output-path=/dist

# 2. Runtime 階段：Nginx
FROM nginx:stable-alpine

# Cloud Run 預設會在 $PORT（8080）監聽
ENV PORT 8080
COPY --from=build /dist /usr/share/nginx/html

# 讓 Angular router 支援 deep-link
RUN sed -i 's|index  index.html;|try_files $uri $uri/ /index.html;|g' /etc/nginx/conf.d/default.conf \
 && sed -i 's|listen       80;|listen       ${PORT};|g' /etc/nginx/conf.d/default.conf

EXPOSE 8080

# 啟動時把 $PORT 注入 config 裡，再跑 nginx
CMD ["sh", "-c", "envsubst '$PORT' < /etc/nginx/conf.d/default.conf > /etc/nginx/conf.d/default.conf && nginx -g 'daemon off;'"]
