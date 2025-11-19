# Playwright E2E Tests for Crypto

[![CI Pipeline](https://github.com/brucechang/playwright-e2e-crypto/workflows/CI%20Pipeline/badge.svg)](https://github.com/brucechang/playwright-e2e-crypto/actions/workflows/ci.yml)
[![Playwright Tests](https://img.shields.io/badge/playwright-^1.48.0-blue)](https://playwright.dev/)
[![TypeScript](https://img.shields.io/badge/typescript-^5.9.3-blue)](https://www.typescriptlang.org/)
[![ESLint](https://img.shields.io/badge/eslint-^8.57.1-purple)](https://eslint.org/)
[![Prettier](https://img.shields.io/badge/prettier-^3.6.2-ff69b4)](https://prettier.io/)
[![Husky](https://img.shields.io/badge/husky-^9.1.7-green)](https://typicode.github.io/husky/)
[![Commitlint](https://img.shields.io/badge/commitlint-^20.1.0-orange)](https://commitlint.js.org/)
[![Docker](https://img.shields.io/badge/docker-supported-blue)](https://www.docker.com/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

A comprehensive E2E testing framework with Playwright, Allure reporting, and a mock API server for testing scenarios.

## 📦 Installed Modules & Versions

| Module                               | Version  | Purpose                          |
| ------------------------------------ | -------- | -------------------------------- |
| **@playwright/test**                 | ^1.48.0  | Modern web testing framework     |
| **allure-playwright**                | ^3.0.0   | Allure reporting for Playwright  |
| **allure-commandline**               | ^2.25.0  | Allure report generation CLI     |
| **typescript**                       | ^5.9.3   | TypeScript language support      |
| **dotenv**                           | ^17.2.3  | Environment variable management  |
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

This project contains end-to-end (E2E) tests for crypto trading platforms using [Playwright](https://playwright.dev/), a modern web testing framework written in **TypeScript** with comprehensive linting and code quality tools.

## 📋 Overview

This test suite is designed to validate the functionality and user experience of crypto trading platforms through automated browser testing. The tests simulate real user interactions to ensure the application works correctly across different browsers and scenarios.

## 🎯 Purpose

- **Quality Assurance**: Ensure crypto trading features work as expected
- **Regression Testing**: Catch breaking changes before they reach production
- **Cross-Browser Testing**: Verify compatibility across Chrome, Firefox, and Safari
- **User Journey Validation**: Test critical trading workflows and user paths
- **Performance Monitoring**: Track application performance metrics

## 🚀 Features

- **Multi-Browser Support**: Tests run on Chromium, Firefox, and WebKit
- **Mock API Server**: Node.js/Express server with health check and blacklist endpoints
- **Parallel Execution**: Fast test execution with parallel test runs
- **AWS Deployment**: CloudFormation templates and EC2 deployment scripts
- **Visual Testing**: Screenshot comparison and visual regression testing
- **Mobile Testing**: Responsive design validation on mobile viewports
- **CI/CD Ready**: Integration with continuous integration pipelines

## 📁 Project Structure

```
playwright-e2e-crypto/
├── tests/                    # TypeScript test files
│   ├── auth/                # Authentication tests
│   ├── trading/             # Trading functionality tests
│   ├── portfolio/           # Portfolio management tests
│   ├── navigation/          # Navigation and UI tests
│   └── api.test.ts          # API server tests
├── src/                     # Mock API server source code
│   ├── server.ts            # Express server main file
│   ├── routes/              # API route handlers
│   │   ├── health.ts        # Health check endpoints
│   │   └── blacklist.ts     # Blacklist management endpoints
│   └── data/                # Data stores
│       └── blacklistStore.ts # In-memory blacklist store
├── deployment/              # AWS deployment scripts
│   ├── deploy.sh            # EC2 manual deployment
│   ├── cloudformation.yaml  # Infrastructure as Code
│   └── cloudformation-deploy.sh # CloudFormation helper
├── pages/                   # Page Object Model classes (TypeScript)
├── fixtures/                # Test data and fixtures
├── utils/                   # Helper functions and utilities (TypeScript)
├── .husky/                  # Git hooks configuration
├── playwright.config.ts     # Playwright configuration (TypeScript)
├── tsconfig.json           # TypeScript configuration
├── tsconfig.server.json    # Server TypeScript configuration
├── jest.config.js          # Jest configuration for API tests
├── .eslintrc.js            # ESLint configuration
├── .prettierrc             # Prettier configuration
├── .commitlintrc.js        # Commitlint configuration
├── Makefile                # Make commands
├── API_README.md           # API server documentation
└── package.json            # Project dependencies and scripts
```

## 🛠️ Prerequisites

- **Node.js** (version 16 or higher)
- **npm** or **yarn** package manager

## 📦 Installation

1. Clone the repository:

```bash
git clone <repository-url>
cd playwright-e2e-crypto
```

2. Complete setup (install dependencies and browsers):

```bash
make setup
```

Or run individual steps:

```bash
make setup  # Complete setup: install dependencies and browsers
```

## 🖥️ Mock API Server

This project includes a Node.js/Express mock API server for testing scenarios with health check and blacklist endpoints.

### Quick Start

```bash
# Start development server with hot reloading
npm run api:dev

# Build and start production server
npm run api:build
npm run api:start

# Run API tests
npm run api:test
```

### API Endpoints

- **Health Check**: `GET /api/health` - Basic health status
- **Detailed Health**: `GET /api/health/detailed` - System metrics
- **Blacklist**: `GET /api/blacklist` - Get all blacklisted entries
- **Check Name**: `GET /api/blacklist/check/{name}` - Check if name is blacklisted
- **Add Entry**: `POST /api/blacklist` - Add new blacklist entry
- **Remove Entry**: `DELETE /api/blacklist/{name}` - Remove blacklist entry

### AWS Deployment

Deploy to AWS EC2 using CloudFormation:

```bash
# Deploy infrastructure and application
./deployment/cloudformation-deploy.sh playwright-api-stack my-key-pair

# Or manual deployment to existing EC2
./deployment/deploy.sh <EC2_IP> <SSH_KEY_PATH>
```

For detailed API documentation, see [API_README.md](./API_README.md).

For AWS deployment setup and configuration, see [AWS_DEPLOYMENT.md](./AWS_DEPLOYMENT.md).

## 🔧 Configuration

Create a `.env` file in the root directory with your test environment variables:

```bash
cp .env.example .env
```

Then edit `.env` with your configuration:

```env
# Base URL for the application
BASE_URL=https://crypto.com/exchange/trade/BTC_USD

# Test Configuration
TEST_TIMEOUT=30000
TEST_RETRIES=2
HEADLESS=true

# Browser Configuration
DEFAULT_BROWSER=chromium
VIEWPORT_WIDTH=1920
VIEWPORT_HEIGHT=1080

# Reporting
REPORT_TITLE="Crypto.com E2E Test Results"
```

## 🔧 Available Commands

This project uses a simplified Makefile for essential commands. To see all available commands:

```bash
make help
```

### Essential Commands

- `make setup` - Complete project setup (install dependencies and browsers)
- `make test` - Run all Playwright tests
- `make test-allure` - Run tests with Allure reporting
- `make allure-generate` - Generate Allure HTML report
- `make allure-serve` - Generate and serve Allure report (auto-opens browser)
- `make allure-open` - Open existing Allure report
- `make lint` - Run ESLint and Prettier checks
- `make format` - Format code with Prettier
- `make docker-test` - Run tests in Docker container
- `make clean` - Clean generated files and reinstall dependencies## 🧪 Running Tests

### Run all tests locally

```bash
make test
```

### Run tests with Allure reporting

```bash
make test-allure
```

### Run tests in Docker

```bash
make docker-test
```

### Run specific test files (advanced)

```bash
npx playwright test tests/crypto-navigation.spec.ts
```

### View test reports

```bash
npx playwright show-report
```

## 📊 Allure Test Reports

### Local Allure Reports

#### Generate and View Allure Report

```bash
# Run tests with Allure reporter
make test-allure

# Generate HTML report
make allure-generate

# Open the report in browser
make allure-open

# Or generate and serve in one command (auto-opens browser)
make allure-serve
```

#### Allure Report Features

- 📈 **Test Trends**: Historical test execution trends
- 🏷️ **Categorization**: Tests organized by Epic, Feature, Story
- 📝 **Detailed Steps**: Step-by-step test execution breakdown
- 🔗 **Attachments**: Screenshots, logs, and JSON data
- ⏱️ **Performance**: Test duration and timing analysis
- 📊 **Statistics**: Pass/fail ratios and test distribution

### GitHub Actions Integration

#### Automated Report Generation

- ✅ **Every CI Run**: Allure reports generated automatically
- 📁 **Artifact Upload**: Reports available as downloadable artifacts
- 🌐 **GitHub Pages**: Reports deployed to GitHub Pages (main branch)
- 🔗 **Direct Access**: View reports at `https://[username].github.io/[repo]/allure-reports/[run-number]`

#### Accessing Reports in GitHub Actions

1. **Artifacts Tab**: Download `allure-report` artifact from any workflow run
2. **GitHub Pages**: Visit the deployed report URL (main branch only)
3. **Summary**: Key metrics shown in workflow summary

#### Report Structure

```
allure-reports/
├── [run-number-1]/     # Latest run
├── [run-number-2]/     # Previous run
└── [run-number-3]/     # Older runs
```

## 🔍 Code Quality & Linting

### Run linting and format checks

```bash
make lint
```

### Format code automatically

```bash
make format
```

## 🚀 CI/CD Pipeline

This project includes a comprehensive GitHub Actions CI/CD pipeline that runs:

### Workflow Overview

The CI pipeline consists of three main jobs:

1. **Code Quality Check** (`lint`): Validates code style, formatting, and TypeScript types
2. **Docker E2E Tests** (`docker-tests`): Runs Playwright tests inside a Docker container
3. **Test Summary** (`test-summary`): Provides a consolidated report of all test results

### Pipeline Features

- ✅ **Streamlined Execution**: Lint checks run first, then Docker E2E tests
- ✅ **Consistent Environment**: All tests run in Docker for consistency
- ✅ **Artifact Collection**: Automatically uploads test reports and results
- ✅ **Smart Triggers**: Runs on PRs and pushes to `main`/`develop` branches
- ✅ **Comprehensive Coverage**: ESLint, Prettier, TypeScript, and Docker E2E tests

### Local CI Testing

Run the same checks locally before pushing:

```bash
# Run linting and format checks (same as CI)
make lint

# Run tests locally
make test

# Run tests in Docker (same as CI)
make docker-test
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

#### Run Tests in Docker (Build + Test)

```bash
make docker-test
```

This command automatically:

- Builds the Docker image with latest code
- Runs all Playwright tests in the container
- Saves test results, Playwright reports, and **Allure results** to local directories
- **Maintains consistency** with CI/CD environment (same volume mounts as GitHub Actions)

#### Advanced Docker Usage

```bash
# Use Docker Compose for orchestrated testing
docker-compose up --build playwright-tests

# Start report server (optional)
docker-compose up --build report-server
```

Then open http://localhost:9323 to view test reports.

### Docker Architecture & Security

- **Base Image**: `mcr.microsoft.com/playwright:v1.48.0-focal` (matches npm package version)
- **Optimized builds**: Efficient caching and minimal layers
- **Volume mounting**: Test results, Playwright reports, and Allure results are persisted locally
- **Environment consistency**: Same runtime as CI/CD pipeline
- **🔒 Secure**: `.env` files excluded from Docker images (see `.dockerignore`)

#### Environment Variable Security

**✅ Secure Approach (Current):**

```bash
# .env files are in .dockerignore - never copied to Docker images
# Environment variables passed at runtime:
docker run -e BASE_URL=https://custom.url -e TEST_TIMEOUT=60000 playwright-e2e-tests

# Or use docker-compose with host environment variables:
BASE_URL=https://custom.url docker-compose up
```

**❌ Insecure Approach (Avoided):**

- `.env` files baked into Docker images
- Sensitive data exposed in image layers
- Secrets accessible to anyone with image access

**⚠️ Current Security Level:**

- Environment variables visible in running containers (`docker exec`, `printenv`)
- Acceptable for test configuration (URLs, timeouts)
- **Not suitable for real secrets** (API keys, passwords)
- For production secrets, use Docker Secrets or external secret management

### Benefits of Docker

- ✅ **Consistent Environment**: Same test environment across all machines
- ✅ **No Local Dependencies**: No need to install browsers locally
- ✅ **CI/CD Ready**: Easy integration with Docker-based CI systems
- ✅ **Isolation**: Tests run in isolated containers
- ✅ **Scalability**: Easy horizontal scaling for parallel test execution

## 📊 Test Reports

After running tests, you can view detailed reports:

```bash
npx playwright show-report
```

This will open an interactive HTML report showing:

- ✅ Test results and status
- 📸 Screenshots and videos of failures
- ⏱️ Performance metrics and timing
- 📋 Timeline of test execution

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
- [Crypto.com Exchange](https://crypto.com/exchange)
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
