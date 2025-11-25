#!/bin/bash

#############################################################
# Production Mode Switcher: STABLE PRODUCTION
#############################################################
# 
# This mode restores production-grade caching optimized for
# performance and minimal server load. Use this for stable
# releases when code changes are infrequent.
#
# Characteristics:
# - Nginx serves assets with 1-year cache headers
# - Aggressive browser caching enabled
# - PM2 uses regular restart (faster, no memory clear)
# - Optimized for maximum performance
#############################################################

set -e  # Exit on error

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo ""
echo -e "${BLUE}================================================${NC}"
echo -e "${BLUE}  Switching to STABLE PRODUCTION Mode${NC}"
echo -e "${BLUE}================================================${NC}"
echo ""

# Check if running as root
if [ "$EUID" -ne 0 ]; then 
    echo -e "${RED}Error: This script must be run as root (use sudo)${NC}"
    exit 1
fi

NGINX_CONFIG="/etc/nginx/sites-available/crearis-vue"
NGINX_BACKUP="/etc/nginx/sites-available/crearis-vue.stable-production"

echo -e "${YELLOW}📋 Mode Characteristics:${NC}"
echo "   • Nginx: 1-year aggressive caching"
echo "   • PM2: Standard restart (fast)"
echo "   • Optimization: Maximum performance"
echo "   • Use case: Stable releases, infrequent updates"
echo ""

# Step 1: Backup current Nginx config
echo -e "${BLUE}Step 1: Backing up Nginx configuration...${NC}"
cp "$NGINX_CONFIG" "$NGINX_BACKUP"
echo -e "${GREEN}✓ Backed up to $NGINX_BACKUP${NC}"
echo ""

# Step 2: Update Nginx configuration for aggressive caching
echo -e "${BLUE}Step 2: Configuring Nginx for production caching...${NC}"

# Update the /assets/ location block
sudo sed -i '/location \/assets\/ {/,/}/c\
    location /assets/ {\
        alias /opt/crearis/live/.output/public/assets/;\
        expires 1y;\
        add_header Cache-Control "public, immutable";\
        access_log off;\
    }' "$NGINX_CONFIG"

echo -e "${GREEN}✓ Nginx configured for 1-year aggressive caching${NC}"
echo ""

# Step 3: Test and reload Nginx
echo -e "${BLUE}Step 3: Testing and reloading Nginx...${NC}"
if nginx -t 2>&1 | grep -q "successful"; then
    systemctl reload nginx
    echo -e "${GREEN}✓ Nginx reloaded successfully${NC}"
else
    echo -e "${RED}✗ Nginx configuration test failed${NC}"
    echo "Restoring backup..."
    cp "$NGINX_BACKUP" "$NGINX_CONFIG"
    exit 1
fi
echo ""

# Step 4: Update rebuild script to use standard PM2 restart
echo -e "${BLUE}Step 4: Configuring rebuild script for standard PM2 restart...${NC}"

REBUILD_SCRIPT="/opt/crearis/source/scripts/dev_rebuild_restart.sh"

# Replace pm2 delete/start with pm2 restart
sudo -u pruvious sed -i '/echo.*Deleting process to clear memory cache/,/pm2 start ecosystem.config.cjs/c\
echo "   Using standard restart (faster)..."\
\
# Restart PM2 process\
pm2 restart "$PM2_APP_NAME" --update-env' "$REBUILD_SCRIPT"

echo -e "${GREEN}✓ Rebuild script configured for standard restart${NC}"
echo ""

# Step 5: Summary
echo -e "${BLUE}================================================${NC}"
echo -e "${GREEN}✓ STABLE PRODUCTION Mode Activated${NC}"
echo -e "${BLUE}================================================${NC}"
echo ""
echo -e "${YELLOW}Active Settings:${NC}"
echo "   • Nginx caching: expires 1y, immutable"
echo "   • PM2 restart: Standard (no memory clear)"
echo "   • Performance: Maximum (CDN-friendly)"
echo ""
echo -e "${YELLOW}Recommendations:${NC}"
echo "   • Clear CDN cache after deployments"
echo "   • Use content-hash filenames (already enabled)"
echo "   • Monitor cache hit rates"
echo ""
echo -e "${YELLOW}To deploy changes:${NC}"
echo "   sudo -u pruvious bash /opt/crearis/source/scripts/dev_rebuild_restart.sh"
echo ""
echo -e "${YELLOW}To switch back to fast-changing mode:${NC}"
echo "   sudo bash /opt/crearis/source/scripts/switch-to-fast-changing.sh"
echo ""
