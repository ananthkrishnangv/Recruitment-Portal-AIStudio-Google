# CSIR-SERC Portal - Deployment Guide for Rocky Linux 9.7

This documentation provides step-by-step instructions to deploy the CSIR-SERC Recruitment Portal on a production server running **Rocky Linux 9.7**.

## Prerequisites

*   A server running Rocky Linux 9.7.
*   Root access or a user with `sudo` privileges.
*   Internet access for downloading dependencies.

## 1. Automated Deployment

A shell script `deploy_rocky.sh` is provided to automate the installation of Node.js, Nginx, and the application build process.

### Steps:
1.  Upload the project files to the server (e.g., `/home/user/csir-portal`).
2.  Make the script executable:
    ```bash
    chmod +x deploy_rocky.sh
    ```
3.  Run the script:
    ```bash
    ./deploy_rocky.sh
    ```

## 2. Manual Deployment Procedure

If you prefer to configure the server manually, follow these steps.

### Step 1: System Update & Dependencies
Update the system packages to the latest versions.

```bash
sudo dnf update -y
sudo dnf install -y curl git nginx policycoreutils-python-utils tar
```

### Step 2: Install Node.js (v20 LTS)
Rocky Linux repositories might have older Node.js versions. We will use NodeSource.

```bash
curl -fsSL https://rpm.nodesource.com/setup_20.x | sudo bash -
sudo dnf install -y nodejs
```

Verify installation:
```bash
node -v
npm -v
```

### Step 3: Build the Application
Navigate to your project directory and install dependencies.

```bash
cd /path/to/your/project
npm install
npm run build
```

This will create a `dist` directory containing the production build.

### Step 4: Configure Nginx
Create a directory for the web application and copy the build files.

```bash
sudo mkdir -p /var/www/csir-portal
sudo cp -r dist/* /var/www/csir-portal/
```

Create an Nginx server block configuration:

```bash
sudo vi /etc/nginx/conf.d/csir-portal.conf
```

Add the following content:

```nginx
server {
    listen 80;
    server_name _;  # Replace with your domain name or IP

    root /var/www/csir-portal;
    index index.html;

    location / {
        try_files $uri $uri/ /index.html;
    }

    # Security Headers
    add_header X-Frame-Options "SAMEORIGIN";
    add_header X-XSS-Protection "1; mode=block";
    add_header X-Content-Type-Options "nosniff";

    # Gzip Compression
    gzip on;
    gzip_types text/plain text/css application/json application/javascript text/xml application/xml application/xml+rss text/javascript;
}
```

### Step 5: File Permissions & SELinux
Rocky Linux uses SELinux by default. We must set the correct contexts.

```bash
# Set Ownership
sudo chown -R nginx:nginx /var/www/csir-portal
sudo chmod -R 755 /var/www/csir-portal

# SELinux Context
sudo chcon -R -t httpd_sys_content_t /var/www/csir-portal
```

### Step 6: Configure Firewall
Allow HTTP and HTTPS traffic through the firewall.

```bash
sudo firewall-cmd --permanent --add-service=http
sudo firewall-cmd --permanent --add-service=https
sudo firewall-cmd --reload
```

### Step 7: Start Nginx
Enable and start the Nginx service.

```bash
sudo systemctl enable nginx
sudo systemctl start nginx
```

## Troubleshooting

*   **403 Forbidden Error**: Check SELinux contexts (`ls -Z /var/www/csir-portal`) and directory permissions.
*   **404 Not Found (on refresh)**: Ensure `try_files $uri $uri/ /index.html;` is present in Nginx config to handle React Router client-side routing.
