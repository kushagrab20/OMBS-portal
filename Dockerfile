FROM node:22-alpine AS build

WORKDIR /app

ENV NG_DISABLE_VERSION_CHECK=true

COPY frontend/angular-portal/package*.json ./
RUN npm install --legacy-peer-deps

COPY frontend/angular-portal/ ./
RUN npx ng build


FROM nginx:alpine

COPY --from=build /app/dist/angular-portal/browser /usr/share/nginx/html

COPY nginx.conf /etc/nginx/conf.d/default.conf

CMD ["sh", "-c", "echo \"Railway PORT=$PORT\" && sed -i \"s/listen 80;/listen ${PORT};/\" /etc/nginx/conf.d/default.conf && echo \"Nginx config:\" && cat /etc/nginx/conf.d/default.conf && exec nginx -g 'daemon off;'"]