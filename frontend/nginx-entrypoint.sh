#!/bin/sh
set -eu

API_URL="${API_URL:-http://localhost:8083}"
mkdir -p /usr/share/nginx/html/assets
cat > /usr/share/nginx/html/assets/runtime-config.js <<EOF
window.__env = {
  API_URL: "${API_URL}"
};
EOF

exec nginx -g 'daemon off;'
