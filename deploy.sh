#!/usr/bin/env bash
# Deploy the static site in ./site to Cloudflare Pages.
# Usage: ./deploy.sh   (or: pnpm run deploy)
# See DEPLOY.md for full instructions.
set -euo pipefail

PROJECT_NAME="${CF_PAGES_PROJECT:-strength-training-site}"
SITE_DIR="$(cd "$(dirname "$0")" && pwd)/site"
BRANCH="${CF_PAGES_BRANCH:-main}"

if [ ! -f "$SITE_DIR/index.html" ]; then
  echo "Error: $SITE_DIR/index.html not found — nothing to deploy." >&2
  exit 1
fi

# Log in if this machine isn't authenticated yet (opens a browser window).
if npx wrangler whoami 2>&1 | grep -qi "not authenticated"; then
  echo "Not logged in to Cloudflare — opening browser to log in..."
  npx wrangler login
fi

# Create the Pages project on first run.
if ! npx wrangler pages project list 2>/dev/null | grep -q "$PROJECT_NAME"; then
  echo "Creating Cloudflare Pages project '$PROJECT_NAME'..."
  npx wrangler pages project create "$PROJECT_NAME" --production-branch "$BRANCH"
fi

echo "Deploying $SITE_DIR to Cloudflare Pages project '$PROJECT_NAME'..."
npx wrangler pages deploy "$SITE_DIR" --project-name "$PROJECT_NAME" --branch "$BRANCH"
