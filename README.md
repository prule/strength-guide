# The Strength Archive

This project contains documentation and a static website for various strength training and conditioning programs.

## Project Structure

*   `*.md` - Markdown files containing the content of each strength training program.
*   `site/` - The compiled static website. It contains plain HTML/CSS files built to serve the content using a custom frontend component framework (`<x-dc>`).
*   `site/support.js` - Contains the runtime for the site.
*   `deploy.sh` - Bash script that deploys the static site to Cloudflare Pages.

## How to Work in This Project

### Adding Content
Currently, content must be added in two places to keep the site and repository in sync:
1.  **Markdown files**: Add or edit the `.md` files in the root directory. These serve as the master content repository.
2.  **HTML files**: You must manually apply those content updates to the respective `.html` files in the `site/` directory, adhering to the existing CSS and structure.

### Running Locally
To test the site locally, you can use any static file server to serve the `site/` directory.

Since `wrangler` is installed as a devDependency, you can use the built-in npm script to preview the site:
```bash
npm run dev
```
This will start a local server at `http://localhost:8788`.

### Deployment
The site is hosted on Cloudflare Pages. You can deploy changes using the provided deploy script:

```bash
npm run deploy
# OR
./deploy.sh
```

Ensure you are logged into Wrangler (`npx wrangler login`) before deploying.
