.PHONY: help setup test test-allure test-accessibility test-wcag-basic test-wcag test-wcag-all test-wcag-modal accessibility-report lint format docker-test-e2e docker-test-api docker-test-wcag docker-test-all docker-reports docker-api-server docker-test docker-test-html docker-clean docker-validate ci-validate clean allure-generate allure-serve allure-open

# Default target
help: ## Show this help message
	@echo "Available commands:"
	@grep -E '^[a-zA-Z_-]+:.*?## .*$$' $(MAKEFILE_LIST) | sort | awk 'BEGIN {FS = ":.*?## "}; {printf "\033[36m%-20s\033[0m %s\n", $$1, $$2}'

setup: ## Complete setup: install dependencies and browsers
	npm install
	npx playwright install

test: ## Run all tests
	npm test

test-allure: ## Run tests with Allure reporter
	npm run test:allure

test-allure-html: ## Run tests and generate HTML report in one step
	npm run test:allure && npm run allure:generate && npm run allure:open

test-accessibility: ## Run all accessibility tests
	npm run test:accessibility

test-wcag-basic: ## Run basic WCAG 2.1 AA compliance test
	npm run test:wcag:basic

test-wcag: ## Run WCAG 2.1 Level A & AA compliance tests
	npm run test:wcag

test-wcag-all: ## Run complete WCAG 2.1/2.2 test suite (A, AA, AAA)
	npm run test:wcag:all

test-wcag-modal: ## Test modal dismissal functionality
	npm run test:wcag:modal

accessibility-report: ## Open accessibility test report
	npx playwright show-report accessibility-report

allure-generate: ## Generate Allure report
	npm run allure:generate

allure-serve: ## Serve Allure report (auto-opens browser)
	npm run allure:serve

allure-open: ## Open existing Allure report
	npm run allure:open

lint: ## Run linting and formatting checks
	npm run lint
	npm run format:check

format: ## Format code with Prettier
	npm run format

docker-test-e2e: ## Run E2E tests in Docker container
	docker-compose up --build e2e-tests

docker-test-api: ## Run API tests in Docker container  
	docker-compose up --build api-tests

docker-test-wcag: ## Run WCAG accessibility tests in Docker container
	docker-compose up --build wcag-tests

docker-test-all: ## Run all test suites in Docker containers
	docker-compose up --build e2e-tests api-tests wcag-tests

docker-reports: ## Start report servers for E2E and WCAG tests
	docker-compose up --build e2e-report-server wcag-report-server

docker-api-server: ## Start API server in Docker container
	docker-compose up --build api-server

docker-test: ## Run E2E tests in Docker (legacy command for backward compatibility)
	make docker-test-e2e

docker-test-html: ## Run Docker E2E tests and generate HTML Allure report
	make docker-test-e2e && npm run allure:generate && npm run allure:open

docker-clean: ## Clean up Docker containers and volumes
	docker-compose down -v
	docker system prune -f

docker-validate: ## Validate Docker setup and configuration
	./scripts/validate-docker-setup.sh

ci-validate: ## Test CI pipeline setup locally
	./scripts/validate-ci-setup.sh

clean: ## Clean generated files and dependencies
	rm -rf node_modules package-lock.json test-results/ playwright-report/ blob-report/ allure-results/ allure-report/ accessibility-report/ accessibility-results.json accessibility-results.xml
	npm install