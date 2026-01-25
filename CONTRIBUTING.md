# Contributing to Wallet Backend

Thank you for your interest in contributing to the Wallet Backend project! This document provides guidelines and information for contributors.

## Commit Message Conventions

We use [Conventional Commits](https://www.conventionalcommits.org/) specification for our commit messages. This leads to more readable messages that are easy to follow when looking through the project history.

### Commit Message Format

```
<type>[optional scope]: <description>

[optional body]

[optional footer(s)]
```

### Types

- **feat**: A new feature
- **fix**: A bug fix
- **docs**: Documentation only changes
- **style**: Changes that do not affect the meaning of the code (white-space, formatting, missing semi-colons, etc)
- **refactor**: A code change that neither fixes a bug nor adds a feature
- **perf**: A code change that improves performance
- **test**: Adding missing tests or correcting existing tests
- **build**: Changes that affect the build system or external dependencies
- **ci**: Changes to our CI configuration files and scripts
- **chore**: Other changes that don't modify src or test files
- **revert**: Reverts a previous commit

### Examples

```bash
# Feature
feat(api): add user authentication endpoint

# Bug fix
fix(database): resolve connection timeout issue

# Documentation
docs(readme): update installation instructions

# Breaking change
feat(api)!: change user data structure

# With scope
feat(auth): implement JWT token refresh mechanism
```

### Rules

- Subject line should be lowercase
- Subject line maximum length is 100 characters
- Do not end the subject line with a period
- Use the imperative mood in the subject line
- Wrap the body at 72 characters
- Use the body to explain what and why vs. how

### Pre-commit Hooks

This project uses Husky to enforce code quality through pre-commit hooks:

1. **Linting & Formatting**: Automatically fixes ESLint and Prettier issues
2. **Commit Message Validation**: Ensures commit messages follow conventional format

### Getting Started

1. Clone the repository
2. Install dependencies: `npm install`
3. Make your changes
4. Stage your changes: `git add .`
5. Commit with a conventional commit message
6. Push your changes

### Questions?

If you have questions about contributing, please open an issue or contact the maintainers.
