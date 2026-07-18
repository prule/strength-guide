# Deploying the site to Cloudflare Pages

The static site lives in the [`site/`](site/) directory and deploys to
Cloudflare Pages using [Wrangler](https://developers.cloudflare.com/workers/wrangler/)
(already installed as a dev dependency).

## TL;DR

```bash
npm run deploy
```

That's it. The script prints the live URL when it finishes
(e.g. `https://strength-training-site.pages.dev`).

## What the script does

`npm run deploy` runs [`deploy.sh`](deploy.sh), which:

1. Checks that `site/index.html` exists.
2. Checks you're logged in to Cloudflare — if not, it opens a browser
   window for you to log in (one-time per machine; the token is cached).
3. Creates the Pages project `strength-training-site` if it doesn't exist
   yet (one-time).
4. Uploads everything in `site/` as a new production deployment.

## First-time setup

Nothing beyond having a Cloudflare account (free tier is fine). The
browser login step happens automatically the first time you deploy.

If dependencies were wiped, reinstall with:

```bash
npm install
```

## Changing the project name or branch

The script reads two optional environment variables:

```bash
CF_PAGES_PROJECT=my-other-name npm run deploy   # different Pages project
CF_PAGES_BRANCH=preview npm run deploy          # preview (non-production) deployment
```

Deployments on a branch other than `main` get a preview URL like
`https://preview.strength-training-site.pages.dev` instead of replacing
the production site.

## Useful commands

```bash
npx wrangler whoami                                              # check login status
npx wrangler pages deployment list --project-name strength-training-site   # deployment history
npx wrangler pages project list                                  # all Pages projects
```

## Rolling back

Cloudflare keeps every deployment. To roll back, open the Cloudflare
dashboard → Workers & Pages → `strength-training-site` → Deployments,
and click **Rollback** on a previous deployment. (Or just re-run
`npm run deploy` from an older git checkout.)

## Custom domain

To serve the site from your own domain: Cloudflare dashboard →
Workers & Pages → `strength-training-site` → Custom domains → add your
domain and follow the DNS prompts.
