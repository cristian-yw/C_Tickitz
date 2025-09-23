FROM node:lts-alpine3.21 AS builder
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci
COPY . .
RUN npm run build


FROM nginx:stable-bookworm
# copy config langsung dari context, bukan builder
COPY nginx/nginx.conf /etc/nginx/nginx.conf
COPY nginx/sites-available/app.conf /etc/nginx/sites-available/app.conf

RUN mkdir -p /etc/nginx/sites-enabled \
    && ln -s /etc/nginx/sites-available/app.conf /etc/nginx/sites-enabled/

COPY --from=builder /app/dist /var/www/client

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]