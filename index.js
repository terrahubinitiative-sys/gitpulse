#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// ANSI escape codes for terminal styling
const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  red: '\x1b[31m',
  cyan: '\x1b[36m',
  dim: '\x1b[2m'
};

// Helper: Strip ANSI color codes to accurately measure visible text length
function visibleLength(str) {
  return str.replace(/\x1b\[[0-9;]*m/g, '').length;
}

// Helper: Pad string correctly taking invisible ANSI characters into account
function padRight(str, targetWidth) {
  const visibleLen = visibleLength(str);
  const paddingNeeded = Math.max(0, targetWidth - visibleLen);
  return str + ' '.repeat(paddingNeeded);
}

// Helper: Truncate long strings with ellipsis
function truncate(str, maxLength) {
  if (str.length <= maxLength) return str;
  return str.slice(0, maxLength - 3) + '...';
}

function printBanner() {
  console.log(`\n${colors.bright}${colors.cyan}=========================================`);
  console.log(`           ⚡ GITPULSE v1.0.0            `);
  console.log(`   Terminal Git Workspace Inspector      `);
  console.log(`=========================================${colors.reset}\n`);
}

// Check if a directory is a Git repository
function isGitRepo(dir) {
  try {
    return fs.existsSync(path.join(dir, '.git'));
  } catch (e) {
    return false;
  }
}

// Inspect Git repository status
function getRepoInfo(repoPath) {
  try {
    const branchCmd = execSync('git symbolic-ref --short HEAD 2>/dev/null || git rev-parse --short HEAD 2>/dev/null', {
      cwd: repoPath,
      encoding: 'utf8'
    }).trim();

    const statusCmd = execSync('git status --porcelain', {
      cwd: repoPath,
      encoding: 'utf8'
    }).trim();

    const hasChanges = statusCmd.length > 0;
    
    let unpushed = false;
    try {
      const unpushedCount = execSync('git log @{u}..HEAD --oneline 2>/dev/null', {
        cwd: repoPath,
        encoding: 'utf8'
      }).trim();
      unpushed = unpushedCount.length > 0;
    } catch (e) {
      // No upstream remote tracked
    }

    return {
      branch: branchCmd || 'detached',
      hasChanges,
      unpushed
    };
  } catch (e) {
    return null;
  }
}

// Scan target directory for Git repositories
function scanWorkspaces(targetDir) {
  const resolvedPath = path.resolve(targetDir);
  console.log(`${colors.dim}Scanning directory: ${resolvedPath}${colors.reset}\n`);
  
  let items;
  try {
    items = fs.readdirSync(resolvedPath, { withFileTypes: true });
  } catch (e) {
    console.error(`${colors.red}Error reading directory: ${e.message}${colors.reset}`);
    return;
  }

  let repos = [];

  // Check if target directory itself is a Git repository
  if (isGitRepo(resolvedPath)) {
    repos.push({ name: path.basename(resolvedPath), fullPath: resolvedPath });
  }

  // Check subdirectories
  const subDirs = items.filter(item => item.isDirectory() && !item.name.startsWith('.'));
  for (const sub of subDirs) {
    const fullPath = path.join(resolvedPath, sub.name);
    if (isGitRepo(fullPath)) {
      repos.push({ name: sub.name, fullPath });
    }
  }

  if (repos.length === 0) {
    console.log(`${colors.yellow}No Git repositories found in this path.${colors.reset}\n`);
    return;
  }

  // Set column widths suitable for narrow mobile/terminal screens
  const repoColWidth = 18;
  const branchColWidth = 12;

  console.log(`${colors.bright}Found ${repos.length} repository/repositories:\n${colors.reset}`);
  
  const headerRepo = padRight('REPOSITORY', repoColWidth);
  const headerBranch = padRight('BRANCH', branchColWidth);
  console.log(`${headerRepo} | ${headerBranch} | STATUS`);
  console.log(`${'-'.repeat(repoColWidth)}-+-${'-'.repeat(branchColWidth)}-+-${'-'.repeat(16)}`);

  let dirtyCount = 0;

  for (const repo of repos) {
    const info = getRepoInfo(repo.fullPath);
    if (!info) continue;

    let statusText = '';
    if (info.hasChanges) {
      statusText += `${colors.red}● Uncommitted${colors.reset}`;
      dirtyCount++;
    } else {
      statusText += `${colors.green}✔ Clean${colors.reset}`;
    }

    if (info.unpushed) {
      statusText += ` ${colors.yellow}↑ Unpushed${colors.reset}`;
    }

    const repoNameDisplay = padRight(truncate(repo.name, repoColWidth), repoColWidth);
    const branchDisplay = padRight(truncate(info.branch, branchColWidth), branchColWidth);

    console.log(`${repoNameDisplay} | ${branchDisplay} | ${statusText}`);
  }

  console.log(`\n${colors.cyan}Summary: ${repos.length} scanned, ${dirtyCount} require attention.${colors.reset}\n`);
}

// Target directory argument (defaults to current directory)
const targetPath = process.argv[2] || process.cwd();

printBanner();
scanWorkspaces(targetPath);
