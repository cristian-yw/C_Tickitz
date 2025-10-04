# -----------------------------
# Build stage
# -----------------------------
FROM node:lts-alpine3.21 AS builder
WORKDIR /app

# Install dependencies
COPY package.json package-lock.json ./
RUN npm ci

# Copy source code
COPY . .
RUN npm run build

# -----------------------------
# Production stage
# -----------------------------
FROM nginx:stable

# Copy site config ke conf.d (default nginx.conf sudah include mime.types)
COPY nginx/sites-available/app.conf /etc/nginx/conf.d/app.conf

# Copy hasil build Vite ke folder HTML Nginx
COPY --from=builder /app/dist /usr/share/nginx/html

# Expose port
EXPOSE 80

# Start Nginx
CMD ["nginx", "-g", "daemon off;"]
