# 📜 Dasei Deployment Scripts

This directory contains server-side deployment scripts for the dasei.eu application.

## 📁 Script Organization

### Common Scripts (source/scripts/)
Server-side scripts that are application-agnostic:
- `common_functions.sh` - Shared shell functions (logging, checks, config loading)
- `dasei_deploy_initial.sh` - Initial deployment script
- `dasei_configure_domain.sh` - Domain and SSL configuration  
- `switch-cache-mode.sh` - Cache mode switcher (fast-changing ↔ stable-production)

### App-Specific Scripts (source/apps/home/scripts/)
Scripts specific to the dasei home application:
- `dasei_rebuild_restart.sh` - Fast rebuild and restart for development

## 🚀 Deployment Scripts

### 1. Initial Deployment

**Script:** `dasei_deploy_initial.sh`  
**Run as:** `pruvious` user  
**Purpose:** First-time deployment from scratch

```bash
cd /opt/dasei/source/scripts
bash dasei_deploy_initial.sh
```

**What it does:**
1. Validates prerequisites (Node.js, pnpm, PM2)
2. Installs dependencies (triggers UI build)
3. Builds application (`pnpm build:home`)
4. Syncs to live directory
5. Creates PM2 configuration
6. Starts application
7. Prompts for domain/SSL setup

### 2. Domain Configuration

**Script:** `dasei_configure_domain.sh`  
**Run as:** `root`  
**Purpose:** Configure Nginx and SSL certificates

```bash
cd /opt/dasei/source/scripts
sudo bash dasei_configure_domain.sh
```

**Prerequisites:**
- Application running in PM2
- Domain DNS pointing to server
- Nginx and Certbot installed

**What it does:**
1. Creates Nginx reverse proxy config
2. Obtains Let's Encrypt SSL certificate
3. Configures HTTPS with redirect
4. Sets up auto-renewal

### 3. Fast Rebuild

**Script:** `dasei_rebuild_restart.sh`  
**Run as:** `pruvious` user  
**Purpose:** Quick rebuild for development

```bash
cd /opt/dasei/source/apps/home/scripts
bash dasei_rebuild_restart.sh

# With options:
bash dasei_rebuild_restart.sh --deps      # Rebuild dependencies
bash dasei_rebuild_restart.sh --ui        # Rebuild UI package only
bash dasei_rebuild_restart.sh --no-restart  # Build without PM2 restart
```

**What it does:**
1. Rebuilds application
2. Syncs to live directory
3. Restarts PM2 (strategy depends on cache mode)

### 4. Cache Mode Switcher

**Script:** `switch-cache-mode.sh`  
**Run as:** `root`  
**Purpose:** Switch between cache modes

```bash
cd /opt/dasei/source/scripts

# Switch to specific mode
sudo bash switch-cache-mode.sh fast-changing
sudo bash switch-cache-mode.sh stable-production

# Toggle between modes
sudo bash switch-cache-mode.sh
```

**Cache Modes:**

| Mode | Nginx Cache | PM2 Restart | Use When |
|------|-------------|-------------|----------|
| `fast-changing` | No cache | Delete/start | Active development |
| `stable-production` | 1 year | Standard restart | Stable releases |

## 📋 Configuration

### Setup

1. Copy template:
   ```bash
   cd /opt/dasei/source/scripts
   cp .env.deploy.example .env.deploy
   ```

2. Edit configuration:
   ```bash
   nano .env.deploy
   ```

### Required Settings

```bash
# System
DEPLOY_USER="pruvious"
SOURCE_DIR="/opt/dasei/source"
LIVE_DIR="/opt/dasei/live"
LOGS_DIR="/opt/dasei/logs"

# Application
APP_NAME="dasei"
APP_PORT="3200"
APP_SUBDIRECTORY="apps/home"
BUILD_COMMAND="build:home"

# Domain
PRIMARY_DOMAIN="dasei.eu"
ADDITIONAL_DOMAINS="www.dasei.eu"
SSL_EMAIL="admin@dasei.eu"

# Performance
CACHE_MODE="stable-production"
```

## 🔧 Common Functions

The `common_functions.sh` file provides reusable functions:

### Logging
- `log()` - Blue info message
- `error()` - Red error message
- `success()` - Green success message
- `warning()` - Yellow warning message
- `info()` - Cyan info message
- `section()` - Section header

### Validation
- `check_user()` - Verify running as correct user
- `check_root()` - Verify running as root
- `check_not_root()` - Verify NOT running as root
- `load_config()` - Load .env.deploy file
- `validate_config()` - Validate required variables
- `command_exists()` - Check if command available
- `check_node_version()` - Validate Node.js version
- `check_pnpm_version()` - Validate pnpm version
- `check_pm2()` - Check PM2 installed
- `check_monorepo_structure()` - Validate monorepo

### Cache Mode
- `get_cache_mode()` - Get current cache mode
- `is_fast_changing_mode()` - Check if in fast-changing mode

### Utilities
- `display_elapsed_time()` - Show execution time
- `confirm_action()` - Interactive confirmation
- `create_directory_safe()` - Create dir with correct ownership

## 📚 Documentation

For detailed instructions, see:
- `/opt/dasei/docs/N-D00-Deployment-Guide-Dasei.md` - Complete deployment guide
- `/opt/dasei/docs/N-D01-Quick-Reference-Dasei.md` - Quick command reference

## 🛠️ Development Workflow

### Typical Development Cycle

1. **Make changes** to code/content
   ```bash
   nano /opt/dasei/source/apps/home/content/blog/post.md
   ```

2. **Rebuild and restart**
   ```bash
   bash /opt/dasei/source/apps/home/scripts/dasei_rebuild_restart.sh
   ```

3. **View logs**
   ```bash
   pm2 logs dasei --lines 20
   ```

4. **Test changes**
   ```bash
   curl https://dasei.eu
   ```

### For UI Component Changes

1. **Edit component**
   ```bash
   nano /opt/dasei/source/packages/ui/src/MyComponent.vue
   ```

2. **Rebuild with UI**
   ```bash
   bash /opt/dasei/source/apps/home/scripts/dasei_rebuild_restart.sh --ui
   ```

### For Dependency Changes

1. **Update package.json**
   ```bash
   nano /opt/dasei/source/package.json
   ```

2. **Rebuild with dependencies**
   ```bash
   bash /opt/dasei/source/apps/home/scripts/dasei_rebuild_restart.sh --deps
   ```

## 🔍 Troubleshooting

### Script Fails

1. **Check logs** - Scripts provide detailed error messages
2. **Verify user** - Must run as correct user (pruvious or root)
3. **Check permissions** - Scripts must be executable

```bash
chmod +x /opt/dasei/source/scripts/*.sh
chmod +x /opt/dasei/source/apps/home/scripts/*.sh
```

### Build Errors

1. **Clean install**
   ```bash
   cd /opt/dasei/source
   rm -rf node_modules packages/*/node_modules apps/*/node_modules
   pnpm install
   ```

2. **Rebuild manually**
   ```bash
   pnpm --filter=ui build
   pnpm build:home
   ```

## 📞 Support

- Review script output for detailed error messages
- Check deployment guide: `/opt/dasei/docs/N-D00-Deployment-Guide-Dasei.md`
- View application logs: `pm2 logs dasei`
- Check system logs: `tail -f /opt/dasei/logs/*.log`

---

**Last Updated:** November 25, 2025
