#!/bin/bash

# ===========================================
# Script de déploiement Waqf
# Usage: ./deploy.sh [backend|frontend|all]
# ===========================================

set -e

PROJECT_DIR="/var/www/waqf"
BACKEND_DIR="$PROJECT_DIR/backend"
FRONTEND_DIR="$PROJECT_DIR/frontend"

# Couleurs
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

log_info() {
    echo -e "${GREEN}[INFO]${NC} $1"
}

log_warn() {
    echo -e "${YELLOW}[WARN]${NC} $1"
}

log_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

deploy_backend() {
    log_info "🔧 Déploiement du Backend..."
    cd $BACKEND_DIR
    
    log_info "Installation des dépendances..."
    npm install --production=false
    
    log_info "Exécution des migrations Prisma..."
    npx prisma migrate deploy
    
    log_info "Génération du client Prisma..."
    npx prisma generate
    
    log_info "Build de l'application..."
    npm run build
    
    log_info "Redémarrage du backend..."
    pm2 restart waqf-backend || pm2 start ecosystem.config.js --only waqf-backend
    
    log_info "✅ Backend déployé avec succès!"
}

deploy_frontend() {
    log_info "🎨 Déploiement du Frontend..."
    cd $FRONTEND_DIR
    
    log_info "Installation des dépendances..."
    npm install
    
    log_info "Build de l'application..."
    npm run build
    
    log_info "Redémarrage du frontend..."
    pm2 restart waqf-frontend || pm2 start ecosystem.config.js --only waqf-frontend
    
    log_info "✅ Frontend déployé avec succès!"
}

pull_changes() {
    log_info "📥 Pull des dernières modifications..."
    cd $PROJECT_DIR
    git fetch origin
    git pull origin main
}

show_status() {
    log_info "📊 Statut des applications:"
    pm2 status
}

# Main
case "${1:-all}" in
    backend)
        pull_changes
        deploy_backend
        show_status
        ;;
    frontend)
        pull_changes
        deploy_frontend
        show_status
        ;;
    all)
        pull_changes
        deploy_backend
        deploy_frontend
        show_status
        ;;
    status)
        show_status
        ;;
    *)
        echo "Usage: $0 [backend|frontend|all|status]"
        exit 1
        ;;
esac

log_info "🎉 Déploiement terminé!"
