FROM nginx:1.15-alpine

RUN apk add --no-cache curl

COPY image/docker-entrypoint.sh /
COPY image/default.conf /etc/nginx/conf.d/default.conf
COPY image/nginx.conf /etc/nginx/nginx.conf

COPY dist /usr/share/nginx/html

WORKDIR /usr/share/nginx/html

EXPOSE 80

HEALTHCHECK --interval=1m30s --timeout=3s \
        CMD curl -f http://localhost:80/nginx_status || exit 1

ENTRYPOINT ["/docker-entrypoint.sh"]
CMD ["/usr/sbin/nginx", "-g", "daemon off;"]
