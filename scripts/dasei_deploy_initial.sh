#!/bin/bash

# =============================================================================
# Dasei - Initial Deployment Script
# =============================================================================
# Purpose: First-time deployment of dasei Nuxt SSG application
# Run as: pruvious user (or DEPLOY_USER from config)
# Location: /opt/dasei/source/scripts/
#
# This script:
# 1. Validates prerequisites and monorepo structure
# 2. Installs dependencies (triggers UI build via postinstall)
# 3. Builds the application (pnpm build:home)
# 4. Syncs to live directory
# 5. Creates PM2 ecosystem configuration
# 6. Starts the application
# 7. Prompts for domain/SSL setup
#
# Usage:
#   bash dasei_deploy_initial.sh
#   # Or with sudo as deploy user:
#   sudo -u pruvious bash dasei_deploy_initial.sh
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
    echo -e "${CYAN}║            Dasei - Initial Deployment Script               ║${NC}"
    echo -e "${CYAN}║                                                            ║${NC}"
    echo -e "${CYAN}║        Nuxt SSG Application (Monorepo Structure)           ║${NC}"
    echo -e "${CYAN}║                                                            ║${NC}"
    echo -e "${CYAN}╚════════════════════════════════════════════════════════════╝${NC}"
    echo ""
}

# Check prerequisites
check_prerequisites() {
    section "Step 1: Checking Prerequisites"
    
    local errors=0
    
    # Check not running as root
    if ! check_not_root; then
        errors=$((errors + 1))
    fi
    
    # Load configuration
    if ! load_config "$SCRIPT_DIR"; then
        errors=$((errors + 1))
    fi
    
    # Validate required config
    if ! validate_config DEPLOY_USER SOURCE_DIR LIVE_DIR LOGS_DIR APP_NAME APP_PORT APP_SUBDIRECTORY BUILD_COMMAND; then
        errors=$((errors + 1))
    fi
    
    # Check running as correct user
    if ! check_user "$DEPLOY_USER"; then
        errors=$((errors + 1))
    fi
    
    # Check Node.js
    if ! check_node_version 20; then
        error "Node.js 20+ is required"
        echo -e "${YELLOW}Install with nvm:${NC}"
        echo -e "  ${GREEN}curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.0/install.sh | bash${NC}"
        echo -e "  ${GREEN}nvm install 20${NC}"
        echo -e "  ${GREEN}nvm use 20${NC}"
        errors=$((errors + 1))
    fi
    
    # Check pnpm
    if ! check_pnpm_version 9; then
        errors=$((errors + 1))
    fi
    
    # Check PM2
    if ! check_pm2; then
        errors=$((errors + 1))
    fi
    
    # Check PostgreSQL client (warning only)
    check_postgres_client || true
    
    # Check directories
    if ! check_directory "$SOURCE_DIR" "Source"; then
        errors=$((errors + 1))
    fi
    
    # Check monorepo structure
    if ! check_monorepo_structure "$SOURCE_DIR"; then
        errors=$((errors + 1))
    fi
    
    # Check app subdirectory
    if [[ ! -d "$SOURCE_DIR/$APP_SUBDIRECTORY" ]]; then
        error "App directory not found: $SOURCE_DIR/$APP_SUBDIRECTORY"
        errors=$((errors + 1))
    else
        success "App directory exists ✓"
    fi
    
    if [[ $errors -gt 0 ]]; then
        error "Prerequisites check failed with $errors error(s)"
        exit 1
    fi
    
    success "All prerequisites satisfied ✓"
}

# Install dependencies
install_dependencies() {
    section "Step 2: Installing Dependencies"
    
    log "Changing to source directory: $SOURCE_DIR"
    cd "$SOURCE_DIR" || exit 1
    
    log "Running: pnpm install --frozen-lockfile"
    info "This will trigger postinstall hook which builds @crearis/ui package"
    
    local start_time=$(date +%s)
    
    if pnpm install --frozen-lockfile; then
        display_elapsed_time "$start_time"
        success "Dependencies installed ✓"
    else
        error "Dependency installation failed"
        exit 1
    fi
    
    # Verify UI package built
    if [[ -d "$SOURCE_DIR/packages/ui/dist" ]]; then
        success "UI package built successfully ✓"
    else
        warning "UI package dist directory not found"
        warning "Attempting manual UI build..."
        
        if pnpm --filter=ui build; then
            success "UI package built manually ✓"
        else
            error "UI package build failed"
            exit 1
        fi
    fi
}

# Build application
build_application() {
    section "Step 3: Building Application"
    
    cd "$SOURCE_DIR" || exit 1
    
    log "Running: pnpm $BUILD_COMMAND"
    info "Building from: $SOURCE_DIR"
    info "Target app: $APP_SUBDIRECTORY"
    
    local start_time=$(date +%s)
    
    if pnpm run "$BUILD_COMMAND"; then
        display_elapsed_time "$start_time"
        success "Application built successfully ✓"
    else
        error "Application build failed"
        exit 1
    fi
    
    # Verify build output
    local output_dir="$SOURCE_DIR/$APP_SUBDIRECTORY/.output"
    if [[ ! -d "$output_dir" ]]; then
        error "Build output not found: $output_dir"
        exit 1
    fi
    
    if [[ ! -f "$output_dir/server/index.mjs" ]]; then
        error "Nitro server entry point not found: $output_dir/server/index.mjs"
        exit 1
    fi
    
    success "Build output verified ✓"
    info "Output location: $output_dir"
}

# Create live directory structure
create_live_directory() {
    section "Step 4: Creating Live Directory"
    
    log "Creating live directory structure..."
    
    # Create directories
    create_directory_safe "$LIVE_DIR" "$DEPLOY_USER"
    create_directory_safe "$LOGS_DIR" "$DEPLOY_USER"
    
    success "Live directory structure created ✓"
}

# Sync build to live
sync_to_live() {
    section "Step 5: Syncing Build to Live Directory"
    
    local source_output="$SOURCE_DIR/$APP_SUBDIRECTORY/.output"
    local target_output="$LIVE_DIR/.output"
    
    log "Syncing: $source_output → $target_output"
    
    # Sync .output directory
    if rsync -a --delete "$source_output/" "$target_output/"; then
        success "Build output synced ✓"
    else
        error "Failed to sync build output"
        exit 1
    fi
    
    # Copy package.json for reference
    if [[ -f "$SOURCE_DIR/package.json" ]]; then
        cp "$SOURCE_DIR/package.json" "$LIVE_DIR/"
        success "Copied package.json ✓"
    fi
    
    info "Live directory ready at: $LIVE_DIR"
}

# Create PM2 ecosystem config
create_pm2_config() {
    section "Step 6: Creating PM2 Configuration"
    
    local ecosystem_file="$LIVE_DIR/ecosystem.config.cjs"
    
    log "Creating PM2 ecosystem config: $ecosystem_file"
    
    # Build environment variables
    local env_vars="NODE_ENV: 'production',
      PORT: $APP_PORT"
    
    # Add database config if provided
    if [[ -n "$DB_USER" ]]; then
        env_vars="$env_vars,
      DB_USER: '$DB_USER',
      DB_PASSWORD: '$DB_PASSWORD',
      DB_NAME: '$DB_NAME',
      DB_HOST: '$DB_HOST',
      DB_PORT: '$DB_PORT'"
    fi
    
    # Create config file
    cat > "$ecosystem_file" << EOF
module.exports = {
  apps: [{
    name: '$APP_NAME',
    cwd: '$LIVE_DIR',
    script: './.output/server/index.mjs',
    instances: ${PM2_INSTANCES:-1},
    exec_mode: '${PM2_EXEC_MODE:-cluster}',
    watch: false,
    max_memory_restart: '${MAX_MEMORY_RESTART:-1G}',
    env: {
      $env_vars
    },
    error_file: '$LOGS_DIR/error.log',
    out_file: '$LOGS_DIR/out.log',
    log_date_format: 'YYYY-MM-DD HH:mm:ss Z',
    merge_logs: true
  }]
};
EOF
    
    success "PM2 configuration created ✓"
    info "Config file: $ecosystem_file"
}

# Start PM2 process
start_pm2() {
    section "Step 7: Starting PM2 Process"
    
    cd "$LIVE_DIR" || exit 1
    
    # Check if process already exists
    if check_pm2_process "$APP_NAME"; then
        warning "PM2 process '$APP_NAME' already exists"
        
        if confirm_action "Delete and recreate process?"; then
            log "Deleting existing process..."
            pm2 delete "$APP_NAME" 2>/dev/null || true
        else
            info "Keeping existing process, will attempt restart..."
        fi
    fi
    
    # Start process
    log "Starting PM2 process: $APP_NAME"
    
    if pm2 start ecosystem.config.cjs; then
        success "PM2 process started ✓"
    else
        error "Failed to start PM2 process"
        exit 1
    fi
    
    # Save PM2 configuration
    log "Saving PM2 configuration..."
    pm2 save > /dev/null 2>&1
    
    # Wait a moment for process to initialize
    sleep 2
    
    # Check process status
    if pm2 describe "$APP_NAME" | grep -q "online"; then
        success "Process is online ✓"
    else
        error "Process failed to start"
        echo ""
        echo -e "${YELLOW}Check logs:${NC}"
        echo -e "  ${GREEN}pm2 logs $APP_NAME${NC}"
        exit 1
    fi
}

# Test application
test_application() {
    section "Step 8: Testing Application"
    
    log "Testing local connection..."
    
    sleep 1
    
    if curl -s "http://localhost:$APP_PORT" > /dev/null; then
        success "Application responding on port $APP_PORT ✓"
    else
        warning "Application not responding yet"
        warning "It may still be initializing..."
    fi
}

# Display next steps
display_next_steps() {
    section "Deployment Complete!"
    
    echo -e "${GREEN}✅ Application deployed successfully!${NC}"
    echo ""
    echo -e "${CYAN}Application Status:${NC}"
    pm2 describe "$APP_NAME" | grep -E "status|uptime|restarts|memory" || pm2 list | grep "$APP_NAME"
    echo ""
    echo -e "${CYAN}📋 Next Steps:${NC}"
    echo ""
    echo -e "${YELLOW}1. Test the application:${NC}"
    echo -e "   ${GREEN}curl http://localhost:$APP_PORT${NC}"
    echo ""
    echo -e "${YELLOW}2. View logs:${NC}"
    echo -e "   ${GREEN}pm2 logs $APP_NAME${NC}"
    echo -e "   ${GREEN}pm2 monit${NC}"
    echo ""
    echo -e "${YELLOW}3. Configure domain and SSL:${NC}"
    echo -e "   ${GREEN}sudo bash $SCRIPT_DIR/dasei_configure_domain.sh${NC}"
    echo ""
    echo -e "${YELLOW}4. For rebuilds during development:${NC}"
    echo -e "   ${GREEN}bash $SOURCE_DIR/$APP_SUBDIRECTORY/scripts/dasei_rebuild_restart.sh${NC}"
    echo ""
    echo -e "${CYAN}Quick Commands:${NC}"
    echo -e "  PM2 status:    ${GREEN}pm2 status${NC}"
    echo -e "  PM2 restart:   ${GREEN}pm2 restart $APP_NAME${NC}"
    echo -e "  PM2 stop:      ${GREEN}pm2 stop $APP_NAME${NC}"
    echo -e "  PM2 delete:    ${GREEN}pm2 delete $APP_NAME${NC}"
    echo ""
}

# Prompt for domain configuration
prompt_domain_config() {
    echo ""
    if confirm_action "Would you like to configure domain and SSL now?"; then
        echo ""
        log "Starting domain configuration script..."
        
        if [[ -f "$SCRIPT_DIR/dasei_configure_domain.sh" ]]; then
            exec sudo bash "$SCRIPT_DIR/dasei_configure_domain.sh"
        else
            error "Domain configuration script not found: $SCRIPT_DIR/dasei_configure_domain.sh"
            info "You can run it manually later"
        fi
    else
        info "You can configure domain and SSL later by running:"
        echo -e "  ${GREEN}sudo bash $SCRIPT_DIR/dasei_configure_domain.sh${NC}"
        echo ""
    fi
}

# =============================================================================
# Main Execution
# =============================================================================

main() {
    display_banner
    
    local start_time=$(date +%s)
    
    # Run all steps
    check_prerequisites
    install_dependencies
    build_application
    create_live_directory
    sync_to_live
    create_pm2_config
    start_pm2
    test_application
    
    # Show completion
    echo ""
    display_elapsed_time "$start_time"
    display_next_steps
    prompt_domain_config
}

# Run main function
if [[ "${BASH_SOURCE[0]}" == "${0}" ]]; then
    main "$@"
fi
