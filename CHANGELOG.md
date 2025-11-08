# Change Log

All notable changes to the "LabMode" extension will be documented in this file.

## [1.0.0] - 2025-11-06

### Added
- Initial release of LabMode
- Enter Lab Mode: Create temporary lab branches for safe experimentation
- Discard Lab: Quickly discard all experimental changes **including untracked files**
- Keep Lab: Commit and merge successful experiments back to main branch
- Status bar buttons for easy access
- No internet or GitHub login required - works entirely with local git commands
- Comprehensive error handling and user feedback

### Security
- ✅ **Command injection vulnerability fixed**: Commit messages are now properly sanitized
- ✅ Input validation for all user-supplied data
- ✅ All git commands scoped to workspace directory
- ✅ No external network access
- ✅ No credential storage required

### Features
- State-based workflow (Default vs In Lab)
- Automatic branch creation with timestamps
- Git stash integration for seamless workflow
- Visual status indicators in VS Code status bar
- **Proper cleanup of untracked files** using `git clean -fd` when discarding lab
- Handles both tracked file changes and new file additions
