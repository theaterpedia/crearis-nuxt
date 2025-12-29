#!/bin/bash

# =============================================================================
# Common Functions for Dasei Deployment Scripts
# =============================================================================
# This file contains shared functions used across deployment scripts
# Source this file in other scripts: source "$(dirname "$0")/common_functions.sh"
# =============================================================================

# Colors for output
export RED='\033[0;31m'
export GREEN='\033[0;32m'
export YELLOW='\033[1;33m'
export BLUE='\033[0;34m'
export CYAN='\033[0;36m'
export NC='\033[0m' # No Color

# Logging functions
log() { echo -e "${BLUE}[$(date +'%Y-%m-%d %H:%M:%S')]${NC} $1"; }
error() { echo -e "${RED}[$(date +'%Y-%m-%d %H:%M:%S')] ERROR:${NC} $1" >&2; }
success() { echo -e "${GREEN}[$(date +'%Y-%m-%d %H:%M:%S')] SUCCESS:${NC} $1"; }
warning() { echo -e "${YELLOW}[$(date +'%Y-%m-%d %H:%M:%S')] WARNING:${NC} $1"; }
info() { echo -e "${CYAN}[$(date +'%Y-%m-%d %H:%M:%S')] INFO:${NC} $1"; }

# Print section header
section() {
    echo ""
    echo -e "${BLUE}============================================================${NC}"
    echo -e "${BLUE}  $1${NC}"
    echo -e "${BLUE}============================================================${NC}"
    echo ""
}

# Check if running as specific user
check_user() {
    local expected_user="$1"
    local current_user=$(whoami)
    
    if [[ "$current_user" != "$expected_user" ]]; then
        error "This script must be run as '$expected_user' user"
        error "Current user: $current_user"
        echo ""
        echo -e "${YELLOW}Run with:${NC}"
        echo -e "  ${GREEN}sudo -u $expected_user bash $0${NC}"
        echo ""
        return 1
    fi
    
    success "Running as $expected_user ✓"
    return 0
}

# Check if running as root
check_root() {
    if [[ $EUID -ne 0 ]]; then
        error "This script must be run as root (use sudo)"
        echo ""
        echo -e "${YELLOW}Run with:${NC}"
        echo -e "  ${GREEN}sudo bash $0${NC}"
        echo ""
        return 1
    fi
    
    success "Running as root ✓"
    return 0
}

# Check if NOT running as root
check_not_root() {
    if [[ $EUID -eq 0 ]]; then
        error "DO NOT run this script as root"
        error "Running as root can cause permission issues"
        echo ""
        echo -e "${YELLOW}Run with:${NC}"
        echo -e "  ${GREEN}sudo -u \$DEPLOY_USER bash $0${NC}"
        echo ""
        return 1
    fi
    
    success "Not running as root ✓"
    return 0
}

# Load configuration from .env.deploy
load_config() {
    local script_dir="${1:-$(cd "$(dirname "${BASH_SOURCE[1]}")" && pwd)}"
    local env_file="$script_dir/.env.deploy"
    
    log "Loading deployment configuration..."
    
    if [[ ! -f "$env_file" ]]; then
        error "Configuration file not found: $env_file"
        error "Please create it from the template:"
        echo ""
        echo -e "${GREEN}cp $script_dir/.env.deploy.example $env_file${NC}"
        echo -e "${GREEN}nano $env_file${NC}"
        echo ""
        return 1
    fi
    
    # Source the configuration
    set -a
    source "$env_file"
    set +a
    
    success "Configuration loaded ✓"
    return 0
}

# Validate required configuration variables
validate_config() {
    local required_vars=("$@")
    local missing_vars=()
    
    for var in "${required_vars[@]}"; do
        if [[ -z "${!var}" ]]; then
            missing_vars+=("$var")
        fi
    done
    
    if [[ ${#missing_vars[@]} -gt 0 ]]; then
        error "Missing required configuration variables:"
        for var in "${missing_vars[@]}"; do
            echo "  - $var"
        done
        return 1
    fi
    
    return 0
}

# Check if command exists
command_exists() {
    command -v "$1" &> /dev/null
}

# Check Node.js version (minimum required)
check_node_version() {
    local min_version="${1:-20}"
    
    if ! command_exists node; then
        error "Node.js not found"
        return 1
    fi
    
    local node_version=$(node --version | sed 's/v//' | cut -d. -f1)
    
    if [[ $node_version -lt $min_version ]]; then
        error "Node.js version $node_version found, but $min_version+ required"
        return 1
    fi
    
    success "Node.js v$node_version ✓"
    return 0
}

# Check pnpm version
check_pnpm_version() {
    local min_version="${1:-9}"
    
    if ! command_exists pnpm; then
        error "pnpm not found"
        echo ""
        echo -e "${YELLOW}Install pnpm:${NC}"
        echo -e "  ${GREEN}npm install -g pnpm${NC}"
        echo ""
        return 1
    fi
    
    local pnpm_version=$(pnpm --version | cut -d. -f1)
    
    if [[ $pnpm_version -lt $min_version ]]; then
        error "pnpm version $pnpm_version found, but $min_version+ required"
        return 1
    fi
    
    success "pnpm v$(pnpm --version) ✓"
    return 0
}

# Check if PostgreSQL client is available
check_postgres_client() {
    if ! command_exists psql; then
        warning "PostgreSQL client (psql) not found"
        warning "Database features will not be available"
        return 1
    fi
    
    success "PostgreSQL client available ✓"
    return 0
}

# Check if PM2 is available
check_pm2() {
    if ! command_exists pm2; then
        error "PM2 not found"
        echo ""
        echo -e "${YELLOW}Install PM2:${NC}"
        echo -e "  ${GREEN}npm install -g pm2${NC}"
        echo ""
        return 1
    fi
    
    success "PM2 $(pm2 --version) ✓"
    return 0
}

# Check if directory exists
check_directory() {
    local dir="$1"
    local name="$2"
    
    if [[ ! -d "$dir" ]]; then
        error "$name directory not found: $dir"
        return 1
    fi
    
    success "$name directory exists ✓"
    return 0
}

# Check monorepo structure
check_monorepo_structure() {
    local source_dir="$1"
    
    log "Validating monorepo structure..."
    
    # Check workspace file
    if [[ ! -f "$source_dir/pnpm-workspace.yaml" ]]; then
        error "Not a pnpm workspace: pnpm-workspace.yaml not found"
        return 1
    fi
    
    # Check apps directory
    if [[ ! -d "$source_dir/apps" ]]; then
        error "apps/ directory not found"
        return 1
    fi
    
    # Check packages directory
    if [[ ! -d "$source_dir/packages" ]]; then
        error "packages/ directory not found"
        return 1
    fi
    
    success "Monorepo structure valid ✓"
    return 0
}

# Check if PM2 process exists
check_pm2_process() {
    local app_name="$1"
    
    if pm2 describe "$app_name" &> /dev/null; then
        return 0
    else
        return 1
    fi
}

# Get cache mode from config
get_cache_mode() {
    echo "${CACHE_MODE:-stable-production}"
}

# Check if in fast-changing mode
is_fast_changing_mode() {
    local mode=$(get_cache_mode)
    [[ "$mode" == "fast-changing" ]]
}

# Display elapsed time
display_elapsed_time() {
    local start_time="$1"
    local end_time=$(date +%s)
    local elapsed=$((end_time - start_time))
    
    echo -e "${CYAN}Elapsed time: ${elapsed}s${NC}"
}

# Confirm action
confirm_action() {
    local message="$1"
    local default="${2:-n}"
    
    local prompt
    if [[ "$default" == "y" ]]; then
        prompt="[Y/n]"
    else
        prompt="[y/N]"
    fi
    
    echo -e "${YELLOW}$message $prompt${NC}"
    read -r response
    
    response="${response:-$default}"
    
    if [[ "$response" =~ ^[Yy]$ ]]; then
        return 0
    else
        return 1
    fi
}

# Create directory with correct permissions
create_directory_safe() {
    local dir="$1"
    local owner="${2:-$DEPLOY_USER}"
    
    if [[ ! -d "$dir" ]]; then
        mkdir -p "$dir"
        if [[ -n "$owner" && "$owner" != "$(whoami)" ]]; then
            chown -R "$owner:$owner" "$dir"
        fi
        success "Created directory: $dir"
    fi
}

# Export functions for use in other scripts
export -f log error success warning info section
export -f check_user check_root check_not_root
export -f load_config validate_config
export -f command_exists check_node_version check_pnpm_version
export -f check_postgres_client check_pm2 check_directory
export -f check_monorepo_structure check_pm2_process
export -f get_cache_mode is_fast_changing_mode
export -f display_elapsed_time confirm_action create_directory_safe
