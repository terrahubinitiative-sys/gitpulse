<div align="center">

# ⚡ GitPulse
### **Lightning-Fast Terminal Git Workspace Inspector**

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT)
[![Node.js Version](https://img.shields.io/badge/node-%3E%3D14.0.0-green.svg)](https://nodejs.org)
[![Platform](https://img.shields.io/badge/platform-Linux%20%7C%20macOS%20%7C%20Windows%20%7C%20Termux-lightgrey)](https://github.com)

*Scan, inspect, and monitor multiple local Git repositories instantly from your terminal.*

</div>

---

## 🚀 Overview

**GitPulse** is a lightweight, zero-dependency CLI utility designed for developers managing multiple local Git repositories. Instead of manually `cd`-ing into every folder to check for uncommitted changes or unpushed commits, GitPulse scans your workspace recursively and renders a clear, color-coded health dashboard in seconds.

## ✨ Features

* **Recursive Workspace Scanning:** Automatically detects all Git repositories within any target directory.
* **Instant Health Status:** Flags uncommitted changes, clean workspaces, and unpushed commits at a glance.
* **Smart Terminal Formatting:** Strips ANSI constraints to maintain flawless table alignment across standard terminals and mobile environments like Termux.
* **Custom Path Support:** Inspect any directory on your filesystem instantly.
* **Lightweight & Fast:** Built with pure Node.js using core modules (`fs`, `path`, `child_process`) with zero external runtime bloat.

---

## 📦 Installation

### Global Installation (Local Link)
Clone or download this repository, then link it globally:

```bash
git clone [https://github.com/terrahubinitiative-sys/gitpulse.git](https://github.com/terrahubinitiative-sys/gitpulse.git)
cd git-pulse
npm link
