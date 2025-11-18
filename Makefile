.PHONY: help install install-browsers test test-headed test-chromium test-firefox test-webkit test-debug report clean setup

# Default target
help: ## Show this help message
	@echo "Available commands:"
	@grep -E '^[a-zA-Z_-]+:.*?## .*$$' $(MAKEFILE_LIST) | sort | awk 'BEGIN {FS = ":.*?## "}; {printf "\033[36m%-20s\033[0m %s\n", $$1, $$2}'

setup: install install-browsers ## Complete setup: install dependencies and browsers

install: ## Install project dependencies
	npm install

install-browsers: ## Install Playwright browsers
	npx playwright install

test: ## Run all tests
	npm test

test-headed: ## Run tests in headed mode (visible browser)
	npx playwright test --headed

test-chromium: ## Run tests in Chromium browser only
	npx playwright test --project=chromium

test-firefox: ## Run tests in Firefox browser only
	npx playwright test --project=firefox

test-webkit: ## Run tests in WebKit browser only
	npx playwright test --project=webkit

test-debug: ## Run tests in debug mode
	npx playwright test --debug

test-ui: ## Run tests with Playwright UI mode
	npx playwright test --ui

report: ## Open test report
	npx playwright show-report

clean: ## Clean node_modules and reinstall dependencies
	rm -rf node_modules package-lock.json
	npm install

clean-reports: ## Clean test reports and artifacts
	rm -rf test-results/ playwright-report/ blob-report/

lint: ## Run ESLint on TypeScript files
	npm run lint

lint-fix: ## Run ESLint and automatically fix issues
	npm run lint:fix

format: ## Format code with Prettier
	npm run format

format-check: ## Check code formatting with Prettier
	npm run format:check

type-check: ## Run TypeScript type checking
	npm run type-check

dev: ## Start development server (if applicable)
	npm run dev

build: ## Build the project (if applicable)
	npm run build

update: ## Update Playwright browsers
	npx playwright install

trace: ## View trace files
	npx playwright show-trace

codegen: ## Generate test code using Playwright codegen
	npx playwright codegen

doctor: ## Run Playwright system requirements check
	npx playwright install --dry-run

# Docker commands
docker-build: ## Build Docker image
	docker build -t playwright-e2e-tests .

docker-test: ## Run tests in Docker container
	docker run --rm -v $(PWD)/test-results:/app/test-results -v $(PWD)/playwright-report:/app/playwright-report playwright-e2e-tests

docker-test-headed: ## Run tests in Docker with headed mode
	docker run --rm -v $(PWD)/test-results:/app/test-results -v $(PWD)/playwright-report:/app/playwright-report playwright-e2e-tests npm run test:headed

docker-shell: ## Open shell in Docker container
	docker run --rm -it -v $(PWD)/test-results:/app/test-results -v $(PWD)/playwright-report:/app/playwright-report playwright-e2e-tests /bin/bash

docker-compose-test: ## Run tests using Docker Compose
	docker-compose up --build playwright-tests

docker-compose-report: ## Start report server using Docker Compose
	docker-compose up --build report-server

docker-clean: ## Clean Docker images and containers
	docker system prune -f
	docker rmi playwright-e2e-tests || true

docker-rebuild: docker-clean docker-build ## Clean and rebuild Docker image

# CI/CD commands
ci-lint: ## Run all linting and type checks for CI
	npm run lint
	npm run format:check
	npm run type-check

ci-test: ## Run tests with CI setup
	npm ci
	npm test

ci-docker-test: ## Run Docker tests for CI
	docker build -t playwright-e2e-tests .
	docker run --rm -v $(PWD)/test-results:/app/test-results -v $(PWD)/playwright-report:/app/playwright-report playwright-e2e-tests

ci-all: ci-lint ci-test ## Run complete CI pipeline locally