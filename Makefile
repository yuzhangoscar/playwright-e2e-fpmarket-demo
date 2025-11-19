.PHONY: help setup test test-allure test-accessibility lint lint-fix format docker-test-e2e docker-test-e2e-serve docker-test-api docker-test-wcag docker-test-all docker-reports docker-clean allure-generate allure-serve allure-open clean

# Default target
help: ## Show this help message
	@echo "Essential Commands:"
	@echo ""
	@echo "🔧 Setup & Development:"
	@grep -E '^(setup|lint|lint-fix|format|clean):.*?## .*$$' $(MAKEFILE_LIST) | awk 'BEGIN {FS = ":.*?## "}; {printf "  \033[36m%-20s\033[0m %s\n", $$1, $$2}'
	@echo ""
	@echo "🧪 Local Testing:"
	@grep -E '^(test|test-allure|test-accessibility):.*?## .*$$' $(MAKEFILE_LIST) | awk 'BEGIN {FS = ":.*?## "}; {printf "  \033[36m%-20s\033[0m %s\n", $$1, $$2}'
	@echo ""
	@echo "🐳 Docker Testing:"
	@grep -E '^(docker-test-e2e|docker-test-e2e-serve|docker-test-api|docker-test-wcag|docker-test-all|docker-reports|docker-clean):.*?## .*$$' $(MAKEFILE_LIST) | awk 'BEGIN {FS = ":.*?## "}; {printf "  \033[36m%-20s\033[0m %s\n", $$1, $$2}'
	@echo ""
	@echo "📊 Allure Reports:"
	@grep -E '^(allure-generate|allure-serve|allure-open):.*?## .*$$' $(MAKEFILE_LIST) | awk 'BEGIN {FS = ":.*?## "}; {printf "  \033[36m%-20s\033[0m %s\n", $$1, $$2}'

# 🔧 Setup & Development
setup: ## Complete project setup
	npm install
	npx playwright install

lint: ## Run ESLint and Prettier checks  
	npm run lint
	npm run format:check

lint-fix: ## Auto-fix ESLint and Prettier issues
	npm run lint:fix
	npm run format

format: ## Auto-format code with Prettier
	npm run format

clean: ## Clean generated files and reinstall
	rm -rf node_modules package-lock.json test-results/ playwright-report/ allure-results/ allure-report/ accessibility-report/ accessibility-results.json accessibility-results.xml
	npm install

# 🧪 Local Testing
test: ## Run all E2E tests locally
	npm test

test-allure: ## Run tests with Allure reporting
	npm run test:allure

test-accessibility: ## Run WCAG accessibility tests
	npm run test:accessibility

# 🐳 Docker Testing (Recommended)
docker-test-e2e: ## Run E2E tests in Docker (generates Allure HTML)
	docker-compose up --build e2e-tests

docker-test-e2e-serve: ## Run E2E tests + serve report at :9001
	docker-compose up --build e2e-tests
	@echo "Starting Allure report server at http://localhost:9001"
	docker-compose up --build e2e-allure-server

docker-test-api: ## Run API server tests in Docker
	docker-compose up --build api-tests

docker-test-wcag: ## Run WCAG accessibility tests in Docker
	docker-compose up --build wcag-tests

docker-test-all: ## Run all test suites in Docker
	docker-compose up --build e2e-tests api-tests wcag-tests

docker-reports: ## Start all report servers (E2E: :9001, API: :9002)
	docker-compose up --build e2e-allure-server api-allure-server

docker-clean: ## Clean Docker containers and volumes
	docker-compose down -v
	docker system prune -f

# 📊 Allure Reports
allure-generate: ## Generate HTML report from results
	npm run allure:generate

allure-serve: ## Generate and auto-open report in browser
	npm run allure:serve

allure-open: ## Open existing HTML report
	npm run allure:open