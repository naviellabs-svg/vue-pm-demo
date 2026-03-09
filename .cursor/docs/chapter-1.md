# Chapter 1: Ready, Set, Code!

## Lesson 1.3 - Environment Setup

> **Purpose:** Set up the development environment including Node.js, Chrome extensions, and browser configuration.

### Overview

This lesson covers installing Node.js, configuring Chrome as the default browser, and adding Vue.js DevTools extension for development.

---

### Step 1: Install Node.js

**Location:** Terminal

#### Tasks

- [ ] Install node.js
- [ ] `node -v` - Check version in terminal

---

### Step 2: Configure Chrome

**Location:** Chrome

#### Tasks

- [ ] Make Chrome default browser
- [ ] Add vue.js dev tools extension to chrome

---

## Lesson 1.4 - Create Vue Project

> **Purpose:** Initialize a new Vue.js project with TypeScript, Router, Pinia, ESLint, and Prettier.

### Overview

Create a new Vue.js project using the official Vue CLI with all recommended configurations for a modern Vue 3 application.

---

### Step 1: Create Project Directory

**Location:** Terminal

#### Tasks

- [ ] `mkdir masterclass` (iterm)
- [ ] `cd masterclass` (iterm)
- [ ] `npm create vue@latest` - https://vuejs.org/guide/quick-start.html
- [ ] Project name
- [ ] TypeScript
- [ ] Router
- [ ] Pinia
- [ ] ESLint
- [ ] Prettier
- [ ] `cd vuejs-masterclass-2024` (project dir)
- [ ] `npm install`

---

## Lesson 1.5 - VS Code Setup

> **Purpose:** Configure VS Code for Vue.js development with proper extensions.

### Overview

Set up VS Code with the Vue.js Official extension and configure code command for terminal access.

---

### Step 1: Install VS Code Extensions

**Location:** vscode

#### Tasks

- [ ] `command+shift+P`
- [ ] Type "install code" and select install in path
- [ ] `code .` (iTerm to open project)
- [ ] Install vue.js Official extension

---

## Lesson 1.6 - Update Dependencies

> **Purpose:** Update project dependencies to latest versions using npm-check-updates.

### Overview

Check Vue School video on ESLint and ESLint 9, then update all dependencies to their latest versions.

---

### Step 1: Update Dependencies

**Location:** Terminal/vscode

#### Tasks

- [ ] Check video on eslint and eslint 9 (vueschool)
- [ ] `npm install -g npm-check-updates`
- [ ] Delete package.lock file
- [ ] Delete node_modules
- [ ] `npm install` (terminal)

---

## Lesson 1.7 - Prettier Configuration

> **Purpose:** Install and configure Prettier extension for code formatting.

### Overview

Add Prettier extension to VS Code for consistent code formatting.

---

### Step 1: Install Prettier

**Location:** vscode

#### Tasks

- [ ] Extension prettier

---

## Lesson 1.8 - Git Setup

> **Purpose:** Initialize Git repository and configure SSH keys for GitHub integration.

### Overview

Set up Git version control, configure user credentials, create SSH keys, and push initial commit to GitHub.

---

### Step 1: Git Configuration

**Location:** Terminal

#### Tasks

- [ ] `git --version` (iTerm)
- [ ] `git config --global user.name "Chris Conradie"` (iTerm)
- [ ] `git config --global user.email "naviel.labs@gmail.com"` (iTerm)
- [ ] `git init -b main` - (in your project's root directory) - Initializes a new Git repository in your project directory and creates a new "main" branch.
- [ ] `git add .` - Adds all modified files in your project to the staging area.
- [ ] `git commit -m "init"` - Creates a commit with a descriptive message ("init" in this example).

---

### Step 2: SSH Key Setup

**Location:** Terminal

#### Tasks

- [ ] `ls -al ~/.ssh` - check for ssh key
- [ ] `ssh-keygen -t ed25519 -C "naviel.labs@gmail.com"` - add key if missing
- [ ] `pbcopy < ~/.ssh/id_ed25519.pub` - Copies the generated SSH key to your clipboard.
- [ ] GitHub setting create new key name it and paste key
- [ ] Create new repository
- [ ] `git remote add origin <URL>` (sshid)
- [ ] `git push -u origin main`

---

### Step 3: Git Workflow

**Location:** Terminal

#### Tasks

- [ ] `git add -A` - Adds all modified files to the staging area.
- [ ] `git commit -m "message"` - Creates a commit with a descriptive message.
- [ ] `git push origin main` - Pushes your local commits to the remote "main" branch
