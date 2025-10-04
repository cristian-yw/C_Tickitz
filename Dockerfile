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

# Copy premade config
COPY --from=builder /app/nginx/nginx.conf /etc/nginx/
COPY --from=builder /app/nginx/sites-available/app.conf /etc/nginx/sites-available/

# Create symbolic link
RUN mkdir -p /etc/nginx/sites-enabled
RUN ln -s /etc/nginx/sites-available/app.conf /etc/nginx/sites-enabled/

# Copy aplikasi dari builder ke lokasi serve
RUN mkdir -p /var/www/client
COPY --from=builder /app/dist /var/www/client

# Buka port untuk akses nginx
EXPOSE 80

# Jalankan nginx di foreground
CMD [ "nginx", "-g", "daemon off;" ]