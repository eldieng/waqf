#!/bin/bash

# ===========================================
# Script d'installation initiale du serveur VPS
# Usage: curl -fsSL https://raw.githubusercontent.com/votre-repo/waqf/main/scripts/setup-server.sh | bash
# ===========================================

set -e

# Couleurs
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

log_info() { echo -e "${GREEN}[INFO]${NC} $1"; }
log_warn() { echo -e "${YELLOW}[WARN]${NC} $1"; }
log_error() { echo -e "${RED}[ERROR]${NC} $1"; }
log_step() { echo -e "${BLUE}[STEP]${NC} $1"; }

# ===========================================
# ÉTAPE 1: Mise à jour du système
# ===========================================
log_step "1/8 - Mise à jour du système..."
apt update && apt upgrade -y

# ===========================================
# ÉTAPE 2: Installation des outils de base
# ===========================================
log_step "2/8 - Installation des outils de base..."
apt install -y curl wget git nano htop ufw fail2ban

# ===========================================
# ÉTAPE 3: Configuration du pare-feu
# ===========================================
log_step "3/8 - Configuration du pare-feu..."
ufw allow OpenSSH
ufw allow 80
ufw allow 443
ufw --force enable
log_info "Pare-feu configuré"

# ===========================================
# ÉTAPE 4: Installation de Node.js via NVM
# ===========================================
log_step "4/8 - Installation de Node.js..."
curl -fsSL https://raw.githubusercontent.com/nvm-sh/nvm/v0.40.0/install.sh | bash

export NVM_DIR="$HOME/.nvm"
[ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"

nvm install 20
nvm use 20
nvm alias default 20

npm install -g pm2 yarn
log_info "Node.js $(node -v) installé"

# ===========================================
# ÉTAPE 5: Installation de PostgreSQL
# ===========================================
log_step "5/8 - Installation de PostgreSQL..."
apt install -y postgresql postgresql-contrib
systemctl enable postgresql
systemctl start postgresql
log_info "PostgreSQL installé et démarré"

# ===========================================
# ÉTAPE 6: Installation de Nginx
# ===========================================
log_step "6/8 - Installation de Nginx..."
apt install -y nginx
systemctl enable nginx
systemctl start nginx
log_info "Nginx installé et démarré"

# ===========================================
# ÉTAPE 7: Installation de Certbot
# ===========================================
log_step "7/8 - Installation de Certbot..."
apt install -y certbot python3-certbot-nginx
log_info "Certbot installé"

# ===========================================
# ÉTAPE 8: Création de la structure
# ===========================================
log_step "8/8 - Création de la structure..."
mkdir -p /var/www
mkdir -p /var/log/pm2
mkdir -p /var/backups/postgresql
log_info "Structure créée"

# ===========================================
# RÉSUMÉ
# ===========================================
echo ""
echo "=========================================="
echo -e "${GREEN}✅ Installation terminée!${NC}"
echo "=========================================="
echo ""
echo "Versions installées:"
echo "  - Node.js: $(node -v)"
echo "  - NPM: $(npm -v)"
echo "  - PM2: $(pm2 -v)"
echo "  - PostgreSQL: $(psql --version | head -1)"
echo "  - Nginx: $(nginx -v 2>&1)"
echo ""
echo "Prochaines étapes:"
echo "  1. Créer les bases PostgreSQL:"
echo "     sudo -u postgres psql"
echo "     CREATE USER dbadmin WITH PASSWORD 'votre_mot_de_passe';"
echo "     CREATE DATABASE waqf_db OWNER dbadmin;"
echo ""
echo "  2. Cloner votre projet:"
echo "     cd /var/www"
echo "     git clone https://github.com/votre-repo/waqf.git"
echo ""
echo "  3. Configurer et déployer:"
echo "     cd /var/www/waqf"
echo "     ./scripts/deploy.sh"
echo ""
echo "  4. Configurer Nginx:"
echo "     cp /var/www/waqf/nginx/waqf.conf /etc/nginx/sites-available/"
echo "     ln -s /etc/nginx/sites-available/waqf.conf /etc/nginx/sites-enabled/"
echo "     nginx -t && systemctl reload nginx"
echo ""
echo "  5. Installer SSL:"
echo "     certbot --nginx -d votre-domaine.com"
echo ""
