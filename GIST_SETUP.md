# Setting Up Gist for Subscriber Count

## Steps:

1. **Create a GitHub Personal Access Token**
   - Go to GitHub Settings → Developer settings → Personal access tokens → Tokens (classic)
   - Click "Generate new token (classic)"
   - Give it a name like "Bitworld Gist Updates"
   - Select scope: `gist` (Create gists)
   - Generate and copy the token

2. **Add Token to Repository Secrets**
   - Go to your repository Settings → Secrets and variables → Actions
   - Add new secret:
     - Name: `GIST_TOKEN`
     - Value: [paste your token]

3. **Run the Workflow Once**
   - Go to Actions tab → "Update Subscriber Count"
   - Run workflow
   - Check the logs - it will create a new Gist and show the ID

4. **Add the Gist ID**
   - Copy the Gist ID from the workflow logs
   - Add another secret:
     - Name: `GIST_ID`
     - Value: [paste the Gist ID]

5. **Update Your Code**
   - In `index.html`, replace `YOUR_GIST_ID` with the actual Gist ID
   - Push the change

## Benefits:
- No commits to your repository for count updates
- Cleaner git history
- Public Gist can be accessed without CORS issues
- Still updates every hour automatically

## The Gist URL:
After setup, your subscriber count will be available at:
`https://gist.github.com/super3/[GIST_ID]`