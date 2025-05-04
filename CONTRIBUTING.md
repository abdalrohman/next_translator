# Contributing to Next Translator

Thank you for your interest in contributing to Next Translator! This document provides guidelines and instructions for contributing to this project.

## Code of Conduct

By participating in this project, you agree to abide by our [Code of Conduct](CODE_OF_CONDUCT.md).

## How Can I Contribute?

### Reporting Bugs

This section guides you through submitting a bug report. Following these guidelines helps maintainers understand your report, reproduce the behavior, and find related reports.

- Use the bug report template when creating an issue
- Include detailed steps to reproduce the problem
- Describe the behavior you observed and what you expected to see
- Include screenshots if possible
- Specify your environment (browser, OS, device)

### Suggesting Enhancements

This section guides you through submitting an enhancement suggestion, including completely new features and minor improvements to existing functionality.

- Use the feature request template when creating an issue
- Provide a clear and detailed explanation of the feature you want
- Explain why this enhancement would be useful to most users
- List some other applications where this enhancement exists, if applicable

### Pull Requests

- Fill in the required template
- Follow the style guidelines of this project
- Include appropriate tests
- Update documentation as needed
- Keep your PR focused on a single topic

## Development Workflow

1. Fork the repository
2. Clone your fork: `git clone https://github.com/abdalrohman/next_translator.git`
3. Create a new branch: `git checkout -b feature/amazing-feature`
4. Install dependencies: `pnpm install`
5. Make your changes
6. Run tests and linting: `pnpm check`
7. Fix any issues: `pnpm fix`
8. Commit your changes following the [Conventional Commits](https://www.conventionalcommits.org/) specification
9. Push to your branch: `git push origin feature/amazing-feature`
10. Open a Pull Request

## Style Guidelines

### Git Commit Messages

- Use the present tense ("Add feature" not "Added feature")
- Use the imperative mood ("Move cursor to..." not "Moves cursor to...")
- Limit the first line to 72 characters or less
- Reference issues and pull requests liberally after the first line
- Consider starting the commit message with an applicable type prefix:
  - `feat:` for new features
  - `fix:` for bug fixes
  - `docs:` for documentation changes
  - `style:` for formatting changes
  - `refactor:` for code refactoring
  - `perf:` for performance improvements
  - `test:` for test updates
  - `chore:` for build process or tool changes

### JavaScript/TypeScript Style Guide

This project uses ESLint and Prettier to enforce a consistent code style. You can run the following commands:

- `pnpm lint` - Check for linting issues and fix them
- `pnpm format` - Format code using Prettier
- `pnpm fix` - Run both linting and formatting

### CSS Style Guide

- Use Tailwind CSS utility classes when possible
- Use CSS variables for theming

## Additional Notes

### Issue and Pull Request Labels

This project uses labels to categorize issues and pull requests. Here's what they mean:

- `bug`: Something isn't working
- `enhancement`: New feature or request
- `documentation`: Improvements or additions to documentation
- `good first issue`: Good for newcomers
- `help wanted`: Extra attention is needed
- `question`: Further information is requested

Thank you for contributing to Next Translator!
