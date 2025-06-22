# Deployment to GitHub Pages

This project is configured to automatically deploy to GitHub Pages using GitHub Actions.

## Setup Instructions

### 1. Enable GitHub Pages

1. Go to your repository on GitHub
2. Click on **Settings** tab
3. Scroll down to **Pages** section in the left sidebar
4. Under **Source**, select **Deploy from a branch**
5. Choose **gh-pages** branch and **/ (root)** folder
6. Click **Save**

### 2. Enable GitHub Actions

1. Go to the **Actions** tab in your repository
2. If prompted, click **"I understand my workflows, go ahead and enable them"**
3. The workflow will automatically run on every push to `main` or `master` branch

### 3. Access Your Game

After the workflow completes successfully:

- Your game will be available at: `https://[your-username].github.io/[repository-name]/`
- For example: `https://myusername.github.io/simworld/`

## Workflow Details

The GitHub Action workflow (`.github/workflows/deploy.yml`) does the following:

1. **Checkout** - Downloads your repository code
2. **Setup Node.js** - Prepares the Node.js environment
3. **Install dependencies** - Runs `npm ci` if package.json exists
4. **Copy files** - Copies all necessary game files to a build directory:
   - `index.html`
   - `js/` folder (all JavaScript files)
   - `NPC/` folder (character sprites)
   - `World/` folder (building sprites)
   - `package.json`
5. **Deploy** - Pushes the build files to the `gh-pages` branch

## Triggering Deployment

Deployment happens automatically when you:
- Push commits to the `main` or `master` branch
- Merge pull requests into `main` or `master`

## Troubleshooting

### If deployment fails:

1. Check the **Actions** tab for error details
2. Ensure all file paths in the workflow match your project structure
3. Verify that GitHub Pages is enabled in repository settings

### If the game doesn't load:

1. Check browser console for errors
2. Ensure all asset paths are relative (no leading `/`)
3. Verify that all image files are included in the deployment

### Custom Domain (Optional)

To use a custom domain:
1. Add a `CNAME` file to your repository root with your domain name
2. Configure DNS settings with your domain provider
3. Update GitHub Pages settings to use your custom domain

## Local Testing

Before deploying, you can test locally:

```bash
npm start
# or
python -m http.server 8080
```

Then visit `http://localhost:8080` 