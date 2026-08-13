FROM nginx:alpine
COPY dist/angular-portal/browser /usr/share/nginx/html
CMD ["sh", "-c", "sed -i 's/listen  *80;/listen '\"${PORT:-80}\"';/g' /etc/nginx/conf.d/default.conf && nginx -g 'daemon off;'"]
