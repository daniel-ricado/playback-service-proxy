FROM node:18-alpine AS node-builder

WORKDIR /app

COPY package*.json ./
RUN npm install 
 
COPY . .

RUN npm run build

FROM nginx:alpine

RUN apk add --no-cache curl nodejs npm

COPY ./nginx/nginx.conf /etc/nginx/nginx.conf

COPY --from=node-builder /app /usr/src/app

VOLUME /var/nginx/manifests

RUN mkdir -p /var/nginx/manifests && \
    chown -R nginx:nginx /var/nginx/manifests && \
    chmod 755 /var/nginx/manifests

EXPOSE 80 443

CMD ["sh", "-c", "nginx -g 'daemon off;' & node /usr/src/app/dist/server.js --env-file='/usr/src/app/.env'"]

# docker build -t playback-service-proxy .

# docker run -d \
#   -p 8888:80 \
#   -p 44300:443 \
#   -v manifests:/var/nginx/manifests \
#   --name playback-service-proxy \
#   playback-service-proxy