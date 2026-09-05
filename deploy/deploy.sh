#!/usr/bin/env bash
# ============================================
# Isil-Blog 服务器一键部署脚本（在服务器上执行）
# 用法:
#   cd deploy
#   cp deploy.conf.example deploy.conf   # 按需修改
#   sudo bash deploy.sh
# 全程非交互，可重复执行（幂等）
# ============================================
set -euo pipefail

cd "$(dirname "$0")"
[ -f deploy.conf ] || { echo "[x] 缺少 deploy.conf，请先: cp deploy.conf.example deploy.conf"; exit 1; }
source deploy.conf

[ -n "${DOMAIN:-}" ] || { echo "[x] 请在 deploy.conf 中配置 DOMAIN（HTTPS 证书绑定域名）"; exit 1; }

APP_PORT=${APP_PORT:-3001}
WEB_ROOT=${WEB_ROOT:-/root/build}
IMAGES_BASE=${IMAGES_BASE:-/root}
SSL_CERT=${SSL_CERT:-/etc/nginx/ssl/$DOMAIN.pem}
SSL_KEY=${SSL_KEY:-/etc/nginx/ssl/$DOMAIN.key}
DAEMON=${DAEMON:-pm2}
REPO_DIR=$(cd .. && pwd)

echo "==> [1/7] 安装依赖"
(cd "$REPO_DIR" && npm install --no-audit --no-fund)
(cd "$REPO_DIR/client" && npm install --no-audit --no-fund)
(cd "$REPO_DIR/server" && npm install --no-audit --no-fund)

echo "==> [2/7] 构建前端 (API 地址: https://$DOMAIN/api/)"
(cd "$REPO_DIR/client" && REACT_APP_BASEURL="https://$DOMAIN/api/" npx react-scripts build)

echo "==> [3/7] 同步静态资源与图片目录"
mkdir -p "$WEB_ROOT" "$IMAGES_BASE/images"
rsync -a --delete "$REPO_DIR/client/build/" "$WEB_ROOT/"

echo "==> [4/7] 生成后端环境变量 (server/.env)"
if [ ! -f "$REPO_DIR/server/.env" ]; then
    cp "$REPO_DIR/server/.env.example" "$REPO_DIR/server/.env"
    echo "[!] 已生成 $REPO_DIR/server/.env —— 请填入 MONGODB_URI / SECRET 后重新执行本脚本"
    exit 1
fi
# 幂等写入 UPLOAD_DIR（与 IMAGES_BASE 对齐）
if grep -q '^UPLOAD_DIR=' "$REPO_DIR/server/.env"; then
    sed -i "s|^UPLOAD_DIR=.*|UPLOAD_DIR=$IMAGES_BASE|" "$REPO_DIR/server/.env"
else
    echo "UPLOAD_DIR=$IMAGES_BASE" >> "$REPO_DIR/server/.env"
fi

echo "==> [5/7] 启动后端 ($DAEMON)"
if [ "$DAEMON" = "pm2" ]; then
    command -v pm2 >/dev/null 2>&1 || npm install -g pm2 --silent
    pm2 delete isil-blog 2>/dev/null || true
    (cd "$REPO_DIR/server" && PORT=$APP_PORT pm2 start src/index.js --name isil-blog --cwd "$REPO_DIR/server" --time)
    pm2 save
else
    fuser -k "$APP_PORT"/tcp 2>/dev/null || true
    (cd "$REPO_DIR/server" && PORT=$APP_PORT nohup node src/index.js >> /var/log/isil-blog.log 2>&1 &)
fi
sleep 2
curl -fs "http://127.0.0.1:$APP_PORT/api/users" >/dev/null && echo "    后端已就绪 :$APP_PORT" || { echo "[x] 后端未就绪，查看日志"; [ "$DAEMON" = "pm2" ] && pm2 logs isil-blog --lines 20 || tail -20 /var/log/isil-blog.log; exit 1; }

echo "==> [6/7] 生成并校验 nginx 配置"
cp /etc/nginx/nginx.conf /etc/nginx/nginx.conf.bak.$(date +%Y%m%d%H%M%S) 2>/dev/null || true
NGINX_CONF=/etc/nginx/nginx.conf
sed -e "s|{{DOMAIN}}|$DOMAIN|g" \
    -e "s|{{SERVER_IP}}|${SERVER_IP:-}|g" \
    -e "s|{{WEB_ROOT}}|$WEB_ROOT|g" \
    -e "s|{{IMAGES_BASE}}|$IMAGES_BASE|g" \
    -e "s|{{APP_PORT}}|$APP_PORT|g" \
    -e "s|{{SSL_CERT}}|$SSL_CERT|g" \
    -e "s|{{SSL_KEY}}|$SSL_KEY|g" \
    nginx.conf.template > /etc/nginx/nginx.conf.isil

if nginx -t -c /etc/nginx/nginx.conf.isil 2>/dev/null; then
    mv /etc/nginx/nginx.conf.isil "$NGINX_CONF"
else
    echo "[x] nginx 配置校验失败，已保留原配置。生成文件: /etc/nginx/nginx.conf.isil"
    nginx -t -c /etc/nginx/nginx.conf.isil || true
    exit 1
fi

echo "==> [7/7] 重载 nginx"
systemctl reload nginx 2>/dev/null || nginx -s reload

echo ""
echo "=========================================="
echo " 部署完成"
echo "   站点:  https://$DOMAIN"
echo "   API:   https://$DOMAIN/api/"
echo "   图片:  $IMAGES_BASE/images/"
echo "   后端:  $DAEMON: isil-blog (port $APP_PORT)"
echo "   nginx 配置备份: /etc/nginx/nginx.conf.bak.*"
echo "=========================================="
