# Build stage
FROM node:20-alpine AS builder
WORKDIR /app

# API base URL baked into the bundle at build time.
# Default "/api" -> calls stay same-origin and are proxied by nginx to the backend.
ARG VITE_API_BASE_URL=/api
ENV VITE_API_BASE_URL=$VITE_API_BASE_URL

COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

# Run stage
FROM nginx:alpine
# SPA + /api reverse proxy config
COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=builder /app/dist /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
