# Stage 1: Building App
FROM node:lts-alpine3.21 AS builder

# Set working directory
WORKDIR /app

# Copy file essensial untuk install dependency
COPY package.json package-lock.json ./

# Install package
RUN npm ci

# Copy sisanya
COPY . .

# Insert argument to environment during building image
ARG VITE_HOST
ENV VITE_BASE_URL=$VITE_HOST

# Build dengan command vite build
RUN npm run build

# Stage 2: setup app
FROM nginx:stable-bookworm

# Copy konfigurasi nginx utama (opsional, kalau kamu punya custom nginx.conf)
COPY --from=builder /app/nginx/nginx.conf /etc/nginx/nginx.conf

# Gunakan lokasi default untuk konfigurasi server
COPY --from=builder /app/nginx/sites-available/app.conf /etc/nginx/conf.d/default.conf

# Copy hasil build React/Vite ke folder web root
COPY --from=builder /app/dist /usr/share/nginx/html

# Buka port 80
EXPOSE 80

# Jalankan nginx
CMD ["nginx", "-g", "daemon off;"]