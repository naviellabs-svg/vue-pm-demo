# Project Setup: Vue.js 3 + TypeScript

## Overview

Complete guide for setting up a new Vue.js 3 project with TypeScript, Vue Router, Pinia, ESLint, Prettier, and modern development tooling. This rule provides a step-by-step process to bootstrap a production-ready Vue.js application.

## When to Use

- ✅ Starting a new Vue.js 3 project
- ✅ Setting up development environment
- ✅ Configuring TypeScript with Vue
- ✅ Initializing Git repository
- ✅ Setting up code quality tools

## Project Initialization

### Step 1: Create Vue Project

```bash
# Create project directory
mkdir project-name
cd project-name

# Initialize Vue project with CLI
npm create vue@latest

# Select options:
# ✓ TypeScript
# ✓ Router
# ✓ Pinia
# ✓ ESLint
# ✓ Prettier

# Install dependencies
cd vuejs-project-name
npm install
```

### Step 2: Verify Setup

```bash
# Start development server
npm run dev

# Check for errors in console
# Verify application loads at http://localhost:5173
```

## Development Environment Setup

### VS Code Configuration

**Required Extensions:**
- Vue - Official (Volar)
- Prettier - Code formatter
- ESLint

**VS Code Setup:**
1. Open command palette (`Cmd+Shift+P` / `Ctrl+Shift+P`)
2. Type "Install 'code' command in PATH"
3. Select the option to install
4. Verify: `code .` opens project in VS Code

### Git Configuration

```bash
# Configure Git user
git config --global user.name "Your Name"
git config --global user.email "your.email@example.com"

# Initialize repository
git init -b main

# Create .gitignore (already included in Vue template)
# Add .env to .gitignore if not present

# Initial commit
git add .
git commit -m "Initial commit"
```

### SSH Key Setup (for GitHub)

```bash
# Check for existing SSH key
ls -al ~/.ssh

# Generate new SSH key if needed
ssh-keygen -t ed25519 -C "your.email@example.com"

# Copy public key to clipboard
pbcopy < ~/.ssh/id_ed25519.pub  # macOS
# or
cat ~/.ssh/id_ed25519.pub       # Linux/Windows

# Add key to GitHub: Settings > SSH and GPG keys > New SSH key
```

## Project Structure

### Recommended Structure

```
project-root/
├── src/
│   ├── assets/          # Static assets (images, fonts, etc.)
│   ├── components/      # Reusable Vue components
│   ├── composables/    # Vue composables
│   ├── lib/            # Third-party library configs
│   ├── pages/          # File-based routes (unplugin-vue-router)
│   ├── stores/         # Pinia stores
│   ├── types/          # TypeScript type definitions
│   ├── utils/          # Utility functions
│   ├── App.vue         # Root component
│   └── main.ts         # Application entry point
├── .env                # Environment variables (gitignored)
├── .gitignore          # Git ignore rules
├── package.json        # Dependencies and scripts
├── tsconfig.json       # TypeScript configuration
└── vite.config.ts      # Vite configuration
```

### Clean Up Default Files

After project creation:

1. **Clear default assets:**
   - Remove default logo/images from `src/assets/`

2. **Clear default components:**
   - Remove example components from `src/components/`

3. **Clear default routes:**
   - Remove example routes from `router/index.ts`
   - Remove example views/pages

4. **Clear default stores:**
   - Remove example Pinia stores

5. **Simplify App.vue:**
   ```vue
   <script setup lang="ts">
   </script>

   <template>
     <main>
       <h1>Welcome</h1>
     </main>
   </template>
   ```

6. **Clean main.ts:**
   - Remove default CSS imports if not needed

## Dependency Management

### Update Dependencies

```bash
# Install npm-check-updates globally
npm install -g npm-check-updates

# Check for updates
ncu

# Update package.json (review changes)
ncu -u

# Clean install
rm -rf node_modules package-lock.json
npm install
```

### Key Dependencies

**Core:**
- `vue` - Vue.js framework
- `vue-router` - Official router
- `pinia` - State management

**Development:**
- `typescript` - TypeScript support
- `@vitejs/plugin-vue` - Vite Vue plugin
- `eslint` - Linting
- `prettier` - Code formatting

## Environment Variables

### Setup .env File

Create `.env` in project root:

```env
VITE_API_URL=your_api_url
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_KEY=your_supabase_key
```

### Update .gitignore

Ensure `.env` is in `.gitignore`:

```
# Environment variables
.env
.env.local
.env.*.local
```

## Best Practices

### Git Workflow

1. **Create feature branches:**
   ```bash
   git checkout -b feature/feature-name
   ```

2. **Commit frequently:**
   ```bash
   git add .
   git commit -m "Descriptive commit message"
   ```

3. **Push to remote:**
   ```bash
   git push origin feature/feature-name
   ```

### Code Quality

1. **Run ESLint before committing:**
   ```bash
   npm run lint
   ```

2. **Format code with Prettier:**
   ```bash
   npm run format
   ```

3. **Type check:**
   ```bash
   npm run type-check
   ```

### Development Server

- **Start dev server:** `npm run dev`
- **Build for production:** `npm run build`
- **Preview production build:** `npm run preview`

## Common Gotchas

1. **Node Version:** Ensure Node.js 18+ is installed
2. **Port Conflicts:** Change port in `vite.config.ts` if 5173 is in use
3. **TypeScript Errors:** Run `npm run type-check` to identify issues
4. **ESLint Configuration:** May need updates for Vue 3 + TypeScript
5. **Path Aliases:** Use `@/` for `src/` directory (configured in `tsconfig.json`)

## Next Steps

After initial setup:

1. Configure routing (see `frontend-vue-router.md`)
2. Set up state management (see `frontend-pinia-stores.md`)
3. Configure backend integration (see `backend-supabase.md`)
4. Set up component patterns (see `frontend-vue-components.md`)

## References

- [Vue.js Documentation](https://vuejs.org/)
- [Vue Router Documentation](https://router.vuejs.org/)
- [Pinia Documentation](https://pinia.vuejs.org/)
- [Vite Documentation](https://vitejs.dev/)
- [TypeScript Documentation](https://www.typescriptlang.org/)
