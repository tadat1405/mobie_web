# syntax=docker/dockerfile:1

FROM node:22-slim AS build
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci --legacy-peer-deps
COPY . .
# Gọi API cùng domain qua Nginx (/api), nên không cần CORS
ARG VITE_API_URL_BACKEND=/api
ARG VITE_BASE=/
ENV VITE_API_URL_BACKEND=$VITE_API_URL_BACKEND \
    VITE_BASE=$VITE_BASE
RUN npm run build

FROM nginx:1.27-alpine
COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=build /app/dist /usr/share/nginx/html
EXPOSE 80
HEALTHCHECK --interval=30s --timeout=5s --retries=3 \
  CMD wget -qO- http://127.0.0.1/ >/dev/null || exit 1
