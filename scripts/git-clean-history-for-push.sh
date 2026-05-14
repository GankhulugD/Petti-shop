#!/usr/bin/env bash
# GitHub 100MB хязгаараас зайлсхийх: түүхээс node_modules болон .next-ийг бүрэн хасна.
# Ашиглалт: bash scripts/git-clean-history-for-push.sh
# Дараа нь: git push -f origin main   (эсвэл одоогийн салбарын нэр)

set -euo pipefail
ROOT="$(cd "$(dirname "$0")/.." && pwd)"
cd "$ROOT"

if ! git rev-parse --is-inside-work-tree >/dev/null 2>&1; then
  echo "Git репо биш байна."
  exit 1
fi

BRANCH=$(git branch --show-current)
if [[ -z "$BRANCH" ]]; then
  echo "Салбар олдсонгүй (detached HEAD?). Эхлээд main эсвэл ажлын салбар руу шилжинэ үү."
  exit 1
fi

echo "Одоогийн салбар: $BRANCH"
echo "Нөөц: backup/pre-clean-$(date +%Y%m%d-%H%M%S)"
git branch "backup/pre-clean-$(date +%Y%m%d-%H%M%S)" 2>/dev/null || true

ORPHAN="__petti_clean_$(date +%s)"
echo "Шинэ (orphan) эхний commit үүсгэж байна ($ORPHAN)…"
git branch -D "$ORPHAN" 2>/dev/null || true
git checkout --orphan "$ORPHAN"

git rm -rf --cached node_modules .next 2>/dev/null || true

git add -A

if git diff --cached --name-only | grep -E '^(node_modules/|\.next/)' >/dev/null 2>&1; then
  echo "АЛДАА: node_modules эсвэл .next staging-д үлдсэн байна."
  exit 1
fi

git commit -m "chore: цэвэр git түүх (node_modules, .next-ийг git-ээс хассан)"

git branch -D "$BRANCH" 2>/dev/null || true
git branch -m "$BRANCH"

echo ""
echo "Дууссан. Одоо түлхүү push (түүх rewrite тул -f шаардлагатай):"
echo "  git push -f origin $BRANCH"
echo ""
echo "Анхаар: -f нь remote-ийн түүхийг дарна. Бусад хүн татах бол өмнөх commit алдана."
