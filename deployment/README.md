# API Server Deployment Guide

## AWS EC2 Deployment

This guide covers deploying the Mock API Server to AWS EC2.

### Prerequisites

1. AWS CLI installed and configured
2. SSH key pair for EC2 access
3. Security group allowing HTTP/HTTPS traffic

### Quick Deployment

#### 1. Launch EC2 Instance

```bash
# Create security group
aws ec2 create-security-group \
  --group-name playwright-api-sg \
  --description "Security group for Playwright Mock API Server"

# Add rules for HTTP, HTTPS, and SSH
aws ec2 authorize-security-group-ingress \
  --group-name playwright-api-sg \
  --protocol tcp \
  --port 22 \
  --cidr 0.0.0.0/0

aws ec2 authorize-security-group-ingress \
  --group-name playwright-api-sg \
  --protocol tcp \
  --port 80 \
  --cidr 0.0.0.0/0

aws ec2 authorize-security-group-ingress \
  --group-name playwright-api-sg \
  --protocol tcp \
  --port 443 \
  --cidr 0.0.0.0/0

aws ec2 authorize-security-group-ingress \
  --group-name playwright-api-sg \
  --protocol tcp \
  --port 3000 \
  --cidr 0.0.0.0/0

# Launch EC2 instance (replace with your key pair name)
aws ec2 run-instances \
  --image-id ami-0c02fb55956c7d316 \
  --count 1 \
  --instance-type t2.micro \
  --key-name YOUR_KEY_PAIR_NAME \
  --security-groups playwright-api-sg \
  --tag-specifications 'ResourceType=instance,Tags=[{Key=Name,Value=playwright-mock-api}]'
```

#### 2. Deploy Application

Use the deployment script:

```bash
# Make deployment script executable
chmod +x deployment/deploy.sh

# Deploy to EC2 (replace with your instance details)
./deployment/deploy.sh YOUR_EC2_IP YOUR_KEY_PATH
```

#### 3. Manual Deployment Steps

If you prefer manual deployment:

```bash
# 1. Connect to your EC2 instance
ssh -i YOUR_KEY_PATH.pem ec2-user@YOUR_EC2_IP

# 2. Install Node.js and npm
curl -fsSL https://rpm.nodesource.com/setup_18.x | sudo bash -
sudo yum install -y nodejs git

# 3. Clone your repository
git clone https://github.com/yuzhangoscar/playwright-e2e-fpmarket-demo.git
cd playwright-e2e-fpmarket-demo

# 4. Install dependencies
npm install

# 5. Build the API server
npm run api:build

# 6. Install PM2 for process management
sudo npm install -g pm2

# 7. Start the application with PM2
pm2 start dist/server.js --name "playwright-api"
pm2 startup
pm2 save

# 8. Setup Nginx (optional, for production)
sudo yum install -y nginx
sudo systemctl start nginx
sudo systemctl enable nginx
```

### Environment Configuration

Create environment file for production:

```bash
# Create .env file
cat > .env << EOF
NODE_ENV=production
PORT=3000
API_BASE_URL=http://your-ec2-ip:3000
LOG_LEVEL=info
CORS_ORIGIN=*
EOF
```

### Monitoring and Logs

```bash
# View application logs
pm2 logs playwright-api

# Monitor application
pm2 monit

# Restart application
pm2 restart playwright-api

# View system logs
sudo journalctl -u nginx -f
```

### Health Checks

Test your deployment:

```bash
# Health check
curl http://YOUR_EC2_IP:3000/api/health

# Blacklist check
curl http://YOUR_EC2_IP:3000/api/blacklist

# Specific name check
curl http://YOUR_EC2_IP:3000/api/blacklist/check/malicious_user
```

### SSL/HTTPS Setup (Optional)

For production with SSL:

```bash
# Install Certbot
sudo yum install -y certbot python3-certbot-nginx

# Get SSL certificate (replace with your domain)
sudo certbot --nginx -d your-domain.com

# Auto-renewal
sudo systemctl enable certbot-renew.timer
```

### Troubleshooting

#### Common Issues

1. **Port 3000 not accessible**: Check security group rules
2. **Application won't start**: Check Node.js version and dependencies
3. **Nginx proxy errors**: Check Nginx configuration
4. **SSL certificate issues**: Ensure domain points to EC2 IP

#### Logs Location

- Application logs: `pm2 logs`
- Nginx logs: `/var/log/nginx/`
- System logs: `journalctl`

### Scaling Considerations

For production use:

1. Use Application Load Balancer
2. Auto Scaling Groups
3. RDS for data persistence
4. CloudWatch for monitoring
5. S3 for static assets
6. CloudFront for CDN

### Cost Optimization

- Use t2.micro for testing (free tier eligible)
- Stop instances when not in use
- Use Reserved Instances for long-term use
- Monitor costs with AWS Cost Explorer
