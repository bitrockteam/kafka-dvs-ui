#!/usr/bin/env sh
set -e

cd /etc/nginx/
find . -type f -exec sed -i -E 's#\$NGINX_PORT\$#'"$NGINX_PORT"'#g' {} \;

cd /usr/share/nginx/html
find . -type f -exec sed -i -E 's#__DVS_WS_URL__#'"$DVS_WS_URL"'#g' {} \;
find . -type f -exec sed -i -E 's#__DVS_HTTP_URL__#'"$DVS_HTTP_URL"'#g' {} \;

exec "$@"
