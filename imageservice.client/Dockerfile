# Build 階段不變，仍用 node:18-slim
FROM node:18-slim AS build
WORKDIR /src
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build -- --configuration production

# Runtime 階段：用 Node.js 來 serve + proxy
FROM node:18-slim
WORKDIR /app

# 複製 build 輸出到 public
COPY --from=build /src/dist/imageservice.client/browser ./public

# 複製 server.js 及 package.json
COPY server.js package*.json ./

# 安裝生產依賴
RUN npm ci --production

EXPOSE 8080
CMD ["node", "server.js"]
