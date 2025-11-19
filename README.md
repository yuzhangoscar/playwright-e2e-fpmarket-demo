# Playwright E2E Testing Framework

## 🏷️ Active Module Versions & Badges

[![Playwright Tests](https://img.shields.io/badge/playwright-1.48.0-blue)](https://playwright.dev/)
[![TypeScript](https://img.shields.io/badge/typescript-5.9.3-blue)](https://www.typescriptlang.org/)
[![Node.js](https://img.shields.io/badge/node.js-≥16.0.0-green)](https://nodejs.org/)
[![Allure](https://img.shields.io/badge/allure--playwright-3.4.2-orange)](https://github.com/allure-framework/allure-js)
[![Axe Core](https://img.shields.io/badge/axe--core-4.11.0-purple)](https://github.com/dequelabs/axe-core)
[![ESLint](https://img.shields.io/badge/eslint-8.57.1-purple)](https://eslint.org/)
[![Prettier](https://img.shields.io/badge/prettier-3.6.2-ff69b4)](https://prettier.io/)
[![Jest](https://img.shields.io/badge/jest-29.7.0-red)](https://jestjs.io/)
[![Express](https://img.shields.io/badge/express-4.18.2-lightgrey)](https://expressjs.com/)
[![Docker](https://img.shields.io/badge/docker-supported-blue)](https://www.docker.com/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

### 📦 Core Dependencies

| **Testing Framework** | **Version** | **Accessibility**    | **Version** | **Development** | **Version** |
| --------------------- | ----------- | -------------------- | ----------- | --------------- | ----------- |
| @playwright/test      | 1.48.0      | @axe-core/playwright | 4.11.0      | typescript      | 5.9.3       |
| allure-playwright     | 3.4.2       | axe-core             | 4.11.0      | eslint          | 8.57.1      |
| allure-commandline    | 2.34.1      |                      |             | prettier        | 3.6.2       |
| jest                  | 29.7.0      |                      |             | husky           | 9.1.7       |

| **API Server** | **Version** | **Type Definitions** | **Version** | **Linting & Formatting**         | **Version** |
| -------------- | ----------- | -------------------- | ----------- | -------------------------------- | ----------- |
| express        | 4.18.2      | @types/node          | 24.10.1     | @typescript-eslint/parser        | 8.47.0      |
| cors           | 2.8.5       | @types/express       | 4.17.21     | @typescript-eslint/eslint-plugin | 8.47.0      |
| helmet         | 7.1.0       | @types/jest          | 29.5.12     | eslint-plugin-playwright         | 2.3.0       |
| morgan         | 1.10.0      | @types/supertest     | 6.0.2       | eslint-config-prettier           | 10.1.8      |

---

## 🚀 Quick Start

A comprehensive E2E testing framework with Playwright, WCAG accessibility testing, Allure reporting, and Docker support for crypto trading platform validation.

### 📦 Prerequisites & Installation

```bash
# Prerequisites: Node.js ≥16.0.0, Docker (optional)
git clone <repository-url>
cd playwright-api-demo
make setup  # Installs dependencies and Playwright browsers
```

---

## 🔧 Essential Make Commands

### 🧪 **Local Testing**

```bash
make test                    # Run all E2E tests locally
make test-allure            # Run tests with Allure reporting
make test-accessibility     # Run WCAG accessibility tests
```

### 🐳 **Docker Testing (Recommended)**

```bash
make docker-test-e2e        # Run E2E tests in Docker (generates Allure HTML)
make docker-test-api        # Run API server tests in Docker
make docker-test-wcag       # Run WCAG accessibility tests in Docker
make docker-test-all        # Run all test suites in Docker
```

### 📊 **Allure Reports**

```bash
# Local Allure Reports
make allure-generate        # Generate HTML report from results
make allure-serve          # Generate and auto-open report in browser
make allure-open           # Open existing HTML report

# Docker Allure Reports (with live server)
make docker-test-e2e-serve  # Run E2E tests + serve report at :9001
make docker-reports         # Start all report servers (E2E: :9001, API: :9002)
```

### 🔧 **Development & Maintenance**

```bash
make setup                  # Complete project setup
make lint                   # Run ESLint and Prettier checks
make format                 # Auto-format code with Prettier
make clean                  # Clean generated files and reinstall
make docker-clean          # Clean Docker containers and volumes
```

---

## 📊 **Accessing Test Reports**

### **Local Reports**

```bash
# After running tests locally
npx playwright show-report  # Playwright HTML report
make allure-open            # Allure HTML report (if generated)
```

### **Docker Reports (Live Servers)**

```bash
# After running Docker tests
open http://localhost:9001   # E2E Allure reports
open http://localhost:9002   # API Allure reports
open http://localhost:3000   # API server health endpoint
```

---

## 🎯 **Test Suite Overview**

### 🎭 **E2E Tests**

- **Target**: Crypto.com exchange navigation and functionality
- **Browser**: Chromium (configurable for Firefox, WebKit)
- **Reports**: Playwright HTML + Allure with screenshots/videos

### ♿ **WCAG Accessibility Tests**

- **Standards**: WCAG 2.1 Level A, AA + WCAG 2.2 Level AAA
- **Features**: Automated modal dismissal, multi-browser support
- **Tools**: axe-core integration with detailed violation reports

### 🚀 **API Server Tests**

- **Framework**: Jest with TypeScript
- **Endpoints**: Health checks, blacklist management
- **Coverage**: Full test coverage with Allure reporting

---

## 🐳 **Docker Architecture**

### **Separated Test Suites**

| Service        | Image                      | Purpose                   | Report Port |
| -------------- | -------------------------- | ------------------------- | ----------- |
| **e2e-tests**  | `playwright:v1.48.0-focal` | E2E functionality testing | :9001       |
| **api-tests**  | `node:22-alpine`           | API server testing        | :9002       |
| **wcag-tests** | `playwright:v1.48.0-focal` | Accessibility compliance  | -           |

### **Docker Benefits**

- ✅ **Consistent Environment**: Same runtime across all machines
- ✅ **Automatic Report Generation**: HTML reports generated in containers
- ✅ **Live Report Servers**: Nginx servers for interactive report viewing
- ✅ **Complete Isolation**: Independent test suites with separate volumes

---

## 📁 **Project Structure**

```
playwright-api-demo/
├── tests/                   # E2E and accessibility test files
├── src/                     # Mock API server (Express.js)
├── docker/                  # Separated Dockerfiles for each test suite
├── playwright.config.ts     # Main Playwright configuration
├── playwright.accessibility.config.ts  # WCAG testing configuration
├── Makefile                 # Essential commands and workflows
└── docker-compose.yml       # Multi-service Docker orchestration
```

---

## 🛠️ **Configuration**

Create `.env` file for custom settings:

```bash
BASE_URL=https://crypto.com/exchange/trade/BTC_USD
TEST_TIMEOUT=30000
HEADLESS=true
```

---

## 📚 **Key Features**

- 🎯 **Multi-Browser Testing**: Chromium, Firefox, WebKit support
- ♿ **WCAG Compliance**: Comprehensive accessibility testing
- 📊 **Rich Reporting**: Interactive Allure reports with trends and attachments
- 🐳 **Docker Ready**: Containerized testing with isolated environments
- 🔧 **TypeScript**: Full type safety with strict configuration
- 🚀 **CI/CD Integration**: GitHub Actions with artifact management

---

## 📄 **License**

MIT License - see [LICENSE](LICENSE) file for details.
