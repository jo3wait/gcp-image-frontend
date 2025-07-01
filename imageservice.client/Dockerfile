# 1. Build 時用 Node 18
FROM node:18-slim AS build  
WORKDIR /src
COPY package*.json ./
RUN npm ci --omit=dev     
COPY . .
RUN npm run build -- --configuration production --output-path=/dist

# 2. Runtime 用 Nginx
FROM nginx:stable-alpine
COPY --from=build /dist /usr/share/nginx/html
# 讓 Angular router 支援 deep-link
RUN sed -i 's|index  index.html;|try_files $uri $uri/ /index.html;|g' /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
