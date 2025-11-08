# Publishing GitBox to VS Code Marketplace

Follow these steps to publish your extension to the Visual Studio Code Marketplace.

## Prerequisites

Before publishing, you need to:

1. **Create a Microsoft/Azure DevOps Account**
2. **Get a Personal Access Token (PAT)**
3. **Create a Publisher ID**
4. **Update package.json with your publisher name**

---

## Step 1: Create Azure DevOps Account

1. Go to https://dev.azure.com
2. Sign in with your Microsoft account (or create one)
3. You'll be redirected to Azure DevOps

---

## Step 2: Create a Personal Access Token (PAT)

1. In Azure DevOps, click on your profile icon (top right)
2. Click **"Personal access tokens"**
3. Click **"+ New Token"**
4. Configure the token:
   - **Name**: `vsce-publishing`
   - **Organization**: Select **"All accessible organizations"**
   - **Expiration**: Choose your preferred duration (90 days, 1 year, custom)
   - **Scopes**: Click **"Show all scopes"** at the bottom
   - Find and select **"Marketplace"** → Check **"Manage"**
5. Click **"Create"**
6. **IMPORTANT**: Copy the token immediately and save it securely (you won't see it again!)

---

## Step 3: Create a Publisher

1. Go to https://marketplace.visualstudio.com/manage
2. Sign in with the same Microsoft account
3. Click **"Create publisher"**
4. Fill in the details:
   - **ID**: Choose a unique publisher ID (e.g., `yourname` or `yourcompany`)
     - This will be part of your extension ID: `publisherid.gitbox`
   - **Name**: Your display name
   - **Email**: Your contact email
5. Click **"Create"**

---

## Step 4: Update package.json

Replace `"publisher": "your-publisher-name"` with your actual publisher ID:

```json
{
  "publisher": "yourpublisherid",
  ...
}
```

Also update the repository URLs:
```json
{
  "repository": {
    "type": "git",
    "url": "https://github.com/yourusername/gitbox.git"
  },
  "bugs": {
    "url": "https://github.com/yourusername/gitbox/issues"
  },
  "homepage": "https://github.com/yourusername/gitbox#readme",
  ...
}
```

---

## Step 5: Login to vsce

In your terminal, run:

```bash
vsce login your-publisher-id
```

Enter the Personal Access Token when prompted.

---

## Step 6: Package Your Extension

```bash
npm run compile
vsce package
```

This creates `gitbox-1.0.0.vsix`

---

## Step 7: Publish to Marketplace

```bash
vsce publish
```

Or publish the .vsix file manually:
1. Go to https://marketplace.visualstudio.com/manage
2. Click on your publisher
3. Click **"+ New extension"** → **"Visual Studio Code"**
4. Drag and drop your `.vsix` file

---

## Step 8: Verify Publication

1. Go to https://marketplace.visualstudio.com/
2. Search for "GitBox"
3. Your extension should appear!

Users can now install it by:
- Searching "GitBox" in VS Code Extensions (Ctrl+Shift+X)
- Or running: `code --install-extension yourpublisher.gitbox`

---

## Updating Your Extension

To publish updates:

1. Update the version in `package.json`:
   ```json
   "version": "1.0.1"
   ```

2. Update `CHANGELOG.md` with changes

3. Compile and publish:
   ```bash
   npm run compile
   vsce publish
   ```

   Or publish a specific version:
   ```bash
   vsce publish minor  # 1.0.0 → 1.1.0
   vsce publish patch  # 1.0.0 → 1.0.1
   vsce publish major  # 1.0.0 → 2.0.0
   ```

---

## Important Files Checklist

Before publishing, make sure you have:

- ✅ `README.md` - Clear description and usage instructions
- ✅ `CHANGELOG.md` - Version history
- ✅ `LICENSE` - License file (MIT recommended)
- ✅ `icon.png` - Extension icon (128x128 pixels minimum)
- ✅ `package.json` - Correct publisher, repository URLs
- ✅ Compiled code in `out/` directory

---

## Tips for Success

1. **Add screenshots/GIFs** to README.md showing the extension in action
2. **Add keywords** in package.json for better discoverability
3. **Test thoroughly** before publishing
4. **Respond to user feedback** and issues
5. **Keep your extension updated**

---

## Useful Commands

```bash
# Login
vsce login your-publisher-id

# Package without publishing
vsce package

# Publish
vsce publish

# Publish with version bump
vsce publish patch
vsce publish minor
vsce publish major

# Unpublish (use carefully!)
vsce unpublish your-publisher-id.gitbox
```

---

## Need Help?

- VS Code Publishing Guide: https://code.visualstudio.com/api/working-with-extensions/publishing-extension
- Azure DevOps: https://dev.azure.com
- Marketplace Management: https://marketplace.visualstudio.com/manage

Good luck with your publication! 🚀
