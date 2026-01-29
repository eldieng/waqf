#!/bin/bash

# ===========================================
# Script de backup PostgreSQL
# Usage: ./backup-db.sh [nom_base]
# ===========================================

BACKUP_DIR="/var/backups/postgresql"
DATE=$(date +%Y%m%d_%H%M%S)
DB_USER="dbadmin"

# Créer le dossier de backup s'il n'existe pas
mkdir -p $BACKUP_DIR

# Couleurs
GREEN='\033[0;32m'
NC='\033[0m'

backup_database() {
    local db_name=$1
    local backup_file="$BACKUP_DIR/${db_name}_${DATE}.sql.gz"
    
    echo -e "${GREEN}[BACKUP]${NC} Sauvegarde de $db_name..."
    
    pg_dump -U $DB_USER $db_name | gzip > $backup_file
    
    if [ $? -eq 0 ]; then
        echo -e "${GREEN}[OK]${NC} Backup créé: $backup_file"
        
        # Supprimer les backups de plus de 7 jours
        find $BACKUP_DIR -name "${db_name}_*.sql.gz" -mtime +7 -delete
        echo -e "${GREEN}[OK]${NC} Anciens backups nettoyés"
    else
        echo "[ERROR] Échec du backup de $db_name"
        exit 1
    fi
}

# Si un nom de base est fourni, backup uniquement celle-ci
if [ -n "$1" ]; then
    backup_database $1
else
    # Sinon, backup toutes les bases
    backup_database "waqf_db"
    # Ajoutez vos autres bases ici
    # backup_database "projet2_db"
    # backup_database "projet3_db"
fi

echo -e "${GREEN}[DONE]${NC} Tous les backups terminés!"
ls -lh $BACKUP_DIR
