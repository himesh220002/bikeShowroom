# Contributing to BikeShowroom

Thank you for contributing to the BikeShowroom project! To maintain code quality and consistency, please follow these guidelines before creating a new branch or submitting a pull request.

## 🚀 Pre-Creation Checklist
Before creating a new branch, ensure the following:

1.  **Pull Latest Changes**: Always start from the latest `main` branch.
    ```bash
    git checkout main
    git pull origin main
    ```
2.  **Verify Issues**: Ensure the fix or feature you are working on is documented or discussed.

## 🌿 Branch Naming Conventions
Use descriptive names with your name as a prefix:
- `yourname/feature/short-description` (for new features)
- `yourname/fix/short-description` (for bug fixes)
- `yourname/docs/short-description` (for documentation changes)
- `yourname/refactor/short-description` (for code refactoring)
- `yourname/perf/short-description` (for performance improvements)

Example: `himesh/feature/on-road-price-maker` or `ajay/fix/navbar-scroll-issue`.

## 🛠️ Development Standards

### 1. Code Quality
- **Linting**: Run linting in both `client` and `server` directories.
    ```bash
    # In client or server folder
    npm run lint
    ```
- **Formatting**: Ensure your code follows the project's formatting rules (Prettier/ESLint).
- **Clean Code**: Remove unnecessary `console.log`, `debugger`, and commented-out code blocks.

### 2. Frontend (Client)
- **Responsiveness**: Verify that UI changes look good on mobile, tablet, and desktop.
- **Performance**: Avoid unnecessary re-renders and large bundle sizes. Use `next/image` and `next/dynamic` where appropriate.
- **TypeScript**: Ensure there are no new TypeScript errors.

### 3. Backend (Server)
- **Security**: Never commit sensitive information (API keys, secrets) or `.env` files.
- **Validation**: Ensure all new API endpoints have proper request validation and error handling.
- **Database**: If you change a model, verify that it doesn't break existing data.

## 📝 Commit Messages
Keep commit messages concise and descriptive. Use the imperative mood:
- `Add lazy loading to home page` (Correct)
- `Added lazy loading to home page` (Incorrect)

## 📤 Submission Checklist
Before pushing your branch:
- [ ] Code is linted and formatted.
- [ ] No new TypeScript errors or warnings.
- [ ] The application starts and runs without errors (`npm run dev`).
- [ ] Tests pass (if applicable).
- [ ] Documentation (like `README.md` or `walkthrough.md`) is updated.

---
*Happy Coding!* 🏍️
