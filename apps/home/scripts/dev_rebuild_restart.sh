#!/bin/bash

################################################################################
# Development Rebuild & Restart Script
# 
# Quick workflow for server-side development with near-HMR experience:
# 1. Make code changes (frontend or backend)
# 2. Run this script
# 3. Refresh browser to see changes
#
# What it does:
# - Rebuilds frontend (Vite) and backend (Nitro)
# - Syncs to live directory
# - Restarts PM2 process
# - No git pull, no migrations, no symlink recreation
#
# Usage:
#   bash scripts/dev_rebuild_restart.sh
#   # Or make it executable and run directly:
#   chmod +x scripts/dev_rebuild_restart.sh
#   ./scripts/dev_rebuild_restart.sh
################################################################################

set -e  # Exit on error

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Configuration
SOURCE_DIR="/opt/crearis/source"
LIVE_DIR="/opt/crearis/live"
PM2_APP_NAME="crearis-vue"
REQUIRED_USER="pruvious"

echo ""
echo -e "${BLUE}================================================${NC}"
echo -e "${BLUE}  Development Rebuild & Restart${NC}"
echo -e "${BLUE}================================================${NC}"
echo ""

# ============================================================================
# CRITICAL SECURITY CHECK: Must run as pruvious user, NEVER as root
# ============================================================================

CURRENT_USER=$(whoami)

if [ "$CURRENT_USER" = "root" ]; then
    echo -e "${RED}╔════════════════════════════════════════════════════╗${NC}"
    echo -e "${RED}║  ⚠️  CRITICAL: DO NOT RUN THIS SCRIPT AS ROOT  ⚠️   ║${NC}"
    echo -e "${RED}╚════════════════════════════════════════════════════╝${NC}"
    echo ""
    echo -e "${RED}Running as root can cause permission issues and is a security risk.${NC}"
    echo ""
    echo -e "${YELLOW}Correct usage:${NC}"
    echo -e "  ${GREEN}sudo -u $REQUIRED_USER bash $0${NC}"
    echo -e "  ${GREEN}su - $REQUIRED_USER -c 'bash $0'${NC}"
    echo ""
    exit 1
fi

if [ "$CURRENT_USER" != "$REQUIRED_USER" ]; then
    echo -e "${RED}❌ This script must be run as the '$REQUIRED_USER' user${NC}"
    echo -e "${YELLOW}   Current user: $CURRENT_USER${NC}"
    echo ""
    echo -e "${YELLOW}Correct usage:${NC}"
    echo -e "  ${GREEN}sudo -u $REQUIRED_USER bash $0${NC}"
    echo -e "  ${GREEN}su - $REQUIRED_USER -c 'bash $0'${NC}"
    echo ""
    exit 1
fi

echo -e "${GREEN}✓ Running as user: $CURRENT_USER${NC}"
echo ""

# Change to source directory
cd "$SOURCE_DIR" || {
    echo -e "${RED}❌ Failed to change to source directory: $SOURCE_DIR${NC}"
    exit 1
}

echo -e "${BLUE}📂 Working directory:${NC} $(pwd)"
echo ""

# Step 1: Rebuild application
echo -e "${BLUE}================================================${NC}"
echo -e "${BLUE}  Step 1: Rebuild Application${NC}"
echo -e "${BLUE}================================================${NC}"
echo ""

echo -e "${YELLOW}🔨 Building frontend and backend...${NC}"
START_TIME=$(date +%s)

# Run the build
if pnpm run build; then
    END_TIME=$(date +%s)
    BUILD_TIME=$((END_TIME - START_TIME))
    echo ""
    echo -e "${GREEN}✓ Build completed in ${BUILD_TIME}s${NC}"
else
    echo ""
    echo -e "${RED}❌ Build failed${NC}"
    echo -e "${YELLOW}   Fix the errors above and try again${NC}"
    exit 1
fi

# Step 2: Sync to live directory
echo ""
echo -e "${BLUE}================================================${NC}"
echo -e "${BLUE}  Step 2: Sync to Live Directory${NC}"
echo -e "${BLUE}================================================${NC}"
echo ""

echo -e "${YELLOW}📦 Syncing build output to $LIVE_DIR...${NC}"

# Create live directory if it doesn't exist
mkdir -p "$LIVE_DIR"

# Sync .output directory (Nitro build)
if [ -d ".output" ]; then
    rsync -a --delete .output/ "$LIVE_DIR/.output/"
    echo -e "${GREEN}✓ Synced .output/ directory${NC}"
else
    echo -e "${RED}❌ .output directory not found${NC}"
    exit 1
fi

# Sync package.json and ecosystem config
if [ -f "package.json" ]; then
    cp package.json "$LIVE_DIR/"
    echo -e "${GREEN}✓ Synced package.json${NC}"
fi

if [ -f "ecosystem.config.js" ]; then
    cp ecosystem.config.js "$LIVE_DIR/ecosystem.config.cjs"
    echo -e "${GREEN}✓ Synced ecosystem.config.cjs${NC}"
fi

# Step 3: Restart PM2
echo ""
echo -e "${BLUE}================================================${NC}"
echo -e "${BLUE}  Step 3: Restart PM2 Process${NC}"
echo -e "${BLUE}================================================${NC}"
echo ""

cd "$LIVE_DIR" || {
    echo -e "${RED}❌ Failed to change to live directory: $LIVE_DIR${NC}"
    exit 1
}

echo -e "${YELLOW}🔄 Restarting PM2 process: $PM2_APP_NAME...${NC}"

# Check if PM2 process exists
if pm2 describe "$PM2_APP_NAME" > /dev/null 2>&1; then
    # Process exists, delete and start fresh to clear Nitro's memory cache
echo "   Deleting process to clear memory cache..."

# Delete and recreate PM2 process to clear Nitro memory cache
pm2 delete "$PM2_APP_NAME" 2>/dev/null || true
pm2 start ecosystem.config.cjs
    echo -e "${GREEN}✓ PM2 process started fresh${NC}"
    pm2 save > /dev/null 2>&1
else
    echo -e "${RED}❌ Failed to start PM2 process${NC}"
    exit 1
fi

# Step 4: Show status
echo ""
echo -e "${BLUE}================================================${NC}"
echo -e "${BLUE}  Status${NC}"
echo -e "${BLUE}================================================${NC}"
echo ""

# Show PM2 status for this app only
pm2 describe "$PM2_APP_NAME" | grep -E "status|uptime|restarts|memory|cpu" || pm2 list | grep "$PM2_APP_NAME"

echo ""
echo -e "${GREEN}================================================${NC}"
echo -e "${GREEN}  ✓ Rebuild & Restart Complete!${NC}"
echo -e "${GREEN}================================================${NC}"
echo ""
echo -e "${YELLOW}💡 Next steps:${NC}"
echo -e "   1. Refresh your browser to see changes"
echo -e "   2. Check logs if needed: ${BLUE}pm2 logs $PM2_APP_NAME${NC}"
echo -e "   3. Monitor status: ${BLUE}pm2 monit${NC}"
echo ""

# Optional: Show last few log lines
echo -e "${BLUE}📋 Last 5 log lines:${NC}"
echo -e "${BLUE}─────────────────────────────────────────────${NC}"
pm2 logs "$PM2_APP_NAME" --lines 5 --nostream

echo ""
