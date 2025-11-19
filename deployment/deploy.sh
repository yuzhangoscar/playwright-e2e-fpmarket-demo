#!/bin/bash

# Playwright Mock API Server Deployment Script for AWS EC2
# Usage: ./deploy.sh <EC2_IP> <KEY_PATH> [branch]

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Configuration
EC2_IP=$1
KEY_PATH=$2
BRANCH=${3:-main}
EC2_USER="ec2-user"
APP_NAME="playwright-api"
REMOTE_DIR="/home/$EC2_USER/playwright-e2e-fpmarket-demo"
SERVICE_PORT=3000

# Validate inputs
if [ -z "$EC2_IP" ] || [ -z "$KEY_PATH" ]; then
    echo -e "${RED}Error: Missing required parameters${NC}"
    echo "Usage: $0 <EC2_IP> <KEY_PATH> [branch]"
    echo "Example: $0 54.123.45.67 ~/.ssh/my-key.pem main"
    exit 1
fi

if [ ! -f "$KEY_PATH" ]; then
    echo -e "${RED}Error: SSH key file not found: $KEY_PATH${NC}"
    exit 1
fi

echo -e "${GREEN}Starting deployment to EC2 instance: $EC2_IP${NC}"
echo -e "${YELLOW}Branch: $BRANCH${NC}"

# Test SSH connection
echo -e "${YELLOW}Testing SSH connection...${NC}"
if ! ssh -i "$KEY_PATH" -o ConnectTimeout=10 -o BatchMode=yes "$EC2_USER@$EC2_IP" exit 2>/dev/null; then
    echo -e "${RED}Error: Cannot connect to EC2 instance. Check IP and key path.${NC}"
    exit 1
fi
echo -e "${GREEN}SSH connection successful${NC}"

# Function to run commands on remote server
run_remote() {
    ssh -i "$KEY_PATH" "$EC2_USER@$EC2_IP" "$@"
}

# Function to copy files to remote server
copy_to_remote() {
    scp -i "$KEY_PATH" -r "$1" "$EC2_USER@$EC2_IP:$2"
}

echo -e "${YELLOW}Installing system dependencies...${NC}"
run_remote "
    # Update system
    sudo yum update -y
    
    # Install Node.js 18
    if ! command -v node &> /dev/null; then
        curl -fsSL https://rpm.nodesource.com/setup_18.x | sudo bash -
        sudo yum install -y nodejs
    fi
    
    # Install Git
    sudo yum install -y git
    
    # Install PM2 globally if not exists
    if ! command -v pm2 &> /dev/null; then
        sudo npm install -g pm2
    fi
    
    # Verify installations
    echo 'Node.js version:' \$(node --version)
    echo 'npm version:' \$(npm --version)
    echo 'PM2 version:' \$(pm2 --version)
"

echo -e "${YELLOW}Deploying application code...${NC}"
run_remote "
    # Create app directory if it doesn't exist
    mkdir -p $REMOTE_DIR
    
    # If directory exists and has git, pull latest changes
    if [ -d \"$REMOTE_DIR/.git\" ]; then
        echo 'Updating existing repository...'
        cd $REMOTE_DIR
        git fetch origin
        git reset --hard origin/$BRANCH
    else
        echo 'Cloning repository...'
        rm -rf $REMOTE_DIR
        git clone -b $BRANCH https://github.com/yuzhangoscar/playwright-e2e-fpmarket-demo.git $REMOTE_DIR
    fi
"

echo -e "${YELLOW}Installing application dependencies...${NC}"
run_remote "
    cd $REMOTE_DIR
    
    # Install dependencies
    npm install --production=false
    
    # Build TypeScript
    npm run api:build
    
    # Verify build
    if [ ! -f 'dist/server.js' ]; then
        echo 'Error: Build failed - server.js not found'
        exit 1
    fi
"

echo -e "${YELLOW}Setting up environment configuration...${NC}"
run_remote "
    cd $REMOTE_DIR
    
    # Create production environment file
    cat > .env << EOF
NODE_ENV=production
PORT=$SERVICE_PORT
LOG_LEVEL=info
CORS_ORIGIN=*
EOF
    
    echo 'Environment configuration created'
"

echo -e "${YELLOW}Configuring PM2 process management...${NC}"
run_remote "
    cd $REMOTE_DIR
    
    # Create PM2 ecosystem file
    cat > ecosystem.config.js << EOF
module.exports = {
  apps: [{
    name: '$APP_NAME',
    script: './dist/server.js',
    instances: 1,
    autorestart: true,
    watch: false,
    max_memory_restart: '1G',
    env: {
      NODE_ENV: 'production',
      PORT: $SERVICE_PORT
    },
    error_file: './logs/err.log',
    out_file: './logs/out.log',
    log_file: './logs/combined.log',
    time: true
  }]
};
EOF
    
    # Create logs directory
    mkdir -p logs
    
    # Stop existing process if running
    pm2 delete $APP_NAME 2>/dev/null || true
    
    # Start the application
    pm2 start ecosystem.config.js
    
    # Setup PM2 startup
    pm2 startup | tail -n 1 | sudo bash || true
    pm2 save
    
    echo 'PM2 configuration complete'
"

echo -e "${YELLOW}Configuring firewall...${NC}"
run_remote "
    # Check if firewalld is running
    if sudo systemctl is-active --quiet firewalld; then
        echo 'Configuring firewalld...'
        sudo firewall-cmd --permanent --add-port=$SERVICE_PORT/tcp
        sudo firewall-cmd --reload
    else
        echo 'Firewalld not active, skipping firewall configuration'
    fi
"

echo -e "${YELLOW}Running health checks...${NC}"
sleep 5  # Give the service time to start

# Health check function
health_check() {
    local retries=5
    local count=0
    
    while [ $count -lt $retries ]; do
        echo "Health check attempt $((count + 1))/$retries..."
        
        if run_remote "curl -f -s http://localhost:$SERVICE_PORT/api/health" > /dev/null 2>&1; then
            echo -e "${GREEN}✓ Health check passed${NC}"
            return 0
        fi
        
        count=$((count + 1))
        sleep 3
    done
    
    echo -e "${RED}✗ Health check failed after $retries attempts${NC}"
    return 1
}

if health_check; then
    echo -e "${GREEN}Testing API endpoints...${NC}"
    
    run_remote "
        echo 'Testing health endpoint:'
        curl -s http://localhost:$SERVICE_PORT/api/health | python3 -m json.tool 2>/dev/null || curl -s http://localhost:$SERVICE_PORT/api/health
        
        echo -e '\n\nTesting blacklist endpoint:'
        curl -s http://localhost:$SERVICE_PORT/api/blacklist/check/malicious_user | python3 -m json.tool 2>/dev/null || curl -s http://localhost:$SERVICE_PORT/api/blacklist/check/malicious_user
    "
    
    echo -e "\n${GREEN}Deployment Status:${NC}"
    run_remote "pm2 status"
    
    echo -e "\n${GREEN}🎉 Deployment completed successfully!${NC}"
    echo -e "${YELLOW}API endpoints available at:${NC}"
    echo -e "  Health: http://$EC2_IP:$SERVICE_PORT/api/health"
    echo -e "  Blacklist: http://$EC2_IP:$SERVICE_PORT/api/blacklist"
    echo -e "  Check Name: http://$EC2_IP:$SERVICE_PORT/api/blacklist/check/{name}"
    
    echo -e "\n${YELLOW}Management commands:${NC}"
    echo -e "  SSH: ssh -i $KEY_PATH $EC2_USER@$EC2_IP"
    echo -e "  Logs: ssh -i $KEY_PATH $EC2_USER@$EC2_IP 'pm2 logs $APP_NAME'"
    echo -e "  Status: ssh -i $KEY_PATH $EC2_USER@$EC2_IP 'pm2 status'"
    echo -e "  Restart: ssh -i $KEY_PATH $EC2_USER@$EC2_IP 'pm2 restart $APP_NAME'"
else
    echo -e "${RED}❌ Deployment failed - service not responding${NC}"
    echo -e "${YELLOW}Check logs:${NC}"
    run_remote "pm2 logs $APP_NAME --lines 20"
    exit 1
fi