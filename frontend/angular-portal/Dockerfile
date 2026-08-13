FROM node:22-alpine AS build
WORKDIR /app
ENV NG_DISABLE_VERSION_CHECK=true
COPY package*.json ./
RUN npm install --legacy-peer-deps
COPY . .
RUN npx ng build

FROM nginx:alpine
COPY --from=build /app/dist/angular-portal/browser /usr/share/nginx/html
CMD ["sh", "-c", "sed -i 's/listen  *80;/listen '\"${PORT:-80}\"';/g' /etc/nginx/conf.d/default.conf && nginx -g 'daemon off;'"]
