# Contributing to Mood Diary

Thank you for your interest in contributing to Mood Diary! This document provides guidelines and instructions for contributing.

## How to Contribute

### Reporting Issues

If you find a bug or have a feature request:

1. **Check existing issues** - Search the [issue tracker](https://github.com/shagunmistry/moodtracker/issues) to see if it's already reported
2. **Create a new issue** - If not found, create a new issue with:
   - A clear, descriptive title
   - Detailed description of the problem or feature
   - Steps to reproduce (for bugs)
   - Expected vs actual behavior
   - Screenshots if applicable
   - Your environment (browser, OS, device)

### Pull Request Process

1. **Fork the repository** and create a new branch from `main`
   ```bash
   git checkout -b feature/your-feature-name
   # or
   git checkout -b fix/your-bug-fix
   ```

2. **Make your changes** following the code style guidelines below

3. **Test your changes** locally
   ```bash
   npm install
   npm run dev
   npm run lint
   npm run build
   ```

4. **Commit your changes** with clear, descriptive commit messages
   ```bash
   git commit -m "feat: add mood filtering by date range"
   # or
   git commit -m "fix: resolve chart rendering issue on mobile"
   ```

5. **Push to your fork** and submit a pull request to the `main` branch
   - Fill out the PR template completely
   - Link any related issues
   - Add screenshots for UI changes
   - Ensure all checks pass

6. **Address review feedback** - A maintainer will review your PR and may request changes

## Development Setup

### Prerequisites

- Node.js 20 or higher
- npm or pnpm

### Getting Started

1. Clone the repository
   ```bash
   git clone https://github.com/shagunmistry/moodtracker.git
   cd moodtracker
   ```

2. Install dependencies
   ```bash
   npm install
   ```

3. Start the development server
   ```bash
   npm run dev
   ```

4. Open [http://localhost:3001](http://localhost:3001) in your browser

### Project Structure

```
moodtracker/
├── src/
│   ├── app/           # Next.js app router pages
│   ├── components/    # React components
│   └── lib/          # Utility functions
├── public/           # Static assets
└── scripts/          # Build scripts
```

## Code Style Guidelines

### TypeScript

- Use TypeScript for all new code
- Define types/interfaces for props and function parameters
- Avoid `any` types - use proper typing

### React Components

- Use functional components with hooks
- Keep components small and focused
- Use meaningful component and variable names
- Extract reusable logic into custom hooks

### Formatting

- Follow the existing code style
- Run `npm run lint` before committing
- Use meaningful commit messages following [Conventional Commits](https://www.conventionalcommits.org/)

### Commit Message Format

```
type(scope): description

[optional body]
[optional footer]
```

Types:
- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation changes
- `style`: Code style changes (formatting, etc.)
- `refactor`: Code refactoring
- `test`: Adding or updating tests
- `chore`: Maintenance tasks

Examples:
- `feat: add mood export to CSV`
- `fix: resolve localStorage quota exceeded error`
- `docs: update installation instructions`

## Privacy & Security

Since this app focuses on privacy:

- Never add analytics or tracking
- Never add external API calls that send user data
- Keep all data storage local (localStorage/IndexedDB)
- Document any new permissions or storage requirements

## Testing

- Test your changes across different browsers (Chrome, Firefox, Safari)
- Test on mobile devices or using browser dev tools
- Verify offline functionality (PWA features)
- Check that data import/export still works

## Questions?

If you have questions about contributing:
- Open a discussion in GitHub Discussions
- Comment on the relevant issue
- Reach out to the maintainers

## Recognition

All contributors will be recognized in the project. Your contributions are appreciated!

## License

By contributing, you agree that your contributions will be licensed under the same license as the project.
