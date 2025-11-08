# LabMode - Sandbox Powered by Git 🧪

**LabMode** is a VS Code extension that provides a **"lab mode"** for developers to safely experiment with code changes in an isolated environment. Test risky changes without fear!

![Version](https://img.shields.io/badge/version-1.0.0-blue)
![License](https://img.shields.io/badge/license-MIT-green)

## ✨ Features

### 🧪 **Enter Lab Mode**
Create a temporary lab branch to test changes without affecting your main branch. All your current work is safely preserved.

### 🗑️ **Discard Lab**
Changed your mind? Discard **ALL** experimental changes with one click and return to your original state. This includes:
- ✅ Modified files (reverted to original)
- ✅ New files you created (completely removed)
- ✅ New directories (completely removed)

**True cleanup** - no ghost files left behind!

### ✅ **Keep Lab**
Love what you built? Commit your changes and merge them back into your main branch seamlessly.

## 🎯 How It Works

LabMode leverages local git commands (stash and branching) to create an isolated environment for experimentation:

1. **Enter Lab Mode** → Stashes your current changes, creates a unique branch (`labmode/lab-{timestamp}`), and applies your changes there
2. **Make Changes** → Experiment freely in your isolated lab
3. **Choose Your Path**:
   - **Discard** → Returns to your original branch, deletes the lab, **and removes all untracked files** (true cleanup!)
   - **Keep** → Commits your changes (including new files), merges them back to the original branch, and cleans up

## 📖 Usage

### Step 1: Enter Lab Mode
Click the **🧪 Enter Lab Mode** button in the status bar (bottom of VS Code)

### Step 2: Experiment
Make your changes, try new ideas, break things - it's all safe in your lab!

### Step 3: Decide
- **🗑️ Discard Lab** → Throw away all changes and go back
- **✅ Keep Lab** → Enter a commit message and merge your changes

## 🎥 Demo

```
Initial State: [🧪 Enter Lab Mode]
      ↓ (click)
In Lab: [🗑️ Discard Lab] [✅ Keep Lab]
      ↓ (make changes & click Keep)
Back to Start: [🧪 Enter Lab Mode]
```

## 📋 Requirements

- **Git** must be installed and available in your PATH
- Your workspace must be a **git repository** (run `git init` if needed)

## 🔐 Privacy First

- ✅ Works **100% offline** with local git commands
- ✅ **No GitHub login** required
- ✅ **No internet connection** needed
- ✅ All data stays on your machine

## 💡 Use Cases

- 🧪 **Experiment with risky refactoring**
- 🐛 **Try different bug fix approaches**
- 🎨 **Test UI changes**
- 📚 **Learn new coding patterns**
- 🔬 **Prototype features quickly**

## ⚙️ Extension Settings

This extension does not require any configuration. It works out of the box!

## 🐛 Known Issues

- Merge conflicts during "Keep Sandbox" will require manual resolution
- The extension requires an initialized git repository to function

## 📝 Release Notes

### 1.0.0 (Initial Release)

- ✨ Start Sandbox: Create isolated experiment branches
- 🗑️ Discard Sandbox: Safely discard changes
- ✅ Keep Sandbox: Commit and merge successful experiments
- 📊 Status bar integration with visual indicators
- 🛡️ Comprehensive error handling

## 🤝 Contributing

Found a bug or have a feature request? Please open an issue on our [GitHub repository](https://github.com/manshahH/LabMode---Sandbox-Powered-By-Git).

## 📄 License

This extension is licensed under the [MIT License](LICENSE).

---

**Enjoy safe experimentation with GitBox!** 🎉

If you find this extension helpful, please consider giving it a ⭐ rating!
