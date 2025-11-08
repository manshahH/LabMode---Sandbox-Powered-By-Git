import * as vscode from 'vscode';
import { exec } from 'child_process';
import { promisify } from 'util';

// Promisify exec for easier async/await usage
const execAsync = promisify(exec);

// Extension-level state variables
let originalBranch: string | undefined;
let labBranch: string | undefined;

/**
 * Helper function to execute git commands in the workspace
 * @param command The git command to execute
 * @returns Promise with stdout and stderr
 */
async function executeGitCommand(command: string): Promise<{ stdout: string; stderr: string }> {
    const workspaceFolder = vscode.workspace.workspaceFolders?.[0];
    
    if (!workspaceFolder) {
        throw new Error('No workspace folder found. Please open a folder first.');
    }

    const cwd = workspaceFolder.uri.fsPath;
    
    try {
        const { stdout, stderr } = await execAsync(command, { cwd });
        return { stdout: stdout.trim(), stderr: stderr.trim() };
    } catch (error: any) {
        // If exec throws, the error object contains stdout, stderr, and code
        throw new Error(error.stderr || error.message || 'Unknown git error');
    }
}

/**
 * Safely escape a string for use in shell commands
 * Prevents command injection attacks
 */
function escapeShellArg(arg: string): string {
    // Replace backslashes and double quotes to prevent injection
    return arg.replace(/\\/g, '\\\\').replace(/"/g, '\\"').replace(/\$/g, '\\$').replace(/`/g, '\\`');
}

/**
 * Command: Enter Lab Mode
 * Creates a new lab branch with all current changes
 */
async function enterLabMode() {
    try {
        // Step 1: Get the current branch name
        const { stdout: currentBranch } = await executeGitCommand('git rev-parse --abbrev-ref HEAD');
        originalBranch = currentBranch;
        
        console.log(`LabMode: Original branch is ${originalBranch}`);

        // Step 2: Stash all current changes
        await executeGitCommand('git stash push -m "LabMode-Temp-Save"');
        console.log('LabMode: Changes stashed');

        // Step 3: Create a unique lab branch name
        labBranch = `labmode/lab-${Date.now()}`;
        console.log(`LabMode: Creating lab branch ${labBranch}`);

        // Step 4: Create and checkout the new lab branch
        await executeGitCommand(`git checkout -b ${labBranch}`);
        console.log(`LabMode: Checked out to ${labBranch}`);

        // Step 5: Apply the stashed changes
        try {
            await executeGitCommand('git stash pop');
            console.log('LabMode: Stash applied');
        } catch (error: any) {
            // If stash pop fails (e.g., conflicts), we still want to continue
            // The user will see the conflicts in their editor
            console.warn('LabMode: Stash pop had conflicts, but continuing', error.message);
        }

        // Step 6: Update the VS Code context to "In Lab" state
        await vscode.commands.executeCommand('setContext', 'labmode.inLab', true);
        console.log('LabMode: Context set to inLab = true');

        // Step 7: Update the UI and notify the user
        updateStatusBar();
        vscode.window.showInformationMessage(`🧪 Lab Mode entered on branch '${labBranch}'!`);

    } catch (error: any) {
        // Critical: If any step fails, do NOT set the state to inLab
        console.error('LabMode: Error entering lab mode', error);
        vscode.window.showErrorMessage(`LabMode Error: ${error.message}`);
        
        // Clean up state variables
        originalBranch = undefined;
        labBranch = undefined;
    }
}

/**
 * Command: Discard Lab
 * Discards all changes and deletes the lab branch
 * CRITICAL: Also removes untracked files (new files created in lab)
 */
async function discardLab() {
    try {
        if (!originalBranch || !labBranch) {
            throw new Error('No active lab found. State may be corrupted.');
        }

        console.log(`LabMode: Discarding lab ${labBranch}, returning to ${originalBranch}`);

        // Step 1: Force checkout to the original branch (discards all tracked file changes)
        await executeGitCommand(`git checkout ${originalBranch} -f`);
        console.log(`LabMode: Checked out to ${originalBranch}`);

        // Step 2: Clean up untracked files and directories (the critical fix!)
        // This removes any new files/folders created in the lab that git isn't tracking
        try {
            await executeGitCommand('git clean -fd');
            console.log('LabMode: Cleaned up untracked files and directories');
        } catch (error: any) {
            // If clean fails, log but continue - the checkout already happened
            console.warn('LabMode: git clean warning (may be no untracked files):', error.message);
        }

        // Step 3: Delete the lab branch
        await executeGitCommand(`git branch -D ${labBranch}`);
        console.log(`LabMode: Deleted branch ${labBranch}`);

        // Step 4: Update the VS Code context to "Default" state
        await vscode.commands.executeCommand('setContext', 'labmode.inLab', false);
        console.log('LabMode: Context set to inLab = false');

        // Step 5: Clear state variables
        const deletedBranch = labBranch;
        originalBranch = undefined;
        labBranch = undefined;

        // Step 6: Update UI and notify user
        updateStatusBar();
        vscode.window.showInformationMessage(`🗑️ Lab '${deletedBranch}' discarded. All changes removed!`);

    } catch (error: any) {
        console.error('LabMode: Error discarding lab', error);
        vscode.window.showErrorMessage(`LabMode Error: ${error.message}`);
    }
}

/**
 * Command: Keep Lab
 * Commits changes and merges them back into the original branch
 */
async function keepLab() {
    try {
        if (!originalBranch || !labBranch) {
            throw new Error('No active lab found. State may be corrupted.');
        }

        // Step 1: Get commit message from user
        const commitMessage = await vscode.window.showInputBox({
            prompt: 'Enter a commit message for your lab changes',
            placeHolder: 'e.g., Implemented new feature X',
            ignoreFocusOut: true
        });

        // Step 2: Check if user cancelled
        if (!commitMessage) {
            console.log('LabMode: User cancelled commit message input');
            return; // User cancelled, do nothing
        }

        console.log(`LabMode: Keeping lab ${labBranch}, merging to ${originalBranch}`);

        // Step 3: Stage all changes
        await executeGitCommand('git add .');
        console.log('LabMode: Changes staged');

        // Step 4: Commit the changes (sanitized to prevent command injection)
        const sanitizedMessage = escapeShellArg(commitMessage);
        await executeGitCommand(`git commit -m "${sanitizedMessage}"`);
        console.log('LabMode: Changes committed');

        // Step 5: Checkout to the original branch
        await executeGitCommand(`git checkout ${originalBranch}`);
        console.log(`LabMode: Checked out to ${originalBranch}`);

        // Step 6: Merge the lab branch
        await executeGitCommand(`git merge ${labBranch}`);
        console.log(`LabMode: Merged ${labBranch} into ${originalBranch}`);

        // Step 7: Delete the lab branch (safe delete since it's merged)
        await executeGitCommand(`git branch -d ${labBranch}`);
        console.log(`LabMode: Deleted branch ${labBranch}`);

        // Step 8: Update the VS Code context to "Default" state
        await vscode.commands.executeCommand('setContext', 'labmode.inLab', false);
        console.log('LabMode: Context set to inLab = false');

        // Step 9: Clear state variables
        const mergedBranch = labBranch;
        const targetBranch = originalBranch;
        originalBranch = undefined;
        labBranch = undefined;

        // Step 10: Update UI and notify user
        updateStatusBar();
        vscode.window.showInformationMessage(`✅ Lab changes from '${mergedBranch}' merged into '${targetBranch}'!`);

    } catch (error: any) {
        console.error('LabMode: Error keeping lab', error);
        vscode.window.showErrorMessage(`LabMode Error: ${error.message}`);
    }
}

// Status Bar Items
let enterLabButton: vscode.StatusBarItem;
let discardLabButton: vscode.StatusBarItem;
let keepLabButton: vscode.StatusBarItem;

/**
 * Creates and configures all status bar buttons
 */
function createStatusBarButtons(context: vscode.ExtensionContext) {
    // Button 1: Enter Lab Mode (visible when NOT in lab)
    enterLabButton = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Left, 100);
    enterLabButton.command = 'labmode.enterLabMode';
    enterLabButton.text = '$(beaker) Enter Lab Mode';
    enterLabButton.tooltip = 'Create a temporary lab branch to test changes';
    context.subscriptions.push(enterLabButton);

    // Button 2: Discard Lab (visible when IN lab)
    discardLabButton = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Left, 100);
    discardLabButton.command = 'labmode.discardLab';
    discardLabButton.text = '$(trash) Discard Lab';
    discardLabButton.tooltip = 'Discard all changes and delete this lab';
    context.subscriptions.push(discardLabButton);

    // Button 3: Keep Lab (visible when IN lab)
    keepLabButton = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Left, 99);
    keepLabButton.command = 'labmode.keepLab';
    keepLabButton.text = '$(check) Keep Lab';
    keepLabButton.tooltip = 'Commit and merge changes into your main branch';
    context.subscriptions.push(keepLabButton);

    // Initialize the UI
    updateStatusBar();
}

/**
 * Updates the visibility of status bar buttons based on current state
 */
function updateStatusBar() {
    if (originalBranch && labBranch) {
        // In Lab state
        enterLabButton.hide();
        discardLabButton.show();
        keepLabButton.show();
    } else {
        // Default state
        enterLabButton.show();
        discardLabButton.hide();
        keepLabButton.hide();
    }
}

/**
 * Extension activation function
 * Called when the extension is first activated
 */
export function activate(context: vscode.ExtensionContext) {
    console.log('LabMode extension is now active!');

    // Initialize the context state to "not in lab"
    vscode.commands.executeCommand('setContext', 'labmode.inLab', false);

    // Register all three commands
    const enterCommand = vscode.commands.registerCommand('labmode.enterLabMode', enterLabMode);
    const discardCommand = vscode.commands.registerCommand('labmode.discardLab', discardLab);
    const keepCommand = vscode.commands.registerCommand('labmode.keepLab', keepLab);

    context.subscriptions.push(enterCommand, discardCommand, keepCommand);

    // Create status bar buttons
    createStatusBarButtons(context);

    console.log('LabMode: All commands and UI elements registered');
}

/**
 * Extension deactivation function
 * Called when the extension is deactivated
 */
export function deactivate() {
    // Clean up if needed
    console.log('LabMode extension is now deactivated');
}
