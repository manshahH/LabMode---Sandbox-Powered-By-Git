# LabMode - Testing Instructions for Friends 🧪

## 📦 How to Install the Extension

### Step 1: Download the Extension

Get the `labmode-1.0.0.vsix` file (I'll send it to you).

### Step 2: Install in VS Code

**Method 1: Command Line (Easiest)**
```bash
code --install-extension labmode-1.0.0.vsix
```

**Method 2: VS Code UI**
1. Open VS Code
2. Press `Ctrl+Shift+X` (Extensions panel)
3. Click the `...` menu (three dots) at the top right
4. Select **"Install from VSIX..."**
5. Browse and select `labmode-1.0.0.vsix`
6. Click **"Reload"** when prompted

---

## 🧪 How to Test LabMode

### Step 1: Setup a Test Repository

Create a test git repository:

```bash
# Create test folder
cd ~
mkdir labmode-test
cd labmode-test

# Initialize git
git init

# Create initial files
echo "# Test Project" > README.md
echo "console.log('hello');" > test.js
git add .
git commit -m "Initial commit"

# Open in VS Code
code .
```

---

### Step 2: Test "Enter Lab Mode"

1. Look at the **bottom status bar** (blue bar at the bottom)
2. You should see: **🧪 Enter Lab Mode** button on the left
3. Click **🧪 Enter Lab Mode**
4. You should see a notification: `🧪 Lab Mode entered on branch labmode/lab-xxxxx!`
5. The button changes to: **🗑️ Discard Lab** and **✅ Keep Lab**

---

### Step 3: Test Making Changes

Now you're in a safe lab environment! Try:

**A. Modify existing file:**
```bash
# Edit test.js
echo "console.log('testing lab mode');" >> test.js
```

**B. Create new files:**
```bash
echo "This is a new file" > new_file.txt
echo "Experiment code" > experiment.js
```

**C. Create new directory:**
```bash
mkdir new_feature
echo "Feature code" > new_feature/feature.js
```

---

### Step 4: Test "Discard Lab" ⚠️

**This tests if everything gets deleted properly!**

1. Click **🗑️ Discard Lab** button
2. You should see: `🗑️ Lab 'labmode/lab-xxxxx' discarded. All changes removed!`
3. **CHECK THESE:**
   - ✅ `test.js` should be back to original content
   - ✅ `new_file.txt` should be **GONE**
   - ✅ `experiment.js` should be **GONE**
   - ✅ `new_feature/` directory should be **GONE**
   - ✅ Button returns to **🧪 Enter Lab Mode**

Run this to verify cleanup:
```bash
ls -la
git status  # Should say "working tree clean"
```

---

### Step 5: Test "Keep Lab" ✅

**This tests if changes get saved properly!**

1. Click **🧪 Enter Lab Mode** again
2. Make some changes:
   ```bash
   echo "Successful experiment!" > success.txt
   echo "console.log('kept this');" >> test.js
   ```
3. Click **✅ Keep Lab** button
4. Enter commit message: `"test: successfully kept lab changes"`
5. Press Enter
6. You should see: `✅ Lab changes from 'labmode/lab-xxxxx' merged into 'master'!`
7. **CHECK THESE:**
   - ✅ Your changes are still there!
   - ✅ `success.txt` exists
   - ✅ Changes to `test.js` are saved
   - ✅ Button returns to **🧪 Enter Lab Mode**

Verify with:
```bash
git log --oneline  # Should see your commit!
cat test.js        # Should have your changes
```

---

## 🎯 What to Test & Report

### ✅ Checklist for Testing:

```
☐ Extension installs successfully
☐ Button "🧪 Enter Lab Mode" appears in status bar
☐ Can enter lab mode
☐ Can make changes (modify, add, delete files)
☐ Discard removes ALL changes (including new files)
☐ Keep saves changes and merges to main branch
☐ Can do multiple cycles (Enter → Discard → Enter → Keep)
☐ No leftover branches (check with: git branch)
☐ No error messages appear
☐ UI buttons switch correctly
```

### 🐛 What to Report:

If you find issues, please tell me:

1. **What you did** - Step by step
2. **What happened** - The actual result
3. **What you expected** - What should have happened
4. **Error messages** - Any error notifications or console errors
5. **Screenshots** - If possible

**To see detailed logs:**
- Press `Ctrl+Shift+U` (Output panel)
- Select "LabMode" from dropdown
- Share any error messages you see

---

## 🚀 Advanced Testing (Optional)

### Test Edge Cases:

1. **Test with uncommitted changes:**
   - Make changes WITHOUT committing
   - Click Enter Lab Mode
   - Your changes should carry over to the lab

2. **Test canceling:**
   - Enter Lab Mode
   - Make changes
   - Click Keep Lab
   - Press `Esc` in the commit message box
   - Should stay in lab mode (not commit)

3. **Test on different branch:**
   - Create a branch: `git checkout -b develop`
   - Test Enter/Discard/Keep from this branch
   - Should return to `develop`, not `master`

4. **Test with special characters:**
   - When clicking Keep Lab
   - Try commit message: `test "quotes" and $pecial chars`
   - Should handle it safely

---

## 🎉 Thanks for Testing!

Your feedback is super valuable! Let me know:
- ✅ What works great
- 🐛 What doesn't work
- 💡 Ideas for improvements
- ❓ Anything confusing

---

**Have fun experimenting with LabMode!** 🧪
