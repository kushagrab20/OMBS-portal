FROM node:22-alpine AS build
WORKDIR /app
ENV NG_DISABLE_VERSION_CHECK=true
COPY frontend/angular-portal/package*.json ./
RUN npm install --legacy-peer-deps
COPY frontend/angular-portal/ ./
RUN npx ng build

FROM nginx:alpine
ENV PORT=80
COPY --from=build /app/dist/angular-portal/browser /usr/share/nginx/html
CMD ["sh", "-c", "sed -i 's/80;/'\"${PORT:-80}\"';/g' /etc/nginx/conf.d/default.conf && exec nginx -g 'daemon off;'"]
