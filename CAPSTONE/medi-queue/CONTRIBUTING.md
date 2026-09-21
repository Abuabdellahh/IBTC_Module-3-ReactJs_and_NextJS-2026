# Contributing to MediQueue

Thank you for contributing! Please follow these guidelines to keep the codebase clean and the Git history readable.

---

## Branch Naming

```
main            ← stable, always deployable — never commit directly
dev             ← integration branch — merge features here first
feature/<name>  ← new feature      e.g. feature/doctor-filter
fix/<name>      ← bug fix          e.g. fix/booking-slot-reset
chore/<name>    ← tooling/config   e.g. chore/update-tailwind
docs/<name>     ← documentation    e.g. docs/add-screenshots
```

---

## Commit Message Convention

We follow [Conventional Commits](https://www.conventionalcommits.org/).

```
<type>(<scope>): <short imperative description>
```

### Types

| Type | When to use |
|---|---|
| `feat` | A new feature |
| `fix` | A bug fix |
| `chore` | Build process, tooling, dependency updates |
| `docs` | Documentation only |
| `style` | Formatting, missing semicolons — no logic change |
| `refactor` | Code restructure — no feature or bug change |
| `perf` | Performance improvement |
| `test` | Adding or fixing tests |

### Examples

```bash
feat(doctors): add specialty filter chips
fix(booking): reset selected slot when doctor changes
chore(deps): upgrade react-router-dom to 7.18.3
docs(readme): add docker usage section
style(navbar): align mobile menu items
refactor(layout): extract Footer into separate component
```

### Rules
- Use the **imperative mood**: "add filter" not "added filter"
- Keep the subject line under **72 characters**
- No period at the end of the subject line
- Commit **one logical change** per commit — don't bundle unrelated changes

---

## Pull Request Checklist

Before opening a PR, make sure:

- [ ] Branch is up to date with `dev`
- [ ] `npm run build` passes with zero errors
- [ ] No `console.log` left in production code
- [ ] No hardcoded secrets or credentials
- [ ] PR title follows the commit convention
- [ ] PR description explains **what** and **why**

---

## Workflow

```bash
# Start from dev
git checkout dev
git pull origin dev

# Create your branch
git checkout -b feature/my-feature

# Work, commit often
git add .
git commit -m "feat(scope): describe what you did"

# Push and open PR → dev
git push origin feature/my-feature
```
