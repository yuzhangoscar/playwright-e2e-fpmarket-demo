# Mock API Server for Playwright E2E Testing

A Node.js/Express mock API server with health check and blacklist endpoints, designed to support E2E testing scenarios.

## 🚀 Quick Start

### Local Development

1. **Install Dependencies**

   ```bash
   npm install
   ```

2. **Start Development Server**

   ```bash
   npm run api:dev
   ```

   The server will start on `http://localhost:3000` with hot reloading.

3. **Build for Production**
   ```bash
   npm run api:build
   npm run api:start
   ```

### Production Deployment

#### Option 1: Manual Deployment to EC2

1. **Prerequisites**
   - EC2 instance running Amazon Linux 2
   - SSH key pair for EC2 access
   - Security group allowing traffic on port 3000

2. **Deploy**

   ```bash
   ./deployment/deploy.sh <EC2_IP> <SSH_KEY_PATH> [branch]
   ```

   Example:

   ```bash
   ./deployment/deploy.sh 54.123.45.67 ~/.ssh/my-key.pem main
   ```

#### Option 2: Infrastructure as Code with CloudFormation

1. **Prerequisites**
   - AWS CLI installed and configured
   - Existing EC2 Key Pair

2. **Deploy Infrastructure**

   ```bash
   ./deployment/cloudformation-deploy.sh <stack-name> <key-pair-name> [instance-type]
   ```

   Example:

   ```bash
   ./deployment/cloudformation-deploy.sh playwright-api-stack my-key-pair t2.micro
   ```

## 📋 API Endpoints

### Health Check Endpoints

#### Basic Health Check

```http
GET /api/health
```

**Response:**

```json
{
  "status": "healthy",
  "timestamp": "2024-11-19T10:30:00.000Z",
  "uptime": 3600,
  "version": "1.0.0",
  "environment": "production",
  "memory": {
    "used": "45MB",
    "total": "128MB",
    "percentage": "35.16%"
  },
  "pid": 12345
}
```

#### Detailed Health Check

```http
GET /api/health/detailed
```

**Response:**

```json
{
  "status": "healthy",
  "timestamp": "2024-11-19T10:30:00.000Z",
  "uptime": {
    "seconds": 3600.123,
    "human": "1h 0m 0s"
  },
  "system": {
    "platform": "linux",
    "arch": "x64",
    "nodeVersion": "v18.17.0",
    "pid": 12345,
    "ppid": 1
  },
  "memory": {
    "rss": "85MB",
    "heapTotal": "128MB",
    "heapUsed": "45MB",
    "external": "12MB",
    "percentage": "35.16%"
  },
  "environment": "production",
  "version": "1.0.0"
}
```

### Blacklist Endpoints

#### Get All Blacklisted Entries

```http
GET /api/blacklist
```

**Response:**

```json
{
  "success": true,
  "data": [
    {
      "name": "malicious_user",
      "reason": "Security threat detected",
      "addedAt": "2024-01-15T10:00:00Z",
      "addedBy": "security_team",
      "category": "security"
    }
  ],
  "metadata": {
    "total": 5,
    "categories": {
      "security": 2,
      "policy": 2,
      "compliance": 1
    },
    "lastUpdated": 1705316400000,
    "timestamp": "2024-11-19T10:30:00.000Z"
  }
}
```

#### Check if Name is Blacklisted

```http
GET /api/blacklist/check/{name}
```

**Example:**

```http
GET /api/blacklist/check/malicious_user
```

**Response (Blacklisted):**

```json
{
  "success": true,
  "name": "malicious_user",
  "isBlacklisted": true,
  "entry": {
    "name": "malicious_user",
    "reason": "Security threat detected",
    "addedAt": "2024-01-15T10:00:00Z",
    "addedBy": "security_team",
    "category": "security"
  },
  "checkedAt": "2024-11-19T10:30:00.000Z"
}
```

**Response (Not Blacklisted):**

```json
{
  "success": true,
  "name": "clean_user",
  "isBlacklisted": false,
  "checkedAt": "2024-11-19T10:30:00.000Z"
}
```

#### Get Blacklist Statistics

```http
GET /api/blacklist/stats
```

**Response:**

```json
{
  "success": true,
  "stats": {
    "total": 5,
    "categories": {
      "security": 2,
      "policy": 2,
      "compliance": 1
    },
    "lastUpdated": 1705316400000,
    "retrievedAt": "2024-11-19T10:30:00.000Z"
  }
}
```

#### Add Entry to Blacklist

```http
POST /api/blacklist
Content-Type: application/json
```

**Request Body:**

```json
{
  "name": "new_user",
  "reason": "Violation of terms",
  "addedBy": "admin",
  "category": "policy"
}
```

**Response:**

```json
{
  "success": true,
  "message": "Entry added to blacklist successfully",
  "entry": {
    "name": "new_user",
    "reason": "Violation of terms",
    "addedAt": "2024-11-19T10:30:00.000Z",
    "addedBy": "admin",
    "category": "policy"
  }
}
```

#### Remove Entry from Blacklist

```http
DELETE /api/blacklist/{name}
```

**Response:**

```json
{
  "success": true,
  "message": "Entry 'user_name' removed from blacklist successfully",
  "removedAt": "2024-11-19T10:30:00.000Z"
}
```

## 🧪 Testing

### Unit Tests

```bash
# Run API tests
npm run api:test

# Run with coverage
npm run api:test:coverage

# Run in watch mode
npm run api:test:watch
```

### Manual Testing

```bash
# Health check
curl http://localhost:3000/api/health

# Check blacklisted user
curl http://localhost:3000/api/blacklist/check/malicious_user

# Get all blacklisted entries
curl http://localhost:3000/api/blacklist
```

## 🏗️ Architecture

### Project Structure

```
src/
├── server.ts              # Main Express application
├── routes/
│   ├── health.ts         # Health check endpoints
│   └── blacklist.ts      # Blacklist management endpoints
└── data/
    └── blacklistStore.ts # In-memory blacklist data store

deployment/
├── deploy.sh             # Manual EC2 deployment script
├── cloudformation.yaml   # CloudFormation template
└── cloudformation-deploy.sh # CloudFormation deployment helper

tests/
├── api.test.ts          # API endpoint tests
└── setup.ts             # Jest test setup

dist/                    # Compiled JavaScript (build output)
```

### Technology Stack

- **Runtime:** Node.js 18+
- **Framework:** Express.js 4.18
- **Language:** TypeScript 5.9
- **Security:** Helmet, CORS
- **Logging:** Morgan
- **Testing:** Jest, Supertest
- **Process Management:** PM2 (production)
- **Deployment:** AWS CloudFormation, EC2

### Security Features

- Helmet.js for security headers
- CORS configuration
- Input validation and sanitization
- Error handling with secure error messages
- Graceful shutdown handling

## 🔧 Configuration

### Environment Variables

```bash
NODE_ENV=production        # Environment (development/production)
PORT=3000                 # Server port
LOG_LEVEL=info            # Logging level
CORS_ORIGIN=*             # CORS allowed origins
```

### Development Configuration

- Hot reloading with nodemon
- TypeScript compilation with ts-node
- Source maps enabled
- Detailed error messages

### Production Configuration

- Compiled JavaScript execution
- PM2 process management
- CloudWatch logging (EC2 deployment)
- Security-optimized error responses

## 📊 Monitoring

### Health Monitoring

- Basic health endpoint for uptime checks
- Detailed health endpoint with system metrics
- Memory usage tracking
- Process information

### Logging

- Request logging with Morgan
- Error logging
- PM2 log management
- CloudWatch integration (AWS deployment)

## 🚨 Error Handling

The API includes comprehensive error handling:

- **400 Bad Request:** Invalid input parameters
- **404 Not Found:** Resource or endpoint not found
- **409 Conflict:** Duplicate entries
- **500 Internal Server Error:** Server-side errors

All error responses follow a consistent format:

```json
{
  "success": false,
  "error": "Error Type",
  "message": "Detailed error message"
}
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Add tests for new functionality
4. Ensure all tests pass: `npm run api:test`
5. Submit a pull request

## 📄 License

MIT License - see LICENSE file for details.

---

**Note:** This is a mock API server designed for testing purposes. In production scenarios, consider using a proper database instead of the in-memory data store.
