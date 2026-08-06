#!/usr/bin/env bash
# 构建并部署到 GitHub Pages（gh-pages 分支）
# 用法：npm run deploy
set -euo pipefail

# URL 里带用户名：这台共用机器的凭据文件里有多人的账号，必须固定匹配自己的
REPO_URL="https://123456-made-in-T@github.com/123456-made-in-T/life-simulator.git"
PROJECT_DIR="$(cd "$(dirname "$0")/.." && pwd)"

cd "$PROJECT_DIR"
npm run build

cd dist
rm -rf .git
git init -q -b gh-pages
git add -A
git -c user.name=Tjc -c user.email=15307493780@qq.com commit -qm "deploy: $(date +%F_%T)"
git push -f "$REPO_URL" gh-pages:gh-pages
rm -rf .git

echo "部署完成：https://123456-made-in-t.github.io/life-simulator/"
