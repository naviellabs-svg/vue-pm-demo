# Git workflow instructions

**Use this as the canonical reference for committing work in this repo.** When the user asks to commit, push, or create a branch for a lesson, follow these steps and use these commands as given.

---

## Branch naming

- Branch name pattern: `chapter-#-###` (e.g. `chapter-8-113`).
- The user will specify the chapter and lesson number (e.g. "chapter 8 lesson 113").

---

## Commands (use as-is)

```bash
git add -A
git checkout -b "chapter-#-###"
```
Example branch name: `chapter-8-113`

```bash
git commit -m "name of lesson as in masterclass notes"
git push origin chapter-#-###
```

Use the exact lesson name from the masterclass notes for the commit message.
