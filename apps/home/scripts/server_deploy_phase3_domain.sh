#!/bin/bash

# =============================================================================
# Crearis Vue - Phase 3: Domain Configuration & SSL Certificates
# =============================================================================
# Run as: root
# Purpose: Configure Nginx, obtain SSL certificates with Certbot
# =============================================================================

set -e  # Exit on any error

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Configuration
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
ENV_FILE="$SCRIPT_DIR/.env.deploy"

# Logging functions
log() { echo -e "${BLUE}[$(date +'%Y-%m-%d %H:%M:%S')]${NC} $1"; }
error() { echo -e "${RED}[$(date +'%Y-%m-%d %H:%M:%S')] ERROR:${NC} $1"; }
success() { echo -e "${GREEN}[$(date +'%Y-%m-%d %H:%M:%S')] SUCCESS:${NC} $1"; }
warning() { echo -e "${YELLOW}[$(date +'%Y-%m-%d %H:%M:%S')] WARNING:${NC} $1"; }

# Check if running as root
check_root() {
    if [[ $EUID -ne 0 ]]; then
        error "This script must be run as root (Phase 3 requires root privileges)"
        echo "Usage: sudo bash $0"
        exit 1
    fi
    success "Running as root ✓"
}

# Load configuration
load_config() {
    log "📋 Loading deployment configuration..."
    
    if [[ ! -f "$ENV_FILE" ]]; then
        error "Deployment configuration file not found: $ENV_FILE"
        exit 1
    fi
    
    source "$ENV_FILE"
    success "Configuration loaded ✓"
}

# Validate domain configuration
validate_domains() {
    log "🔍 Validating domain configuration..."
    
    local errors=0
    
    if [[ -z "$PRIMARY_DOMAIN" ]]; then
        error "PRIMARY_DOMAIN not set in .env.deploy"
        errors=$((errors + 1))
    fi
    
    if [[ -z "$ADDITIONAL_DOMAINS" ]]; then
        warning "ADDITIONAL_DOMAINS not set, will only configure primary domain"
    fi
    
    if [[ -z "$SSL_EMAIL" ]]; then
        error "SSL_EMAIL not set in .env.deploy (required for Let's Encrypt)"
        errors=$((errors + 1))
    fi
    
    if [[ $errors -gt 0 ]]; then
        error "Domain configuration validation failed"
        exit 1
    fi
    
    success "Domain configuration valid ✓"
}

# Check prerequisites
check_prerequisites() {
    log "🔍 Checking prerequisites..."
    
    local errors=0
    
    # Check if Nginx is installed
    if ! command -v nginx &> /dev/null; then
        error "Nginx not installed"
        echo "Install with: sudo apt install nginx"
        errors=$((errors + 1))
    fi
    
    # Check if Certbot is installed
    if ! command -v certbot &> /dev/null; then
        error "Certbot not installed"
        echo "Install with: sudo apt install certbot python3-certbot-nginx"
        errors=$((errors + 1))
    fi
    
    # Check if PM2 ecosystem file exists
    if [[ ! -f "$LIVE_DIR/ecosystem.config.js" ]]; then
        error "PM2 ecosystem file not found: $LIVE_DIR/ecosystem.config.js"
        echo "Run Phase 2 first to build the application"
        errors=$((errors + 1))
    fi
    
    # Check if application is running in PM2
    if ! sudo -u "$DEPLOY_USER" pm2 list 2>/dev/null | grep -q "crearis-vue"; then
        warning "Application not running in PM2"
        
        # Try to start it
        log "Attempting to start application..."
        if sudo -u "$DEPLOY_USER" pm2 start "$LIVE_DIR/ecosystem.config.js"; then
            success "Application started successfully ✓"
            
            # Wait for app to fully start
            sleep 3
            
            # Verify it's running
            if sudo -u "$DEPLOY_USER" pm2 list | grep -q "online"; then
                success "Application is online ✓"
            else
                error "Application failed to start properly"
                echo "Check logs: sudo -u $DEPLOY_USER pm2 logs crearis-vue"
                errors=$((errors + 1))
            fi
        else
            error "Failed to start application"
            echo "Start manually with: sudo -u $DEPLOY_USER pm2 start $LIVE_DIR/ecosystem.config.js"
            errors=$((errors + 1))
        fi
    else
        success "Application is running in PM2 ✓"
    fi
    
    if [[ $errors -gt 0 ]]; then
        error "Prerequisites check failed"
        exit 1
    fi
    
    success "Prerequisites check passed ✓"
}

# Create initial HTTP-only Nginx configuration
create_nginx_config_http() {
    log "🌐 Creating initial HTTP-only Nginx configuration..."
    
    # Build server_name directive with all domains
    local server_name="$PRIMARY_DOMAIN"
    if [[ -n "$ADDITIONAL_DOMAINS" ]]; then
        server_name="$server_name $ADDITIONAL_DOMAINS"
    fi
    
    # Create HTTP-only Nginx config file (for Let's Encrypt validation)
    cat > "/etc/nginx/sites-available/crearis-vue" << EOF
# Crearis Vue - Nginx Configuration (HTTP only - for SSL certificate generation)
# Generated: $(date)
# Primary Domain: $PRIMARY_DOMAIN

server {
    listen 80;
    listen [::]:80;
    server_name $server_name;
    
    # Let's Encrypt challenge
    location /.well-known/acme-challenge/ {
        root /var/www/html;
    }
    
    # Temporary: serve application over HTTP until SSL is configured
    location / {
        proxy_pass http://127.0.0.1:$APP_PORT;
        proxy_http_version 1.1;
        proxy_set_header Upgrade \$http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host \$host;
        proxy_set_header X-Real-IP \$remote_addr;
        proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto \$scheme;
        proxy_cache_bypass \$http_upgrade;
    }
}
EOF
    
    success "HTTP-only Nginx configuration created ✓"
}

# Create full Nginx configuration with HTTPS
create_nginx_config_https() {
    log "🌐 Creating full Nginx configuration with HTTPS..."
    
    # Build server_name directive with all domains
    local server_name="$PRIMARY_DOMAIN"
    if [[ -n "$ADDITIONAL_DOMAINS" ]]; then
        server_name="$server_name $ADDITIONAL_DOMAINS"
    fi
    
    # Create full Nginx config file with HTTPS
    cat > "/etc/nginx/sites-available/crearis-vue" << EOF
# Crearis Vue - Nginx Configuration
# Generated: $(date)
# Primary Domain: $PRIMARY_DOMAIN

# HTTP to HTTPS redirect
server {
    listen 80;
    listen [::]:80;
    server_name $server_name;
    
    # Let's Encrypt challenge
    location /.well-known/acme-challenge/ {
        root /var/www/html;
    }
    
    # Redirect all other traffic to HTTPS
    location / {
        return 301 https://\$host\$request_uri;
    }
}

# HTTPS server
server {
    listen 443 ssl http2;
    listen [::]:443 ssl http2;
    server_name $server_name;
    
    # SSL certificates
    ssl_certificate /etc/letsencrypt/live/$PRIMARY_DOMAIN/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/$PRIMARY_DOMAIN/privkey.pem;
    
    # SSL configuration
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_ciphers HIGH:!aNULL:!MD5;
    ssl_prefer_server_ciphers on;
    ssl_session_cache shared:SSL:10m;
    ssl_session_timeout 10m;
    
    # Security headers
    add_header Strict-Transport-Security "max-age=31536000; includeSubDomains" always;
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header X-XSS-Protection "1; mode=block" always;
    
    # Logging
    access_log $LOG_DIR/nginx-access.log;
    error_log $LOG_DIR/nginx-error.log;
    
    # Client max body size
    client_max_body_size 50M;
    
    # Disable gzip for proxied content (Nitro handles compression)
    gzip off;
    
    # Serve static assets directly from filesystem (Vite build output)
    # Nitro doesn't serve /assets/ path - it only serves /_nuxt/ internal bundles
    location /assets/ {
        alias $LIVE_DIR/public/assets/;
        expires 1y;
        add_header Cache-Control "public, immutable";
        access_log off;
    }
    
    # Proxy settings for application (/_nuxt/ bundles and all other routes)
    location / {
        proxy_pass http://127.0.0.1:$APP_PORT;
        proxy_http_version 1.1;
        proxy_set_header Upgrade \$http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host \$host;
        proxy_set_header X-Real-IP \$remote_addr;
        proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto \$scheme;
        proxy_cache_bypass \$http_upgrade;
        
        # Don't buffer proxied responses (prevents corruption)
        proxy_buffering off;
        
        # Timeouts
        proxy_connect_timeout 60s;
        proxy_send_timeout 60s;
        proxy_read_timeout 60s;
    }
}

EOF
    
    success "HTTPS Nginx configuration created ✓"
}

# Enable Nginx site
enable_nginx_site() {
    log "🔗 Enabling Nginx site..."
    
    # Remove old symlink if it exists
    if [[ -L "/etc/nginx/sites-enabled/crearis-vue" ]]; then
        rm /etc/nginx/sites-enabled/crearis-vue
    fi
    
    # Create symlink
    ln -s /etc/nginx/sites-available/crearis-vue /etc/nginx/sites-enabled/crearis-vue
    success "Site enabled ✓"
    
    # Test Nginx configuration
    if nginx -t 2>&1; then
        success "Nginx configuration valid ✓"
        
        # Reload Nginx
        systemctl reload nginx
        success "Nginx reloaded ✓"
    else
        error "Nginx configuration test failed"
        exit 1
    fi
}

# Obtain SSL certificates
obtain_ssl_certificates() {
    log "🔒 Obtaining SSL certificates from Let's Encrypt..."
    
    # Build domain arguments for Certbot
    local domain_args="-d $PRIMARY_DOMAIN"
    if [[ -n "$ADDITIONAL_DOMAINS" ]]; then
        for domain in $ADDITIONAL_DOMAINS; do
            domain_args="$domain_args -d $domain"
        done
    fi
    
    # Check if certificates already exist
    if [[ -d "/etc/letsencrypt/live/$PRIMARY_DOMAIN" ]]; then
        warning "Certificates already exist for $PRIMARY_DOMAIN"
        log "Attempting to renew/expand..."
        
        # Try to expand certificate to include all domains
        certbot certonly --nginx \
            $domain_args \
            --email "$SSL_EMAIL" \
            --agree-tos \
            --no-eff-email \
            --expand \
            --non-interactive
    else
        log "Obtaining new certificates..."
        
        # Obtain new certificates
        certbot certonly --nginx \
            $domain_args \
            --email "$SSL_EMAIL" \
            --agree-tos \
            --no-eff-email \
            --non-interactive
    fi
    
    if [[ $? -eq 0 ]]; then
        success "SSL certificates obtained ✓"
    else
        error "Failed to obtain SSL certificates"
        echo ""
        echo "Troubleshooting:"
        echo "  1. Ensure domains are pointing to this server"
        echo "  2. Check DNS propagation: nslookup $PRIMARY_DOMAIN"
        echo "  3. Verify port 80 and 443 are open"
        echo "  4. Check Certbot logs: /var/log/letsencrypt/letsencrypt.log"
        exit 1
    fi
}

# Setup auto-renewal
setup_auto_renewal() {
    log "🔄 Setting up automatic certificate renewal..."
    
    # Test renewal
    certbot renew --dry-run
    
    if [[ $? -eq 0 ]]; then
        success "Certificate auto-renewal configured ✓"
        log "  Certbot will automatically renew certificates via systemd timer"
    else
        warning "Certificate renewal test failed"
        echo "Check renewal configuration manually"
    fi
}

# Reload Nginx
reload_nginx() {
    log "🔄 Reloading Nginx..."
    
    systemctl reload nginx
    
    if systemctl is-active --quiet nginx; then
        success "Nginx reloaded successfully ✓"
    else
        error "Nginx failed to reload"
        echo "Check logs: sudo journalctl -u nginx -n 50"
        exit 1
    fi
}

# Verify HTTPS
verify_https() {
    log "✅ Verifying HTTPS configuration..."
    
    # Wait a moment for Nginx to fully reload
    sleep 2
    
    # Test HTTPS connection
    if curl -s -o /dev/null -w "%{http_code}" "https://$PRIMARY_DOMAIN" | grep -q "200\|301\|302"; then
        success "HTTPS is working ✓"
    else
        warning "Could not verify HTTPS connection"
        echo "Test manually: curl -I https://$PRIMARY_DOMAIN"
    fi
}

# Print completion summary
print_summary() {
    echo ""
    echo "========================================================================="
    success "✅ Phase 3 Complete: Domain & SSL Configuration"
    echo "========================================================================="
    echo ""
    echo "🌐 Configured Domains:"
    echo "  Primary: https://$PRIMARY_DOMAIN"
    
    if [[ -n "$ADDITIONAL_DOMAINS" ]]; then
        for domain in $ADDITIONAL_DOMAINS; do
            echo "  Additional: https://$domain"
        done
    fi
    
    echo ""
    echo "🔒 SSL Certificates:"
    echo "  Provider: Let's Encrypt"
    echo "  Location: /etc/letsencrypt/live/$PRIMARY_DOMAIN/"
    echo "  Auto-renewal: Enabled (systemd timer)"
    echo ""
    echo "📋 Useful Commands:"
    echo "  Check Nginx status: sudo systemctl status nginx"
    echo "  Check SSL certs: sudo certbot certificates"
    echo "  Test renewal: sudo certbot renew --dry-run"
    echo "  View Nginx logs: sudo tail -f $LOG_DIR/nginx-*.log"
    echo "  Check application: sudo -u $DEPLOY_USER pm2 status"
    echo ""
    echo "🎉 Deployment Complete!"
    echo "  Your application is now live at: https://$PRIMARY_DOMAIN"
    echo ""
    echo "========================================================================="
}

# Main execution
main() {
    log "🚀 Starting Phase 3: Domain & SSL Configuration"
    
    check_root
    load_config
    validate_domains
    check_prerequisites
    
    # Step 1: Create HTTP-only configuration
    create_nginx_config_http
    enable_nginx_site
    
    # Step 2: Obtain SSL certificates
    obtain_ssl_certificates
    
    # Step 3: Update to HTTPS configuration
    create_nginx_config_https
    enable_nginx_site
    
    # Step 4: Setup auto-renewal and verify
    setup_auto_renewal
    verify_https
    print_summary
}

# Run main function
if [[ "${BASH_SOURCE[0]}" == "${0}" ]]; then
    main "$@"
fi
