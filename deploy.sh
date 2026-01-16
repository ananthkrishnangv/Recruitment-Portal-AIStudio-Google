
#!/bin/bash

# CSIR-SERC Portal Automated Deployment Script
# Supports: Rocky Linux 9, AlmaLinux, RHEL 9, Ubuntu 24.04

set -e

GREEN='\033[0;32m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${BLUE}Starting CSIR-SERC Recruitment Portal Deployment...${NC}"

# 1. Detect OS
if [ -f /etc/os-release ]; then
    . /etc/os-release
    OS=$ID
else
    echo "Unsupported Operating System"
    exit 1
fi

echo -e "${GREEN}Detected OS: $OS${NC}"

# 2. Install Dependencies
echo -e "${BLUE}Installing System Dependencies...${NC}"
if [[ "$OS" == "rocky" || "$OS" == "almalinux" || "$OS" == "rhel" || "$OS" == "ol" ]]; then
    sudo dnf update -y
    sudo dnf install -y curl git nginx tar policycoreutils-python-utils
    
    # Install Node 20
    curl -fsSL https://rpm.nodesource.com/setup_20.x | sudo bash -
    sudo dnf install -y nodejs
elif [[ "$OS" == "ubuntu" || "$OS" == "debian" ]]; then
    sudo apt update && sudo apt upgrade -y
    sudo apt install -y curl git nginx tar
    
    # Install Node 20
    curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
    sudo apt install -y nodejs
else
    echo "OS not explicitly supported by this script."
    exit 1
fi

# 3. Build Application
echo -e "${BLUE}Building Application Artifacts...${NC}"
npm ci
npm run build

# 4. Deploy to Web Root
echo -e "${BLUE}Deploying to /var/www/csir-portal...${NC}"
sudo mkdir -p /var/www/csir-portal
sudo rm -rf /var/www/csir-portal/*
sudo cp -r dist/* /var/www/csir-portal/

# 5. Configure Permissions
echo -e "${BLUE}Setting Permissions...${NC}"
if [[ "$OS" == "ubuntu" || "$OS" == "debian" ]]; then
    sudo chown -R www-data:www-data /var/www/csir-portal
else
    sudo chown -R nginx:nginx /var/www/csir-portal
    # SELinux Context for RHEL-based systems
    sudo chcon -R -t httpd_sys_content_t /var/www/csir-portal
fi
sudo chmod -R 755 /var/www/csir-portal

# 6. Configure Nginx
echo -e "${BLUE}Configuring Nginx...${NC}"
cat <<EOF | sudo tee /etc/nginx/conf.d/csir-portal.conf
server {
    listen 80;
    server_name _;

    root /var/www/csir-portal;
    index index.html;

    # GIGW 3.0 Compliance Headers
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-XSS-Protection "1; mode=block" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header Content-Security-Policy "default-src 'self' https: data: 'unsafe-inline';" always;

    location / {
        try_files \$uri \$uri/ /index.html;
    }

    gzip on;
    gzip_types text/plain text/css application/json application/javascript;
}
EOF

# Disable default nginx site if present
if [ -f /etc/nginx/sites-enabled/default ]; then
    sudo rm /etc/nginx/sites-enabled/default
fi

# 7. Restart Services
echo -e "${BLUE}Restarting Nginx...${NC}"
sudo systemctl enable nginx
sudo systemctl restart nginx

echo -e "${GREEN}Deployment Complete!${NC}"
echo -e "Access the portal at http://$(curl -s ifconfig.me) or http://localhost"
