#!/bin/bash

# CloudFormation deployment helper script
# Usage: ./cloudformation-deploy.sh <stack-name> <key-pair-name> [instance-type]

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Configuration
STACK_NAME=$1
KEY_PAIR_NAME=$2
INSTANCE_TYPE=${3:-t2.micro}
TEMPLATE_FILE="deployment/cloudformation.yaml"

# Validate inputs
if [ -z "$STACK_NAME" ] || [ -z "$KEY_PAIR_NAME" ]; then
    echo -e "${RED}Error: Missing required parameters${NC}"
    echo "Usage: $0 <stack-name> <key-pair-name> [instance-type]"
    echo "Example: $0 playwright-api-stack my-key-pair t2.micro"
    exit 1
fi

if [ ! -f "$TEMPLATE_FILE" ]; then
    echo -e "${RED}Error: CloudFormation template not found: $TEMPLATE_FILE${NC}"
    exit 1
fi

echo -e "${GREEN}Deploying CloudFormation stack: $STACK_NAME${NC}"
echo -e "${YELLOW}Key Pair: $KEY_PAIR_NAME${NC}"
echo -e "${YELLOW}Instance Type: $INSTANCE_TYPE${NC}"

# Check if AWS CLI is installed and configured
if ! command -v aws &> /dev/null; then
    echo -e "${RED}Error: AWS CLI is not installed${NC}"
    exit 1
fi

# Validate AWS credentials
if ! aws sts get-caller-identity &> /dev/null; then
    echo -e "${RED}Error: AWS credentials not configured${NC}"
    echo "Run: aws configure"
    exit 1
fi

# Check if key pair exists
if ! aws ec2 describe-key-pairs --key-names "$KEY_PAIR_NAME" &> /dev/null; then
    echo -e "${RED}Error: Key pair '$KEY_PAIR_NAME' not found${NC}"
    echo "Available key pairs:"
    aws ec2 describe-key-pairs --query 'KeyPairs[].KeyName' --output table
    exit 1
fi

# Validate CloudFormation template
echo -e "${YELLOW}Validating CloudFormation template...${NC}"
if ! aws cloudformation validate-template --template-body file://$TEMPLATE_FILE &> /dev/null; then
    echo -e "${RED}Error: Invalid CloudFormation template${NC}"
    aws cloudformation validate-template --template-body file://$TEMPLATE_FILE
    exit 1
fi
echo -e "${GREEN}✓ Template validation passed${NC}"

# Check if stack already exists
STACK_EXISTS=$(aws cloudformation describe-stacks --stack-name "$STACK_NAME" 2>/dev/null || echo "false")

if [ "$STACK_EXISTS" != "false" ]; then
    echo -e "${YELLOW}Stack '$STACK_NAME' already exists. Updating...${NC}"
    
    aws cloudformation update-stack \
        --stack-name "$STACK_NAME" \
        --template-body file://$TEMPLATE_FILE \
        --parameters \
            ParameterKey=KeyPairName,ParameterValue="$KEY_PAIR_NAME" \
            ParameterKey=InstanceType,ParameterValue="$INSTANCE_TYPE" \
        --capabilities CAPABILITY_IAM

    echo -e "${YELLOW}Waiting for stack update to complete...${NC}"
    aws cloudformation wait stack-update-complete --stack-name "$STACK_NAME"
else
    echo -e "${YELLOW}Creating new stack '$STACK_NAME'...${NC}"
    
    aws cloudformation create-stack \
        --stack-name "$STACK_NAME" \
        --template-body file://$TEMPLATE_FILE \
        --parameters \
            ParameterKey=KeyPairName,ParameterValue="$KEY_PAIR_NAME" \
            ParameterKey=InstanceType,ParameterValue="$INSTANCE_TYPE" \
        --capabilities CAPABILITY_IAM \
        --tags \
            Key=Project,Value=playwright-e2e-mock-api \
            Key=Environment,Value=production

    echo -e "${YELLOW}Waiting for stack creation to complete...${NC}"
    aws cloudformation wait stack-create-complete --stack-name "$STACK_NAME"
fi

# Get stack outputs
echo -e "${GREEN}Getting stack outputs...${NC}"
OUTPUTS=$(aws cloudformation describe-stacks --stack-name "$STACK_NAME" --query 'Stacks[0].Outputs' --output json)

# Extract key information
INSTANCE_ID=$(echo "$OUTPUTS" | jq -r '.[] | select(.OutputKey=="InstanceId") | .OutputValue')
PUBLIC_IP=$(echo "$OUTPUTS" | jq -r '.[] | select(.OutputKey=="PublicIP") | .OutputValue')
ELASTIC_IP=$(echo "$OUTPUTS" | jq -r '.[] | select(.OutputKey=="ElasticIP") | .OutputValue')
HEALTH_ENDPOINT=$(echo "$OUTPUTS" | jq -r '.[] | select(.OutputKey=="HealthEndpoint") | .OutputValue')
BLACKLIST_ENDPOINT=$(echo "$OUTPUTS" | jq -r '.[] | select(.OutputKey=="BlacklistEndpoint") | .OutputValue')
SSH_COMMAND=$(echo "$OUTPUTS" | jq -r '.[] | select(.OutputKey=="SSHCommand") | .OutputValue')

echo -e "\n${GREEN}🎉 Stack deployment completed successfully!${NC}"
echo -e "\n${YELLOW}Stack Information:${NC}"
echo -e "  Stack Name: $STACK_NAME"
echo -e "  Instance ID: $INSTANCE_ID"
echo -e "  Public IP: $PUBLIC_IP"
echo -e "  Elastic IP: $ELASTIC_IP"

echo -e "\n${YELLOW}API Endpoints:${NC}"
echo -e "  Health Check: $HEALTH_ENDPOINT"
echo -e "  Blacklist API: $BLACKLIST_ENDPOINT"
echo -e "  Check Name: $BLACKLIST_ENDPOINT/check/{name}"

echo -e "\n${YELLOW}SSH Access:${NC}"
echo -e "  Command: $SSH_COMMAND"

echo -e "\n${YELLOW}Waiting for instance to be ready...${NC}"
sleep 30

echo -e "${YELLOW}Testing endpoints...${NC}"
for i in {1..5}; do
    echo "Health check attempt $i/5..."
    if curl -f -s "$HEALTH_ENDPOINT" > /dev/null 2>&1; then
        echo -e "${GREEN}✓ API server is responding${NC}"
        
        echo -e "\n${YELLOW}Testing API endpoints:${NC}"
        echo -e "Health check:"
        curl -s "$HEALTH_ENDPOINT" | jq . 2>/dev/null || curl -s "$HEALTH_ENDPOINT"
        
        echo -e "\n\nBlacklist check:"
        curl -s "$BLACKLIST_ENDPOINT/check/malicious_user" | jq . 2>/dev/null || curl -s "$BLACKLIST_ENDPOINT/check/malicious_user"
        
        break
    else
        echo "Waiting for service to start..."
        sleep 10
    fi
done

echo -e "\n${YELLOW}Management Commands:${NC}"
echo -e "  View Logs: aws logs tail /aws/ec2/playwright-api --follow"
echo -e "  Delete Stack: aws cloudformation delete-stack --stack-name $STACK_NAME"
echo -e "  Stack Status: aws cloudformation describe-stacks --stack-name $STACK_NAME"

echo -e "\n${GREEN}Deployment completed!${NC}"