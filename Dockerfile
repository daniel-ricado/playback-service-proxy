FROM node:18-alpine AS node-builder

WORKDIR /app

COPY package*.json ./
RUN npm install 

COPY . .

RUN npm run build

FROM nginx:alpine

RUN apk add --no-cache curl

COPY ./nginx/nginx.conf /etc/nginx/nginx.conf

COPY --from=node-builder /app /usr/src/app

VOLUME /var/nginx/manifests

EXPOSE 80

CMD ["sh", "-c", "nginx -g 'daemon off;' & node /usr/src/app/server.js"]