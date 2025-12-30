#!/bin/bash

# =============================================================================
# Dasei - Rebuild & Restart Script
# =============================================================================
# Purpose: Fast rebuild and redeploy for development
# Run as: pruvious user (or DEPLOY_USER)
# Location: /opt/dasei/source/apps/home/scripts/
#
# This script provides a quick workflow for server-side development:
# 1. Make code changes (frontend or backend)
# 2. Run this script
# 3. Refresh browser to see changes
#
# Features:
# - Fast incremental build
# - Optional dependency/UI rebuild
# - Smart PM2 restart (delete/start vs restart based on cache mode)
# - Build time reporting
# - No git operations
#
# Usage:
#   bash dasei_rebuild_restart.sh           # Standard rebuild
#   bash dasei_rebuild_restart.sh --deps    # Rebuild with dependencies
#   bash dasei_rebuild_restart.sh --ui      # Rebuild UI package only
#   bash dasei_rebuild_restart.sh --no-restart  # Build but don't restart
# =============================================================================

set -e  # Exit on error

# Get script directory and find common functions
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
COMMON_FUNCTIONS="$SCRIPT_DIR/../../../scripts/common_functions.sh"

# Source common functions
if [[ -f "$COMMON_FUNCTIONS" ]]; then
    source "$COMMON_FUNCTIONS"
else
    echo "ERROR: common_functions.sh not found at $COMMON_FUNCTIONS"
    exit 1
fi

# Parse command line arguments
REBUILD_DEPS=false
REBUILD_UI=false
NO_RESTART=false

while [[ $# -gt 0 ]]; do
    case $1 in
        --deps|-d)
            REBUILD_DEPS=true
            shift
            ;;
        --ui|-u)
            REBUILD_UI=true
            shift
            ;;
        --no-restart|-n)
            NO_RESTART=true
            shift
            ;;
        *)
            echo "Unknown option: $1"
            echo "Usage: $0 [--deps] [--ui] [--no-restart]"
            exit 1
            ;;
    esac
done

# =============================================================================
# Main Functions
# =============================================================================

# Display banner
display_banner() {
    echo ""
    echo -e "${CYAN}╔════════════════════════════════════════════════════════════╗${NC}"
    echo -e "${CYAN}║                                                            ║${NC}"
    echo -e "${CYAN}║           Dasei - Rebuild & Restart Script                 ║${NC}"
    echo -e "${CYAN}║                                                            ║${NC}"
    echo -e "${CYAN}║         Fast Development Cycle for Production              ║${NC}"
    echo -e "${CYAN}║                                                            ║${NC}"
    echo -e "${CYAN}╚════════════════════════════════════════════════════════════╝${NC}"
    echo ""
}

# Initialize and check
initialize() {
    section "Initializing"
    
    # Check not running as root
    if ! check_not_root; then
        exit 1
    fi
    
    # Load configuration from root scripts directory
    local config_dir="$SCRIPT_DIR/../../../scripts"
    if ! load_config "$config_dir"; then
        exit 1
    fi
    
    # Validate required config
    if ! validate_config DEPLOY_USER SOURCE_DIR LIVE_DIR APP_NAME APP_SUBDIRECTORY BUILD_COMMAND; then
        exit 1
    fi
    
    # Check running as correct user
    if ! check_user "$DEPLOY_USER"; then
        exit 1
    fi
    
    # CRITICAL: Check PM2 user (must be pruvious, never root!)
    if ! check_pm2_user "$DEPLOY_USER"; then
        exit 1
    fi
    
    # Display configuration
    info "Source: $SOURCE_DIR"
    info "Live: $LIVE_DIR"
    info "App: $APP_SUBDIRECTORY"
    info "Build: pnpm $BUILD_COMMAND"
    
    # Display options
    if [[ "$REBUILD_DEPS" == "true" ]]; then
        info "Mode: Rebuild with dependencies"
    elif [[ "$REBUILD_UI" == "true" ]]; then
        info "Mode: Rebuild UI package only"
    else
        info "Mode: Standard rebuild"
    fi
    
    if [[ "$NO_RESTART" == "true" ]]; then
        warning "PM2 restart will be skipped"
    fi
    
    success "Initialization complete ✓"
}

# Optional: Rebuild dependencies
rebuild_dependencies() {
    if [[ "$REBUILD_DEPS" != "true" ]]; then
        return 0
    fi
    
    section "Step 1: Rebuilding Dependencies"
    
    cd "$SOURCE_DIR" || exit 1
    
    log "Running: pnpm install"
    info "This will trigger postinstall hook (builds UI)"
    
    local start_time=$(date +%s)
    
    if pnpm install; then
        display_elapsed_time "$start_time"
        success "Dependencies rebuilt ✓"
    else
        error "Dependency rebuild failed"
        exit 1
    fi
}

# Optional: Rebuild UI only
rebuild_ui() {
    if [[ "$REBUILD_UI" != "true" || "$REBUILD_DEPS" == "true" ]]; then
        return 0
    fi
    
    section "Step 1: Rebuilding UI Package"
    
    cd "$SOURCE_DIR" || exit 1
    
    log "Running: pnpm --filter=ui build"
    
    local start_time=$(date +%s)
    
    if pnpm --filter=ui build; then
        display_elapsed_time "$start_time"
        success "UI package rebuilt ✓"
    else
        error "UI rebuild failed"
        exit 1
    fi
}

# Build application
build_application() {
    local step_num="Step 1"
    if [[ "$REBUILD_DEPS" == "true" || "$REBUILD_UI" == "true" ]]; then
        step_num="Step 2"
    fi
    
    section "$step_num: Building Application"
    
    cd "$SOURCE_DIR" || exit 1
    
    log "Running: pnpm $BUILD_COMMAND"
    
    local start_time=$(date +%s)
    
    if pnpm run "$BUILD_COMMAND"; then
        local elapsed=$(($(date +%s) - start_time))
        echo ""
        success "Build completed in ${elapsed}s ✓"
    else
        error "Build failed"
        echo ""
        error "Fix the errors above and try again"
        exit 1
    fi
}

# Sync to live directory
sync_to_live() {
    local step_num="Step 2"
    if [[ "$REBUILD_DEPS" == "true" || "$REBUILD_UI" == "true" ]]; then
        step_num="Step 3"
    fi
    
    section "$step_num: Syncing to Live Directory"
    
    local source_output="$SOURCE_DIR/$APP_SUBDIRECTORY/.output"
    local target_output="$LIVE_DIR/.output"
    
    log "Syncing: $source_output → $target_output"
    
    if [[ ! -d "$source_output" ]]; then
        error "Build output not found: $source_output"
        exit 1
    fi
    
    # Fast incremental sync
    if rsync -a --delete "$source_output/" "$target_output/"; then
        success "Synced to live directory ✓"
    else
        error "Sync failed"
        exit 1
    fi
    
    # Copy package.json for reference
    if [[ -f "$SOURCE_DIR/package.json" ]]; then
        cp "$SOURCE_DIR/package.json" "$LIVE_DIR/"
    fi
    
    # Copy ecosystem config if present
    if [[ -f "$SOURCE_DIR/apps/home/ecosystem.config.cjs" ]]; then
        cp "$SOURCE_DIR/apps/home/ecosystem.config.cjs" "$LIVE_DIR/"
    fi
}

# Restart PM2
restart_pm2() {
    if [[ "$NO_RESTART" == "true" ]]; then
        section "PM2 Restart Skipped"
        warning "Build complete but PM2 not restarted (--no-restart flag)"
        return 0
    fi
    
    local step_num="Step 3"
    if [[ "$REBUILD_DEPS" == "true" || "$REBUILD_UI" == "true" ]]; then
        step_num="Step 4"
    fi
    
    section "$step_num: Restarting PM2 Process"
    
    cd "$LIVE_DIR" || exit 1
    
    # Check if process exists
    if ! check_pm2_process "$APP_NAME"; then
        error "PM2 process '$APP_NAME' not found"
        echo ""
        echo -e "${YELLOW}Start it with:${NC}"
        echo -e "  ${GREEN}cd $LIVE_DIR && pm2 start ecosystem.config.cjs${NC}"
        exit 1
    fi
    
    # Determine restart strategy based on cache mode
    if is_fast_changing_mode; then
        log "Cache mode: fast-changing (using delete/start to clear memory)"
        
        # Delete and recreate to clear Nitro memory cache
        pm2 delete "$APP_NAME" 2>/dev/null || true
        
        if pm2 start ecosystem.config.cjs; then
            success "Process restarted (memory cleared) ✓"
        else
            error "Failed to start process"
            exit 1
        fi
    else
        log "Cache mode: stable-production (using standard restart)"
        
        # Standard restart (faster, keeps cache)
        if pm2 restart "$APP_NAME" --update-env; then
            success "Process restarted ✓"
        else
            error "Failed to restart process"
            exit 1
        fi
    fi
    
    # Save PM2 configuration
    pm2 save > /dev/null 2>&1
    
    # Wait for process to initialize
    sleep 2
    
    # Verify process is online
    if pm2 describe "$APP_NAME" | grep -q "online"; then
        success "Process is online ✓"
    else
        error "Process is not online"
        echo ""
        echo -e "${YELLOW}Check logs:${NC}"
        echo -e "  ${GREEN}pm2 logs $APP_NAME${NC}"
    fi
}

# Display results
display_results() {
    section "Rebuild Complete!"
    
    echo -e "${GREEN}✅ Application rebuilt and restarted successfully!${NC}"
    echo ""
    
    # Show PM2 status
    echo -e "${CYAN}📊 PM2 Status:${NC}"
    pm2 describe "$APP_NAME" | grep -E "status|uptime|restarts|memory|cpu" || pm2 list | grep "$APP_NAME"
    echo ""
    
    echo -e "${CYAN}💡 Next Steps:${NC}"
    echo -e "   1. Refresh browser to see changes"
    echo -e "   2. Check logs: ${GREEN}pm2 logs $APP_NAME${NC}"
    echo -e "   3. Monitor: ${GREEN}pm2 monit${NC}"
    echo ""
    
    # Show last log lines
    echo -e "${CYAN}📋 Last 5 Log Lines:${NC}"
    echo -e "${BLUE}─────────────────────────────────────────────────────────${NC}"
    pm2 logs "$APP_NAME" --lines 5 --nostream 2>/dev/null || echo "No logs available"
    echo ""
}

# =============================================================================
# Main Execution
# =============================================================================

main() {
    display_banner
    
    local start_time=$(date +%s)
    
    # Run steps
    initialize
    rebuild_dependencies
    rebuild_ui
    build_application
    sync_to_live
    restart_pm2
    
    # Show results
    echo ""
    display_elapsed_time "$start_time"
    display_results
}

# Run main function
if [[ "${BASH_SOURCE[0]}" == "${0}" ]]; then
    main "$@"
fi
