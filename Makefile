.PHONY: help setup test test-allure lint format docker-test clean allure-generate allure-serve allure-open

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

docker-test: ## Run tests in Docker container
	docker build -t playwright-e2e-tests .
	docker run --rm -v $(PWD)/test-results:/app/test-results -v $(PWD)/playwright-report:/app/playwright-report -v $(PWD)/allure-results:/app/allure-results playwright-e2e-tests

clean: ## Clean generated files and dependencies
	rm -rf node_modules package-lock.json test-results/ playwright-report/ blob-report/
	npm install