# Playwright E2E Tests for FPMarket Demo

[![CI Pipeline](https://github.com/brucechang/playwright-e2e-fpmarket-demo/workflows/CI%20Pipeline/badge.svg)](https://github.com/brucechang/playwright-e2e-fpmarket-demo/actions/workflows/ci.yml)
[![Playwright Tests](https://img.shields.io/badge/playwright-^1.56.1-blue)](https://playwright.dev/)
[![TypeScript](https://img.shields.io/badge/typescript-^5.9.3-blue)](https://www.typescriptlang.org/)
[![ESLint](https://img.shields.io/badge/eslint-^8.57.1-purple)](https://eslint.org/)
[![Prettier](https://img.shields.io/badge/prettier-^3.6.2-ff69b4)](https://prettier.io/)
[![Husky](https://img.shields.io/badge/husky-^9.1.7-green)](https://typicode.github.io/husky/)
[![Commitlint](https://img.shields.io/badge/commitlint-^20.1.0-orange)](https://commitlint.js.org/)
[![Docker](https://img.shields.io/badge/docker-supported-blue)](https://www.docker.com/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

## 📦 Installed Modules & Versions

| Module                               | Version  | Purpose                          |
| ------------------------------------ | -------- | -------------------------------- |
| **@playwright/test**                 | ^1.56.1  | Modern web testing framework     |
| **typescript**                       | ^5.9.3   | TypeScript language support      |
| **eslint**                           | ^8.57.1  | JavaScript/TypeScript linting    |
| **@typescript-eslint/parser**        | ^8.47.0  | TypeScript parser for ESLint     |
| **@typescript-eslint/eslint-plugin** | ^8.47.0  | TypeScript-specific ESLint rules |
| **eslint-plugin-playwright**         | ^2.3.0   | Playwright-specific ESLint rules |
| **prettier**                         | ^3.6.2   | Code formatting                  |
| **eslint-config-prettier**           | ^10.1.8  | ESLint + Prettier integration    |
| **eslint-plugin-prettier**           | ^5.5.4   | Prettier as ESLint rule          |
| **husky**                            | ^9.1.7   | Git hooks management             |
| **@commitlint/cli**                  | ^20.1.0  | Commit message linting           |
| **@commitlint/config-conventional**  | ^20.0.0  | Conventional commit rules        |
| **lint-staged**                      | ^16.2.6  | Pre-commit file linting          |
| **@types/node**                      | ^24.10.1 | Node.js type definitions         |
| **ts-node**                          | ^10.9.2  | TypeScript execution engine      |

This project contains end-to-end (E2E) tests for the FPMarket demo account using [Playwright](https://playwright.dev/), a modern web testing framework written in **TypeScript** with comprehensive linting and code quality tools.

## 📋 Overview

This test suite is designed to validate the functionality and user experience of the FPMarket demo trading platform through automated browser testing. The tests simulate real user interactions to ensure the application works correctly across different browsers and scenarios.

## 🎯 Purpose

- **Quality Assurance**: Ensure FPMarket demo features work as expected
- **Regression Testing**: Catch breaking changes before they reach production
- **Cross-Browser Testing**: Verify compatibility across Chrome, Firefox, and Safari
- **User Journey Validation**: Test critical trading workflows and user paths
- **Performance Monitoring**: Track application performance metrics

## 🚀 Features

- **Multi-Browser Support**: Tests run on Chromium, Firefox, and WebKit
- **Parallel Execution**: Fast test execution with parallel test runs
- **Visual Testing**: Screenshot comparison and visual regression testing
- **Mobile Testing**: Responsive design validation on mobile viewports
- **CI/CD Ready**: Integration with continuous integration pipelines

## 📁 Project Structure

```
playwright-e2e-fpmarket-demo/
├── tests/                    # TypeScript test files
│   ├── auth/                # Authentication tests
│   ├── trading/             # Trading functionality tests
│   ├── portfolio/           # Portfolio management tests
│   └── navigation/          # Navigation and UI tests
├── pages/                   # Page Object Model classes (TypeScript)
├── fixtures/                # Test data and fixtures
├── utils/                   # Helper functions and utilities (TypeScript)
├── .husky/                  # Git hooks configuration
├── playwright.config.ts     # Playwright configuration (TypeScript)
├── tsconfig.json           # TypeScript configuration
├── .eslintrc.js            # ESLint configuration
├── .prettierrc             # Prettier configuration
├── .commitlintrc.js        # Commitlint configuration
├── Makefile                # Make commands
└── package.json            # Project dependencies and scripts
```

## 🛠️ Prerequisites

- **Node.js** (version 16 or higher)
- **npm** or **yarn** package manager

## 📦 Installation

1. Clone the repository:

```bash
git clone <repository-url>
cd playwright-e2e-fpmarket-demo
```

2. Complete setup (install dependencies and browsers):

```bash
make setup
```

Or run individual steps:

```bash
make install          # Install dependencies
make install-browsers # Install Playwright browsers
```

## 🔧 Configuration

Create a `.env` file in the root directory with your test environment variables:

```env
BASE_URL=https://demo.fpmarket.com
TEST_USERNAME=your-demo-username
TEST_PASSWORD=your-demo-password
```

## 🔧 Available Commands

This project uses a Makefile for easy command execution. To see all available commands:

```bash
make help
```

### Quick Commands

- `make setup` - Complete project setup
- `make test` - Run all tests
- `make test-headed` - Run tests with visible browser
- `make lint` - Run ESLint on TypeScript files
- `make lint-fix` - Run ESLint and fix issues automatically
- `make format` - Format code with Prettier
- `make type-check` - Run TypeScript type checking
- `make report` - View test reports
- `make clean` - Clean and reinstall dependencies

## 🧪 Running Tests

### Run all tests

```bash
make test
```

### Run tests in headed mode (visible browser)

```bash
make test-headed
```

### Run tests in a specific browser

```bash
make test-chromium
make test-firefox
make test-webkit
```

### Run specific test files

```bash
npx playwright test auth/login.spec.js
```

### Run tests in debug mode

```bash
make test-debug
```

### Run tests with UI mode

```bash
make test-ui
```

## 🔍 Code Quality & Linting

### Run linting

```bash
make lint
```

### Auto-fix linting issues

```bash
make lint-fix
```

### Format code

```bash
make format
```

### Check TypeScript types

```bash
make type-check
```

## 🚀 CI/CD Pipeline

This project includes a comprehensive GitHub Actions CI/CD pipeline that runs:

### Workflow Overview

The CI pipeline consists of four main jobs:

1. **Code Quality Check** (`lint`): Validates code style, formatting, and TypeScript types
2. **E2E Tests** (`e2e-tests`): Runs Playwright tests directly on the GitHub Actions runner
3. **Docker E2E Tests** (`docker-tests`): Runs the same tests inside a Docker container
4. **Test Summary** (`test-summary`): Provides a consolidated report of all test results

### Pipeline Features

- ✅ **Parallel Execution**: Lint checks run first, then E2E tests run in parallel
- ✅ **Multi-Environment**: Tests both native and Docker environments
- ✅ **Artifact Collection**: Automatically uploads test reports and results
- ✅ **Smart Triggers**: Runs on PRs and pushes to `main`/`develop` branches
- ✅ **Comprehensive Coverage**: ESLint, Prettier, TypeScript, and E2E tests

### Local CI Testing

Run the same checks locally before pushing:

```bash
# Run complete CI pipeline locally
make ci-all

# Run just linting checks
make ci-lint

# Run just tests
make ci-test

# Run Docker-based tests
make ci-docker-test
```

### Viewing Results

- **Test Reports**: Download from Actions artifacts or view in the GitHub interface
- **Coverage**: Detailed Playwright HTML reports are generated for each run
- **Logs**: Full test execution logs available in GitHub Actions interface

## 🐳 Docker Support

### Prerequisites for Docker

- **Docker** (version 20.0+ recommended)
- **Docker Compose** (version 2.0+ recommended)

### Docker Commands

#### Build Docker Image

```bash
make docker-build
```

#### Run Tests in Docker

```bash
make docker-test
```

#### Run Tests with Docker Compose

```bash
make docker-compose-test
```

#### Start Report Server

```bash
make docker-compose-report
```

Then open http://localhost:9323 to view test reports.

#### Development with Docker

```bash
# Open shell in Docker container
make docker-shell

# Clean Docker artifacts
make docker-clean

# Rebuild Docker image
make docker-rebuild
```

### Docker Architecture

- **Base Image**: `mcr.microsoft.com/playwright:v1.41.0-focal`
- **Multi-stage builds**: Optimized for CI/CD pipelines
- **Volume mounting**: Test results and reports are persisted
- **Network isolation**: Containers run in isolated network

### Benefits of Docker

- ✅ **Consistent Environment**: Same test environment across all machines
- ✅ **No Local Dependencies**: No need to install browsers locally
- ✅ **CI/CD Ready**: Easy integration with Docker-based CI systems
- ✅ **Isolation**: Tests run in isolated containers
- ✅ **Scalability**: Easy horizontal scaling for parallel test execution

## 📊 Test Reports

After running tests, you can view detailed reports:

```bash
make report
```

This will open an interactive HTML report showing:

- Test results and status
- Screenshots and videos of failures
- Performance metrics
- Timeline of test execution

## 🏗️ Test Categories

### Authentication Tests

- User login/logout functionality
- Password reset flows
- Session management
- Multi-factor authentication

### Trading Tests

- Market data display
- Order placement and execution
- Position management
- Trading history

### Portfolio Tests

- Account balance verification
- Asset allocation views
- Performance tracking
- Transaction history

### Navigation Tests

- Menu functionality
- Page transitions
- Responsive design
- Accessibility compliance

## 📝 Writing Tests

Tests are written in **TypeScript** and organized using the Page Object Model pattern. Example test structure:

```typescript
import { test, expect } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage';
import { TradingPage } from '../pages/TradingPage';

test('should place a buy order successfully', async ({ page }) => {
  const loginPage = new LoginPage(page);
  const tradingPage = new TradingPage(page);

  await loginPage.goto();
  await loginPage.login('demo-user', 'demo-password');
  await tradingPage.placeBuyOrder('AAPL', 10);

  await expect(tradingPage.orderConfirmation).toBeVisible();
});
```

### TypeScript Configuration

The project uses strict TypeScript settings with:

- **Strict type checking** enabled
- **Path mapping** for clean imports (`@pages/*`, `@utils/*`, etc.)
- **ESLint integration** for code quality
- **Prettier integration** for consistent formatting

## 🔍 Best Practices

- **Stable Selectors**: Use data-testid attributes for reliable element selection
- **Independent Tests**: Each test should be self-contained and not depend on others
- **Clean State**: Always start tests from a known, clean state
- **Explicit Waits**: Use proper waiting strategies instead of fixed delays
- **Error Handling**: Include proper error handling and meaningful assertions
- **TypeScript**: Use proper typing for all variables and functions
- **Code Quality**: Follow ESLint rules and Prettier formatting

## 🔧 Git Workflow & Code Quality

This project enforces code quality through automated tools:

### Pre-commit Hooks (Husky)

- **Lint-staged**: Automatically lints and formats staged files
- **ESLint**: Checks for code quality issues
- **Prettier**: Ensures consistent code formatting
- **TypeScript**: Validates type correctness

### Commit Message Standards

Commit messages must follow [Conventional Commits](https://www.conventionalcommits.org/):

```bash
feat: add new login test for multi-factor authentication
fix: resolve flaky test in trading module
docs: update README with new testing guidelines
test: add edge cases for portfolio calculations
```

**Allowed types**: `feat`, `fix`, `docs`, `test`, `refactor`, `style`, `chore`, `perf`, `ci`, `build`, `revert`

### Branch Naming Convention

Use descriptive branch names:

- `feature/add-login-tests`
- `fix/flaky-trading-test`
- `docs/update-readme`
- `refactor/page-objects`

## 🐛 Debugging

### Common Issues

- **Timeout Errors**: Increase timeout values or improve waiting strategies
- **Flaky Tests**: Review element selectors and timing issues
- **Environment Issues**: Verify test environment configuration

### Debug Tools

- **Playwright Inspector**: Step through tests interactively
- **Trace Viewer**: Analyze test execution timeline
- **Screenshots**: Automatic capture on test failures

## 📚 Resources

- [Playwright Documentation](https://playwright.dev/docs/intro)
- [FPMarket Demo Platform](https://demo.fpmarket.com)
- [Test Strategy Guidelines](./docs/test-strategy.md)
- [Contributing Guide](./CONTRIBUTING.md)

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/new-test`)
3. Commit your changes (`git commit -am 'Add new trading test'`)
4. Push to the branch (`git push origin feature/new-test`)
5. Create a Pull Request

## 📞 Support

For questions or issues related to this test suite:

- Create an issue in this repository
- Contact the QA team at [qa@company.com]
- Review existing documentation in the `/docs` folder

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
