FROM node:lts-alpine3.21 AS builder
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci
COPY . .
RUN npm run build

FROM nginx:stable-bookworm
# copy main nginx config
COPY nginx/nginx.conf /etc/nginx/nginx.conf

# copy site config
COPY nginx/sites-available/app.conf /etc/nginx/sites-available/app.conf

RUN mkdir -p /etc/nginx/sites-enabled \
    && ln -s /etc/nginx/sites-available/app.conf /etc/nginx/sites-enabled/

# copy build hasil Vite ke html
COPY --from=builder /app/dist /usr/share/nginx/html

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
