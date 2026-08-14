FROM node:22-alpine AS build
WORKDIR /app
ENV NG_DISABLE_VERSION_CHECK=true
COPY frontend/angular-portal/package*.json ./
RUN npm install --legacy-peer-deps
COPY frontend/angular-portal/ ./
RUN npx ng build

FROM nginx:alpine
COPY frontend/angular-portal/nginx.conf.template /etc/nginx/conf.d/default.conf
COPY --from=build /app/dist/angular-portal/browser /usr/share/nginx/html
EXPOSE 80 8080
