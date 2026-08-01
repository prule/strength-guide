# The Strength Archive

This project contains documentation and a static website for various strength training and conditioning programs.

## Project Structure

*   `*.md` - Markdown files containing the content of each strength training program.
*   `site/` - The compiled static website.
*   `site/style.css` - Global stylesheet to style standard markdown tags beautifully.
*   `site/support.js` - Contains the runtime for the site.
*   `build.js` - Node script that compiles the Markdown source files into the HTML layout.
*   `deploy.sh` - Bash script that deploys the static site to Cloudflare Pages.

## How to Work in This Project

### Adding Content
The `.md` files in the root directory act as the **single source of truth** for all training programs. You no longer need to edit HTML files manually for program content!

To add or update a program:
1. Edit the respective `.md` file using standard markdown.
2. Run `pnpm run build` to automatically compile your markdown into the fully-styled HTML files in the `site/` directory.

*Note: The homepage (`site/index.html`) is hand-coded due to its complex interactive program picker logic. Changes to the homepage must be made directly in `site/index.html`.*

### Building the Site
To manually trigger the build process (which uses `marked` and custom regex magic to render workout tables and asides), run:
```bash
pnpm run build
```

### Running Locally
To test the site locally, you can use any static file server to serve the `site/` directory.

Since `wrangler` is installed as a devDependency, you can use the built-in npm script to preview the site:
```bash
pnpm run dev
```
This will start a local server at `http://localhost:8788`.

### Deployment
The site is hosted on Cloudflare Pages. You can deploy changes using the provided deploy script:

```bash
pnpm run deploy
# OR
./deploy.sh
```

Ensure you are logged into Wrangler (`npx wrangler login`) before deploying.
