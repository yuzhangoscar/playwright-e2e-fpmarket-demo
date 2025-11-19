# AWS Deployment Setup Guide

This guide explains how to set up automated AWS EC2 deployment for your Playwright E2E testing project with the mock API server.

## 🎯 Deployment Options

### Option 1: Automated CI/CD Deployment (Recommended)

The GitHub Actions workflow automatically deploys the API server to AWS EC2 when code is pushed to the `main` branch.

### Option 2: Manual Deployment

Use the deployment scripts locally for manual deployment.

## 🔐 Required GitHub Secrets

To enable automated AWS deployment, you need to configure the following secrets in your GitHub repository:

### Repository Settings → Secrets and variables → Actions

| Secret Name             | Description                                   | Example                              |
| ----------------------- | --------------------------------------------- | ------------------------------------ |
| `AWS_ACCESS_KEY_ID`     | AWS Access Key ID with EC2 permissions        | `AKIA...`                            |
| `AWS_SECRET_ACCESS_KEY` | AWS Secret Access Key                         | `wJalrXUt...`                        |
| `EC2_HOST`              | Public IP address or DNS of your EC2 instance | `54.123.45.67`                       |
| `EC2_SSH_KEY`           | Private SSH key content (entire .pem file)    | `-----BEGIN RSA PRIVATE KEY-----...` |

## 🏗️ AWS Infrastructure Setup

### Prerequisites

1. **AWS Account** with appropriate permissions
2. **EC2 Key Pair** created in your AWS region
3. **EC2 Instance** (Amazon Linux 2 recommended)

### Step 1: Create EC2 Instance (Manual)

```bash
# Launch EC2 instance
aws ec2 run-instances \
  --image-id ami-0c02fb55956c7d316 \
  --count 1 \
  --instance-type t2.micro \
  --key-name your-key-pair \
  --security-group-ids sg-xxxxxxxxx \
  --tag-specifications 'ResourceType=instance,Tags=[{Key=Name,Value=playwright-api-server}]'
```

### Step 2: Configure Security Group

Allow the following inbound traffic:

```bash
# SSH access (port 22)
aws ec2 authorize-security-group-ingress \
  --group-id sg-xxxxxxxxx \
  --protocol tcp \
  --port 22 \
  --cidr 0.0.0.0/0

# API server (port 3000)
aws ec2 authorize-security-group-ingress \
  --group-id sg-xxxxxxxxx \
  --protocol tcp \
  --port 3000 \
  --cidr 0.0.0.0/0
```

### Step 3: CloudFormation Deployment (Automated)

Use the provided CloudFormation template for complete infrastructure setup:

```bash
# Deploy infrastructure
./deployment/cloudformation-deploy.sh playwright-api-stack your-key-pair-name t2.micro

# This creates:
# - EC2 instance with auto-setup
# - Security groups with proper rules
# - Elastic IP for static addressing
# - CloudWatch monitoring
# - Automatic application deployment
```

## 📝 Setting Up GitHub Secrets

### 1. AWS Credentials

Create an IAM user with the following policies:

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Action": [
        "ec2:DescribeInstances",
        "ec2:DescribeKeyPairs",
        "logs:CreateLogGroup",
        "logs:CreateLogStream",
        "logs:PutLogEvents"
      ],
      "Resource": "*"
    }
  ]
}
```

### 2. EC2 SSH Key

```bash
# If using existing key pair
cat ~/.ssh/your-key.pem

# Copy entire content including headers:
# -----BEGIN RSA PRIVATE KEY-----
# ...key content...
# -----END RSA PRIVATE KEY-----
```

### 3. EC2 Host Information

```bash
# Get public IP of your instance
aws ec2 describe-instances \
  --instance-ids i-1234567890abcdef0 \
  --query 'Reservations[0].Instances[0].PublicIpAddress' \
  --output text

# Or get Elastic IP
aws ec2 describe-addresses \
  --allocation-ids eipalloc-12345678 \
  --query 'Addresses[0].PublicIp' \
  --output text
```

## 🚀 Deployment Process

### Automated Deployment (CI/CD)

1. **Push to main branch** triggers the workflow
2. **API tests run** to ensure code quality
3. **E2E tests execute** for full validation
4. **Allure reports deploy** to GitHub Pages
5. **API server deploys** to AWS EC2 (if secrets configured)

### Manual Deployment

```bash
# Deploy to existing EC2 instance
./deployment/deploy.sh 54.123.45.67 ~/.ssh/your-key.pem main

# Deploy with CloudFormation
./deployment/cloudformation-deploy.sh my-stack my-key-pair t2.micro
```

## 📊 Monitoring & Verification

### Health Checks

After deployment, verify the API server:

```bash
# Basic health check
curl http://your-ec2-ip:3000/api/health

# Detailed health check
curl http://your-ec2-ip:3000/api/health/detailed

# Test blacklist functionality
curl http://your-ec2-ip:3000/api/blacklist/check/malicious_user
```

### Logs and Debugging

```bash
# SSH to EC2 instance
ssh -i ~/.ssh/your-key.pem ec2-user@your-ec2-ip

# Check PM2 logs
pm2 logs playwright-api

# Check PM2 status
pm2 status

# Restart if needed
pm2 restart playwright-api
```

### CloudWatch Monitoring (CloudFormation deployment)

- **Application logs**: `/aws/ec2/playwright-api`
- **System metrics**: CPU, memory, disk usage
- **Custom metrics**: API response times, error rates

## 🔧 Configuration

### Environment Variables

The deployment automatically configures:

```bash
NODE_ENV=production
PORT=3000
LOG_LEVEL=info
CORS_ORIGIN=*
```

### Custom Configuration

Modify `deployment/deploy.sh` or `deployment/cloudformation.yaml` for:

- Different ports
- SSL/TLS certificates
- Load balancer configuration
- Auto-scaling settings

## 🛡️ Security Considerations

### Production Recommendations

1. **Restrict SSH access** to specific IP ranges
2. **Use SSL/TLS** for API endpoints
3. **Configure firewall rules** properly
4. **Regular security updates** for the OS
5. **Monitor access logs** for suspicious activity

### GitHub Secrets Security

1. **Rotate keys regularly**
2. **Use principle of least privilege** for IAM users
3. **Monitor secret usage** in audit logs
4. **Consider using** GitHub OIDC for enhanced security

## 🔄 Rollback and Recovery

### Quick Rollback

```bash
# SSH to EC2 instance
ssh -i ~/.ssh/your-key.pem ec2-user@your-ec2-ip

# Switch to previous version
cd /home/ec2-user/playwright-e2e-fpmarket-demo
git checkout previous-commit-hash
npm install
npm run api:build
pm2 restart playwright-api
```

### Full Recovery

```bash
# Redeploy from scratch
./deployment/deploy.sh your-ec2-ip ~/.ssh/your-key.pem main
```

## 📈 Cost Optimization

### AWS Cost Management

- **Use t2.micro** for development (free tier eligible)
- **Stop instances** when not needed
- **Use Spot instances** for cost savings
- **Set up billing alerts** for monitoring costs

### Resource Monitoring

```bash
# Monitor instance usage
aws cloudwatch get-metric-statistics \
  --namespace AWS/EC2 \
  --metric-name CPUUtilization \
  --dimensions Name=InstanceId,Value=i-1234567890abcdef0 \
  --statistics Average \
  --start-time 2024-01-01T00:00:00Z \
  --end-time 2024-01-02T00:00:00Z \
  --period 3600
```

## 🆘 Troubleshooting

### Common Issues

| Issue                     | Solution                                    |
| ------------------------- | ------------------------------------------- |
| SSH connection failed     | Check security group rules, key permissions |
| Deployment script fails   | Verify SSH key format, EC2 instance status  |
| API server not responding | Check PM2 status, review logs               |
| GitHub Actions fails      | Verify all required secrets are set         |

### Debug Commands

```bash
# Test SSH connectivity
ssh -i ~/.ssh/your-key.pem -o ConnectTimeout=10 ec2-user@your-ec2-ip exit

# Check deployment script locally
bash -x ./deployment/deploy.sh your-ec2-ip ~/.ssh/your-key.pem main

# Validate CloudFormation template
aws cloudformation validate-template --template-body file://deployment/cloudformation.yaml
```

## 📞 Support

For issues related to:

- **AWS Infrastructure**: Check AWS documentation or contact AWS Support
- **GitHub Actions**: Review workflow logs and GitHub Actions documentation
- **Application Issues**: Check the main project README and API documentation

---

**Note**: This setup is designed for development and testing environments. For production use, consider additional security hardening, monitoring, and backup strategies.
