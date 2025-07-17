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

# 刪除預設的靜態目錄
RUN rm -rf /usr/share/nginx/html/*

# 這裡抓 angular.json 裡預設的 dist 資料夾
COPY --from=build /src/dist/imageservice.client/browser/ /usr/share/nginx/html/
# RUN ls -R /usr/share/nginx/html 

# 複製模板
COPY src/assets/env.template.js /usr/share/nginx/html/assets/env.template.js

# 啟動時，用 envsubst 把 $AUTH_URL、$IMAGE_URL 換成實際值
RUN apk add --no-cache gettext \
 && envsubst \
     '\$AUTH_URL \$IMAGE_URL' \
     < /usr/share/nginx/html/assets/env.template.js \
     > /usr/share/nginx/html/assets/env.js \
 && rm /usr/share/nginx/html/assets/env.template.js \
 && apk del gettext

# ─── listen/index 調整 & 追加 /token 代理 ───────────────────────
RUN cat << 'EOF' > /etc/nginx/nginx.conf
user  nginx;
worker_processes  1;
error_log  /var/log/nginx/error.log warn;
pid        /var/run/nginx.pid;

events {
    worker_connections 1024;
}

http {
    include       /etc/nginx/mime.types;
    default_type  application/octet-stream;
    sendfile        on;
    keepalive_timeout  65;

    server {
        listen       8080 default_server;
        server_name  _;

        root   /usr/share/nginx/html;
        index  index.html;

        # 静态 + deep-link 支持
        location / {
            try_files \$uri \$uri/ /index.html;
        }

        # 精确匹配 /token → proxy metadata
        location = /token {
            internal;
            proxy_pass http://metadata/computeMetadata/v1/instance/service-accounts/default/identity?audience=\$arg_audience;
            proxy_set_header Metadata-Flavor "Google";
            add_header Cache-Control no-store;
        }
    }
}
EOF

EXPOSE 8080

CMD ["nginx", "-g", "daemon off;"]
