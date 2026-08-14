FROM node:22-alpine AS build
WORKDIR /app
ENV NG_DISABLE_VERSION_CHECK=true
COPY frontend/angular-portal/package*.json ./
RUN npm install --legacy-peer-deps
COPY frontend/angular-portal/ ./
RUN npx ng build

FROM nginx:alpine
ENV PORT=8080
EXPOSE 80 8080
COPY frontend/angular-portal/nginx.conf.template /etc/nginx/templates/default.conf.template
COPY --from=build /app/dist/angular-portal/browser /usr/share/nginx/html
