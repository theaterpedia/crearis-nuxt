#!/bin/bash

# =============================================================================
# Dasei - Switch Cache Mode
# =============================================================================
# Purpose: Switch between fast-changing and stable-production cache modes
# Run as: root (requires sudo for Nginx configuration)
# Location: /opt/dasei/source/scripts/
#
# Cache Modes:
# 
# 1. fast-changing (Development on Production)
#    - Nginx: No cache, must-revalidate headers
#    - PM2: Delete/start (clears Nitro memory cache)
#    - Use when: Actively developing on production server
#
# 2. stable-production (Stable Releases)
#    - Nginx: Aggressive caching (1 year, immutable)
#    - PM2: Standard restart (faster, keeps cache)
#    - Use when: Stable releases, infrequent updates
#
# Usage:
#   sudo bash switch-cache-mode.sh fast-changing
#   sudo bash switch-cache-mode.sh stable-production
#   sudo bash switch-cache-mode.sh   # Toggle between modes
# =============================================================================

set -e  # Exit on error

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
    echo -e "${CYAN}║              Dasei - Switch Cache Mode                     ║${NC}"
    echo -e "${CYAN}║                                                            ║${NC}"
    echo -e "${CYAN}╚════════════════════════════════════════════════════════════╝${NC}"
    echo ""
}

# Check prerequisites
check_prerequisites_for_switch() {
    # Check running as root
    if ! check_root; then
        exit 1
    fi
    
    # Load configuration
    if ! load_config "$SCRIPT_DIR"; then
        exit 1
    fi
    
    # Validate required config
    if ! validate_config APP_NAME DEPLOY_USER; then
        exit 1
    fi
    
    # Check Nginx installed
    if ! command_exists nginx; then
        error "Nginx not installed"
        exit 1
    fi
    
    success "Prerequisites satisfied ✓"
}

# Get current cache mode
get_current_mode() {
    local config_file="$SCRIPT_DIR/.env.deploy"
    
    if [[ -f "$config_file" ]]; then
        local mode=$(grep "^CACHE_MODE=" "$config_file" | cut -d= -f2 | tr -d '"' | tr -d "'")
        echo "${mode:-stable-production}"
    else
        echo "stable-production"
    fi
}

# Determine target mode
determine_target_mode() {
    local current_mode="$1"
    local requested_mode="$2"
    
    if [[ -n "$requested_mode" ]]; then
        # Validate requested mode
        if [[ "$requested_mode" != "fast-changing" && "$requested_mode" != "stable-production" ]]; then
            error "Invalid mode: $requested_mode"
            echo ""
            echo -e "${YELLOW}Valid modes:${NC}"
            echo -e "  ${GREEN}fast-changing${NC}      - Development on production (no cache, memory clear)"
            echo -e "  ${GREEN}stable-production${NC}  - Stable releases (aggressive cache, fast restart)"
            echo ""
            exit 1
        fi
        echo "$requested_mode"
    else
        # Toggle mode
        if [[ "$current_mode" == "fast-changing" ]]; then
            echo "stable-production"
        else
            echo "fast-changing"
        fi
    fi
}

# Update configuration file
update_config_file() {
    local target_mode="$1"
    local config_file="$SCRIPT_DIR/.env.deploy"
    
    log "Updating configuration file..."
    
    if [[ -f "$config_file" ]]; then
        # Update existing CACHE_MODE line
        if grep -q "^CACHE_MODE=" "$config_file"; then
            sed -i "s/^CACHE_MODE=.*/CACHE_MODE=\"$target_mode\"/" "$config_file"
        else
            # Add CACHE_MODE line
            echo "CACHE_MODE=\"$target_mode\"" >> "$config_file"
        fi
        success "Configuration file updated ✓"
    else
        warning "Configuration file not found, skipping update"
    fi
}

# Update Nginx configuration
update_nginx_config() {
    local target_mode="$1"
    local nginx_config="/etc/nginx/sites-available/$APP_NAME"
    
    section "Updating Nginx Configuration"
    
    if [[ ! -f "$nginx_config" ]]; then
        warning "Nginx configuration not found: $nginx_config"
        warning "Skipping Nginx update"
        return 0
    fi
    
    # Backup current config
    local backup="$nginx_config.backup.$(date +%Y%m%d_%H%M%S)"
    cp "$nginx_config" "$backup"
    info "Backed up to: $backup"
    
    # Update cache settings based on mode
    if [[ "$target_mode" == "fast-changing" ]]; then
        log "Configuring for fast-changing mode (no cache)..."
        
        # Update /assets/ location cache settings
        sed -i '/location \/assets\/ {/,/}/c\
    # Serve static assets directly from filesystem\n\
    # Comment out this block to let Nitro handle everything\n\
    location /assets/ {\n\
        alias '"$LIVE_DIR"'/.output/public/assets/;\n\
        expires -1;\n\
        add_header Cache-Control "no-store, no-cache, must-revalidate";\n\
        access_log off;\n\
    }' "$nginx_config"
        
        # Update cache mode comment
        sed -i "s/# Cache Mode: .*/# Cache Mode: fast-changing/" "$nginx_config"
        
        success "Nginx configured for fast-changing mode ✓"
        
    else
        log "Configuring for stable-production mode (aggressive cache)..."
        
        # Update /assets/ location cache settings
        sed -i '/location \/assets\/ {/,/}/c\
    # Serve static assets directly from filesystem\n\
    # Comment out this block to let Nitro handle everything\n\
    location /assets/ {\n\
        alias '"$LIVE_DIR"'/.output/public/assets/;\n\
        expires 1y;\n\
        add_header Cache-Control "public, immutable";\n\
        access_log off;\n\
    }' "$nginx_config"
        
        # Update cache mode comment
        sed -i "s/# Cache Mode: .*/# Cache Mode: stable-production/" "$nginx_config"
        
        success "Nginx configured for stable-production mode ✓"
    fi
}

# Test and reload Nginx
reload_nginx_config() {
    section "Reloading Nginx"
    
    log "Testing Nginx configuration..."
    
    if nginx -t 2>&1 | grep -q "successful"; then
        success "Nginx configuration valid ✓"
    else
        error "Nginx configuration test failed"
        nginx -t
        
        # Restore backup
        local nginx_config="/etc/nginx/sites-available/$APP_NAME"
        local latest_backup=$(ls -t "$nginx_config.backup."* 2>/dev/null | head -1)
        
        if [[ -n "$latest_backup" ]]; then
            warning "Restoring backup: $latest_backup"
            cp "$latest_backup" "$nginx_config"
        fi
        
        exit 1
    fi
    
    log "Reloading Nginx..."
    systemctl reload nginx
    success "Nginx reloaded ✓"
}

# Display mode characteristics
display_mode_info() {
    local mode="$1"
    
    echo ""
    echo -e "${CYAN}Mode Characteristics:${NC}"
    
    if [[ "$mode" == "fast-changing" ]]; then
        echo -e "  ${YELLOW}Name:${NC}         fast-changing"
        echo -e "  ${YELLOW}Purpose:${NC}      Development on production server"
        echo -e "  ${YELLOW}Nginx Cache:${NC}  No cache, must-revalidate"
        echo -e "  ${YELLOW}PM2 Restart:${NC}  Delete/start (clears Nitro memory)"
        echo -e "  ${YELLOW}Performance:${NC}  Lower (more responsive to changes)"
        echo -e "  ${YELLOW}Use When:${NC}     Actively developing, testing changes"
        
    else
        echo -e "  ${YELLOW}Name:${NC}         stable-production"
        echo -e "  ${YELLOW}Purpose:${NC}      Stable releases, infrequent updates"
        echo -e "  ${YELLOW}Nginx Cache:${NC}  1 year, immutable (aggressive)"
        echo -e "  ${YELLOW}PM2 Restart:${NC}  Standard restart (fast, keeps cache)"
        echo -e "  ${YELLOW}Performance:${NC}  Maximum (optimized for CDN)"
        echo -e "  ${YELLOW}Use When:${NC}     Stable releases, production traffic"
    fi
    
    echo ""
}

# Display summary
display_summary() {
    local target_mode="$1"
    
    section "Cache Mode Switch Complete!"
    
    echo -e "${GREEN}✅ Successfully switched to: ${YELLOW}$target_mode${NC}"
    echo ""
    
    display_mode_info "$target_mode"
    
    echo -e "${CYAN}Impact:${NC}"
    echo ""
    
    if [[ "$target_mode" == "fast-changing" ]]; then
        echo -e "  ${GREEN}✓${NC} Nginx will not cache static assets"
        echo -e "  ${GREEN}✓${NC} Browser will always fetch latest content"
        echo -e "  ${GREEN}✓${NC} Rebuild script will clear Nitro memory on restart"
        echo -e "  ${YELLOW}⚠${NC}  Performance will be lower (more database/disk I/O)"
        
    else
        echo -e "  ${GREEN}✓${NC} Nginx will cache static assets for 1 year"
        echo -e "  ${GREEN}✓${NC} Browser will cache content aggressively"
        echo -e "  ${GREEN}✓${NC} Rebuild script will use fast restart"
        echo -e "  ${GREEN}✓${NC} Maximum performance (CDN-friendly)"
        echo -e "  ${YELLOW}⚠${NC}  May need to clear CDN cache after deployments"
    fi
    
    echo ""
    echo -e "${CYAN}Recommendations:${NC}"
    echo ""
    
    if [[ "$target_mode" == "fast-changing" ]]; then
        echo -e "  • Use rebuild script frequently: ${GREEN}bash dasei_rebuild_restart.sh${NC}"
        echo -e "  • Changes will be visible immediately after rebuild"
        echo -e "  • Switch back to stable-production when done developing"
        
    else
        echo -e "  • Clear browser cache to see changes: ${GREEN}Ctrl+Shift+R${NC}"
        echo -e "  • Clear CDN cache after deployments if using CDN"
        echo -e "  • Use content-hash filenames (already enabled)"
        echo -e "  • Monitor cache hit rates for optimization"
    fi
    
    echo ""
    echo -e "${CYAN}To switch back:${NC}"
    echo -e "  ${GREEN}sudo bash $SCRIPT_DIR/switch-cache-mode.sh${NC}"
    echo ""
}

# =============================================================================
# Main Execution
# =============================================================================

main() {
    display_banner
    
    local requested_mode="${1:-}"
    
    # Check prerequisites
    check_prerequisites_for_switch
    
    # Get current and target modes
    local current_mode=$(get_current_mode)
    local target_mode=$(determine_target_mode "$current_mode" "$requested_mode")
    
    # Show current state
    echo -e "${CYAN}Current Mode:${NC} ${YELLOW}$current_mode${NC}"
    echo -e "${CYAN}Target Mode:${NC}  ${YELLOW}$target_mode${NC}"
    echo ""
    
    # Check if already in target mode
    if [[ "$current_mode" == "$target_mode" ]]; then
        warning "Already in $target_mode mode"
        echo ""
        display_mode_info "$target_mode"
        exit 0
    fi
    
    # Confirm switch
    if ! confirm_action "Switch to $target_mode mode?"; then
        info "Cancelled"
        exit 0
    fi
    
    # Perform switch
    update_config_file "$target_mode"
    update_nginx_config "$target_mode"
    reload_nginx_config
    
    # Show summary
    display_summary "$target_mode"
}

# Run main function
if [[ "${BASH_SOURCE[0]}" == "${0}" ]]; then
    main "$@"
fi
