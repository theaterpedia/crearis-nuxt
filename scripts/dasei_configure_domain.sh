#!/bin/bash

# =============================================================================
# Dasei - Domain Configuration & SSL Certificates
# =============================================================================
# Purpose: Configure Nginx reverse proxy and obtain SSL certificates
# Run as: root (requires sudo)
# Location: /opt/dasei/source/scripts/
#
# This script:
# 1. Validates prerequisites (Nginx, Certbot, application running)
# 2. Creates initial HTTP-only Nginx configuration
# 3. Obtains Let's Encrypt SSL certificates
# 4. Creates full HTTPS Nginx configuration with redirect
# 5. Sets up auto-renewal for certificates
#
# Prerequisites:
# - Application must be running in PM2
# - Domain DNS must point to server IP
# - Nginx installed
# - Certbot installed
#
# Usage:
#   sudo bash dasei_configure_domain.sh
# =============================================================================

set -e  # Exit on any error

# Get script directory
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

# Source common functions
if [[ -f "$SCRIPT_DIR/common_functions.sh" ]]; then
    source "$SCRIPT_DIR/common_functions.sh"
else
    echo "ERROR: common_functions.sh not found in $SCRIPT_DIR"
    exit 1
fi

# =============================================================================
# Main Functions
# =============================================================================

# Display banner
display_banner() {
    echo ""
    echo -e "${CYAN}╔════════════════════════════════════════════════════════════╗${NC}"
    echo -e "${CYAN}║                                                            ║${NC}"
    echo -e "${CYAN}║       Dasei - Domain & SSL Configuration Script            ║${NC}"
    echo -e "${CYAN}║                                                            ║${NC}"
    echo -e "${CYAN}║          Nginx Reverse Proxy + Let's Encrypt              ║${NC}"
    echo -e "${CYAN}║                                                            ║${NC}"
    echo -e "${CYAN}╚════════════════════════════════════════════════════════════╝${NC}"
    echo ""
}

# Check prerequisites
check_prerequisites() {
    section "Step 1: Checking Prerequisites"
    
    local errors=0
    
    # Check running as root
    if ! check_root; then
        errors=$((errors + 1))
    fi
    
    # Load configuration
    if ! load_config "$SCRIPT_DIR"; then
        errors=$((errors + 1))
    fi
    
    # Validate domain configuration
    if ! validate_config PRIMARY_DOMAIN SSL_EMAIL APP_NAME APP_PORT DEPLOY_USER LIVE_DIR LOGS_DIR; then
        errors=$((errors + 1))
    fi
    
    # Check Nginx
    if ! command_exists nginx; then
        error "Nginx not installed"
        echo ""
        echo -e "${YELLOW}Install Nginx:${NC}"
        echo -e "  ${GREEN}apt update && apt install -y nginx${NC}"
        errors=$((errors + 1))
    else
        success "Nginx installed ✓"
    fi
    
    # Check Certbot
    if ! command_exists certbot; then
        error "Certbot not installed"
        echo ""
        echo -e "${YELLOW}Install Certbot:${NC}"
        echo -e "  ${GREEN}apt update && apt install -y certbot python3-certbot-nginx${NC}"
        errors=$((errors + 1))
    else
        success "Certbot installed ✓"
    fi
    
    # Check if application is running
    if ! sudo -u "$DEPLOY_USER" pm2 describe "$APP_NAME" &> /dev/null; then
        error "Application '$APP_NAME' not running in PM2"
        echo ""
        echo -e "${YELLOW}Start the application first:${NC}"
        echo -e "  ${GREEN}sudo -u $DEPLOY_USER bash $SCRIPT_DIR/dasei_deploy_initial.sh${NC}"
        errors=$((errors + 1))
    else
        success "Application is running ✓"
    fi
    
    # Test local connection
    if curl -s "http://localhost:$APP_PORT" > /dev/null 2>&1; then
        success "Application responding on port $APP_PORT ✓"
    else
        warning "Application not responding on port $APP_PORT"
        warning "Continuing anyway, but SSL setup may fail..."
    fi
    
    if [[ $errors -gt 0 ]]; then
        error "Prerequisites check failed with $errors error(s)"
        exit 1
    fi
    
    success "All prerequisites satisfied ✓"
}

# Validate domains
validate_domains() {
    section "Step 2: Validating Domain Configuration"
    
    info "Primary domain: $PRIMARY_DOMAIN"
    
    if [[ -n "$ADDITIONAL_DOMAINS" ]]; then
        info "Additional domains: $ADDITIONAL_DOMAINS"
    else
        info "Additional domains: None"
    fi
    
    info "SSL email: $SSL_EMAIL"
    
    echo ""
    warning "IMPORTANT: Ensure DNS records are configured:"
    echo "  - $PRIMARY_DOMAIN → Server IP"
    
    if [[ -n "$ADDITIONAL_DOMAINS" ]]; then
        for domain in $ADDITIONAL_DOMAINS; do
            echo "  - $domain → Server IP"
        done
    fi
    
    echo ""
    if ! confirm_action "DNS configured correctly? Continue?"; then
        info "Exiting. Configure DNS and try again."
        exit 0
    fi
    
    success "Domain validation confirmed ✓"
}

# Create initial HTTP-only Nginx config
create_http_config() {
    section "Step 3: Creating Initial HTTP Configuration"
    
    local nginx_config="/etc/nginx/sites-available/$APP_NAME"
    local server_name="$PRIMARY_DOMAIN"
    
    if [[ -n "$ADDITIONAL_DOMAINS" ]]; then
        server_name="$server_name $ADDITIONAL_DOMAINS"
    fi
    
    log "Creating: $nginx_config"
    
    cat > "$nginx_config" << EOF
# Dasei Nuxt SSG - Nginx Configuration (HTTP only - for SSL certificate generation)
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
    
    # Temporary: proxy to Nitro SSG server until SSL is configured
    location / {
        proxy_pass http://localhost:$APP_PORT;
        proxy_http_version 1.1;
        proxy_set_header Upgrade \$http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host \$host;
        proxy_cache_bypass \$http_upgrade;
        proxy_set_header X-Real-IP \$remote_addr;
        proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto \$scheme;
    }
}
EOF
    
    success "HTTP configuration created ✓"
}

# Enable Nginx site
enable_site() {
    section "Step 4: Enabling Nginx Site"
    
    local sites_available="/etc/nginx/sites-available/$APP_NAME"
    local sites_enabled="/etc/nginx/sites-enabled/$APP_NAME"
    
    # Create symlink if doesn't exist
    if [[ ! -L "$sites_enabled" ]]; then
        ln -s "$sites_available" "$sites_enabled"
        success "Site enabled ✓"
    else
        info "Site already enabled"
    fi
    
    # Test Nginx configuration
    log "Testing Nginx configuration..."
    
    if nginx -t 2>&1 | grep -q "successful"; then
        success "Nginx configuration valid ✓"
    else
        error "Nginx configuration test failed"
        nginx -t
        exit 1
    fi
    
    # Reload Nginx
    log "Reloading Nginx..."
    systemctl reload nginx
    success "Nginx reloaded ✓"
}

# Obtain SSL certificates
obtain_ssl() {
    section "Step 5: Obtaining SSL Certificates"
    
    local domains="-d $PRIMARY_DOMAIN"
    
    if [[ -n "$ADDITIONAL_DOMAINS" ]]; then
        for domain in $ADDITIONAL_DOMAINS; do
            domains="$domains -d $domain"
        done
    fi
    
    log "Requesting SSL certificate from Let's Encrypt..."
    info "Domains: $PRIMARY_DOMAIN$([ -n "$ADDITIONAL_DOMAINS" ] && echo ", $ADDITIONAL_DOMAINS")"
    info "Email: $SSL_EMAIL"
    
    # Check if certificate already exists
    if [[ -d "/etc/letsencrypt/live/$PRIMARY_DOMAIN" ]]; then
        warning "SSL certificate already exists for $PRIMARY_DOMAIN"
        
        if confirm_action "Renew/recreate certificate?"; then
            log "Renewing certificate..."
        else
            info "Keeping existing certificate"
            return 0
        fi
    fi
    
    # Obtain certificate
    if certbot certonly \
        --webroot \
        -w /var/www/html \
        $domains \
        --email "$SSL_EMAIL" \
        --agree-tos \
        --non-interactive \
        --force-renewal 2>&1; then
        success "SSL certificate obtained ✓"
    else
        error "Failed to obtain SSL certificate"
        echo ""
        echo -e "${YELLOW}Common issues:${NC}"
        echo "  - DNS not propagated yet (wait 5-10 minutes)"
        echo "  - Firewall blocking port 80"
        echo "  - Domain not pointing to this server"
        echo ""
        exit 1
    fi
}

# Create full HTTPS Nginx config
create_https_config() {
    section "Step 6: Creating Full HTTPS Configuration"
    
    local nginx_config="/etc/nginx/sites-available/$APP_NAME"
    local server_name="$PRIMARY_DOMAIN"
    
    if [[ -n "$ADDITIONAL_DOMAINS" ]]; then
        server_name="$server_name $ADDITIONAL_DOMAINS"
    fi
    
    log "Creating: $nginx_config"
    
    # Determine cache settings based on CACHE_MODE
    local cache_expires="1y"
    local cache_control="public, immutable"
    
    if is_fast_changing_mode; then
        cache_expires="-1"
        cache_control="no-store, no-cache, must-revalidate"
    fi
    
    cat > "$nginx_config" << EOF
# Dasei Nuxt SSG - Nginx Configuration
# Generated: $(date)
# Primary Domain: $PRIMARY_DOMAIN
# Cache Mode: $(get_cache_mode)

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
    access_log $LOGS_DIR/nginx-access.log;
    error_log $LOGS_DIR/nginx-error.log;
    
    # Client max body size
    client_max_body_size 10M;
    
    # Disable gzip for proxied content (Nitro handles compression)
    gzip off;
    
    # Serve static assets directly from filesystem (optional optimization)
    # Comment out this block to let Nitro handle everything
    location /assets/ {
        alias $LIVE_DIR/.output/public/assets/;
        expires $cache_expires;
        add_header Cache-Control "$cache_control";
        access_log off;
    }
    
    # Proxy all requests to Nitro SSG server
    location / {
        proxy_pass http://localhost:$APP_PORT;
        proxy_http_version 1.1;
        proxy_set_header Upgrade \$http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host \$host;
        proxy_cache_bypass \$http_upgrade;
        proxy_set_header X-Real-IP \$remote_addr;
        proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto \$scheme;
        
        # Timeouts
        proxy_connect_timeout 60s;
        proxy_send_timeout 60s;
        proxy_read_timeout 60s;
    }
}
EOF
    
    success "HTTPS configuration created ✓"
    info "Cache mode: $(get_cache_mode)"
}

# Reload Nginx with HTTPS config
reload_nginx() {
    section "Step 7: Reloading Nginx"
    
    # Test configuration
    log "Testing Nginx configuration..."
    
    if nginx -t 2>&1 | grep -q "successful"; then
        success "Nginx configuration valid ✓"
    else
        error "Nginx configuration test failed"
        nginx -t
        exit 1
    fi
    
    # Reload Nginx
    log "Reloading Nginx..."
    systemctl reload nginx
    success "Nginx reloaded ✓"
}

# Verify HTTPS
verify_https() {
    section "Step 8: Verifying HTTPS"
    
    log "Waiting for Nginx to reload..."
    sleep 2
    
    log "Testing HTTPS connection..."
    
    if curl -s "https://$PRIMARY_DOMAIN" > /dev/null 2>&1; then
        success "HTTPS working on $PRIMARY_DOMAIN ✓"
    else
        warning "HTTPS connection test failed"
        warning "This may be normal if SSL is still propagating"
    fi
}

# Setup auto-renewal
setup_auto_renewal() {
    section "Step 9: Setting Up Auto-Renewal"
    
    # Check if certbot timer is active
    if systemctl is-active --quiet certbot.timer; then
        success "Certbot auto-renewal timer is active ✓"
    else
        warning "Certbot timer not active, enabling..."
        systemctl enable certbot.timer
        systemctl start certbot.timer
        success "Certbot auto-renewal enabled ✓"
    fi
    
    # Test renewal
    log "Testing certificate renewal (dry run)..."
    
    if certbot renew --dry-run --quiet 2>&1 | grep -q "congratulations"; then
        success "Auto-renewal test passed ✓"
    else
        warning "Auto-renewal test had issues (may be normal)"
        info "Check with: certbot renew --dry-run"
    fi
}

# Display completion summary
display_summary() {
    section "Configuration Complete!"
    
    echo -e "${GREEN}✅ Domain and SSL configured successfully!${NC}"
    echo ""
    echo -e "${CYAN}🌐 Your application is now accessible at:${NC}"
    echo -e "   ${GREEN}https://$PRIMARY_DOMAIN${NC}"
    
    if [[ -n "$ADDITIONAL_DOMAINS" ]]; then
        for domain in $ADDITIONAL_DOMAINS; do
            echo -e "   ${GREEN}https://$domain${NC}"
        done
    fi
    
    echo ""
    echo -e "${CYAN}📜 SSL Certificate Information:${NC}"
    
    if [[ -d "/etc/letsencrypt/live/$PRIMARY_DOMAIN" ]]; then
        local expiry=$(openssl x509 -enddate -noout -in "/etc/letsencrypt/live/$PRIMARY_DOMAIN/cert.pem" 2>/dev/null | cut -d= -f2)
        echo -e "   Expires: ${YELLOW}$expiry${NC}"
    fi
    
    echo -e "   Auto-renewal: ${GREEN}Enabled${NC} (certbot.timer)"
    echo ""
    echo -e "${CYAN}📊 Monitoring:${NC}"
    echo -e "   Application:  ${GREEN}pm2 logs $APP_NAME${NC}"
    echo -e "   Nginx access: ${GREEN}tail -f $LOGS_DIR/nginx-access.log${NC}"
    echo -e "   Nginx error:  ${GREEN}tail -f $LOGS_DIR/nginx-error.log${NC}"
    echo -e "   SSL renewal:  ${GREEN}systemctl status certbot.timer${NC}"
    echo ""
    echo -e "${CYAN}🔧 Useful Commands:${NC}"
    echo -e "   Test SSL:     ${GREEN}certbot renew --dry-run${NC}"
    echo -e "   Renew SSL:    ${GREEN}certbot renew${NC}"
    echo -e "   Reload Nginx: ${GREEN}systemctl reload nginx${NC}"
    echo -e "   Test Nginx:   ${GREEN}nginx -t${NC}"
    echo ""
    echo -e "${CYAN}🔄 Cache Mode:${NC}"
    echo -e "   Current: ${YELLOW}$(get_cache_mode)${NC}"
    echo -e "   Switch:  ${GREEN}sudo bash $SCRIPT_DIR/switch-cache-mode.sh${NC}"
    echo ""
}

# =============================================================================
# Main Execution
# =============================================================================

main() {
    display_banner
    
    local start_time=$(date +%s)
    
    # Run all steps
    check_prerequisites
    validate_domains
    create_http_config
    enable_site
    obtain_ssl
    create_https_config
    reload_nginx
    verify_https
    setup_auto_renewal
    
    # Show completion
    echo ""
    display_elapsed_time "$start_time"
    display_summary
}

# Run main function
if [[ "${BASH_SOURCE[0]}" == "${0}" ]]; then
    main "$@"
fi
