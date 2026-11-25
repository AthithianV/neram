# Contributing to Neram

Thank you for your interest in contributing to **Neram**.

Neram is an open-source desktop productivity application for time logging,
project and task management, Pomodoro sessions, and time analysis.

## Getting Started

### Prerequisites

Before contributing, install:

- Node.js and npm
- Rust and Cargo
- Tauri prerequisites for your operating system
- Git

Neram uses SQLite for local data storage, so no separate database service is
required for development.

### Clone and install

```bash
git clone https://github.com/AthithianV/neram.git
cd neram
npm install
```

### Start the development application

```bash
npm run tauri dev
```

## Development Workflow

1. Create a branch from `main`:

   ```bash
   git checkout -b feature/session-filters
   ```

2. Keep each change focused. Use descriptive branch names such as
   `feature/task-search`, `fix/timer-duration`, `docs/getting-started`, or
   `refactor/session-repository`.

3. Test your changes before opening a pull request:

   ```bash
   npm run build
   cargo test --manifest-path src-tauri/Cargo.toml
   ```

   Also test the affected behavior in the desktop application when applicable.

4. Commit with a clear message, for example:

   ```text
   feat: add session date filters
   fix: preserve timer duration on pause
   docs: improve installation instructions
   ```

5. Push the branch and open a pull request against `main`.

## Pull Requests

A pull request should explain what changed, why it was needed, and how it was
tested. Include screenshots or a short recording for UI changes. Keep unrelated
formatting or refactoring out of the change.

## Reporting Bugs

Search existing issues and confirm the problem is reproducible on the latest
version first. Include your operating system, Neram version, reproduction
steps, expected behavior, actual behavior, and relevant redacted logs or
screenshots.

Never include passwords, API keys, private keys, personal information, or
production data in an issue.

## Suggesting Features

Describe the problem the feature would solve, the expected behavior, and why it
would be useful. Examples and implementation ideas are welcome.

## Code Style

Follow the existing TypeScript, React, CSS, and Rust conventions. Prefer small
focused functions, clear names, reusable components, explicit error handling,
and minimal dependencies.

## Security

Do not commit secrets, private keys, credentials, `.env` files containing
secrets, or production data. Report security vulnerabilities privately using
the process in [`SECURITY.md`](SECURITY.md), rather than opening a public issue.

## License

By contributing to Neram, you agree that your contributions will be licensed
under the MIT License.
