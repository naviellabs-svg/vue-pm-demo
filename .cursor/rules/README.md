# Dynamic Cursor Rules - How This Works

## Overview

This project uses **dynamic Cursor rules** that automatically extract patterns from completed lessons and organize them into reusable rule files. Rules grow and update as you complete lessons.

## The Workflow

1. **You create lessons** in `docs/` directory (e.g., `docs/1-project-setup.md`, `docs/2-basic-feature.md`)
2. **You complete the lesson** by following the steps
3. **You say "update rules"** to the AI assistant
4. **AI extracts patterns** from completed lesson files:
   - Code patterns and conventions
   - Architectural decisions
   - Best practices
   - File structure patterns
5. **AI updates rule files** in `.cursor/rules/` automatically
6. **Rules are ready** for use in future chats and projects

## Rule Organization

Rules are organized by category using descriptive prefixes:

- **project-setup-** = Foundational project setup guides
- **frontend-** = Frontend patterns (components, styling, frameworks)
- **backend-** = Backend patterns (API routes, databases, services)
- **architecture-** = Architecture patterns (structure, separation of concerns)
- **development-** = Development tools and workflows
- **deployment-** = Deployment patterns
- **testing-** = Testing patterns
- **domain-** = Domain-specific patterns

## Sharing Rules (Optional)

Rules are **dynamic and flexible** - you can:

- **Keep local**: Rules stay in `.cursor/rules/` for this project only
- **Push to GitHub**: Commit rules to share with other projects via GitHub Import
- **Reference**: Create a meta-rule that documents where rules come from
- **Copy**: Manually copy rules folder to new projects

**You decide later** whether to push to GitHub or just reference locally.

## Using Rules in New Projects

When starting a new project:

1. **GitHub Import** (if rules are on GitHub):
   - Cursor Settings → Rules → Add Rule → Remote Rule (GitHub)
   - Paste repository URL
   - Rules sync automatically

2. **Copy Rules**:
   - Copy `.cursor/rules/` folder to new project
   - Customize as needed

3. **Reference Rule**:
   - Create a meta-rule documenting where rules come from
   - Import specific rules as needed

## Benefits

- ✅ **Automatic**: Rules update as you learn
- ✅ **Organized**: Clear categorization makes rules easy to find
- ✅ **Reusable**: Use in new projects via GitHub Import or copy
- ✅ **Version-controlled**: Rules tracked in git
- ✅ **Team-friendly**: Share with collaborators easily
- ✅ **Flexible**: Decide later how to share (GitHub, copy, or reference)

## Rule Files

### Project Setup
- `project-setup-vue.md` - Complete Vue.js 3 + TypeScript project setup guide

### Frontend Patterns
- `frontend-vue-router.md` - Vue Router patterns, file-based routing, Suspense integration
- `frontend-vue-components.md` - Vue component patterns, defineModel, render functions
- `frontend-composables.md` - Composables patterns, batch data fetching
- `frontend-pinia-stores.md` - Pinia state management, caching, cache invalidation
- `frontend-ui-shadcn.md` - Shadcn UI components, TanStack Table, Iconify icons
- `frontend-error-handling.md` - Global error handling, error boundaries, environment-specific errors
- `frontend-authentication.md` - Supabase authentication, route protection, user profiles

### Backend Patterns
- `backend-supabase.md` - Supabase integration, migrations, seeding, queries

### Architecture Patterns
- `architecture-data-loading.md` - Data loading strategies, caching, stale-while-revalidate
