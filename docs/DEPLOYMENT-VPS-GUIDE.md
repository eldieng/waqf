# 🚀 Guide de Déploiement Multi-Projets sur VPS Hostinger

Ce guide vous permet de déployer **plusieurs projets Node.js** (NestJS, Next.js, Express, etc.) sur un seul VPS avec PostgreSQL.

---

## 📋 Prérequis

- Un VPS Hostinger (KVM 2 recommandé : 2 vCPU, 8 Go RAM)
- Un ou plusieurs noms de domaine
- Accès SSH (terminal ou PuTTY sur Windows)

---

## 🔧 Étape 1 : Connexion au VPS

Après achat du VPS, vous recevrez :
- **IP du serveur** : ex. `123.45.67.89`
- **Mot de passe root**

### Connexion SSH

```bash
# Depuis Linux/Mac
ssh root@123.45.67.89

# Depuis Windows (PowerShell)
ssh root@123.45.67.89

# Ou utilisez PuTTY
```

---

## 🛡️ Étape 2 : Sécurisation du serveur

```bash
# Mettre à jour le système
apt update && apt upgrade -y

# Créer un utilisateur non-root (remplacez 'deploy' par votre nom)
adduser deploy
usermod -aG sudo deploy

# Configurer SSH pour l'utilisateur
mkdir -p /home/deploy/.ssh
cp ~/.ssh/authorized_keys /home/deploy/.ssh/ 2>/dev/null || true
chown -R deploy:deploy /home/deploy/.ssh

# Installer le pare-feu
apt install ufw -y
ufw allow OpenSSH
ufw allow 80
ufw allow 443
ufw --force enable

# Installer fail2ban (protection contre les attaques)
apt install fail2ban -y
systemctl enable fail2ban
systemctl start fail2ban
```

---

## 📦 Étape 3 : Installer Node.js (via NVM)

```bash
# Installer NVM
curl -fsSL https://raw.githubusercontent.com/nvm-sh/nvm/v0.40.0/install.sh | bash

# Recharger le terminal
source ~/.bashrc

# Installer Node.js 20 LTS
nvm install 20
nvm use 20
nvm alias default 20

# Vérifier l'installation
node -v  # v20.x.x
npm -v   # 10.x.x

# Installer les outils globaux
npm install -g pm2 yarn
```

---

## 🐘 Étape 4 : Installer PostgreSQL

```bash
# Installer PostgreSQL
apt install postgresql postgresql-contrib -y

# Démarrer et activer PostgreSQL
systemctl enable postgresql
systemctl start postgresql

# Vérifier le statut
systemctl status postgresql
```

### Créer les bases de données pour vos projets

```bash
# Se connecter à PostgreSQL
sudo -u postgres psql

# Créer un utilisateur principal
CREATE USER dbadmin WITH PASSWORD 'VotreMotDePasseSecurise123!';
ALTER USER dbadmin CREATEDB;

# Créer les bases pour chaque projet
CREATE DATABASE waqf_db OWNER dbadmin;
CREATE DATABASE projet2_db OWNER dbadmin;
CREATE DATABASE projet3_db OWNER dbadmin;

# Donner les permissions
GRANT ALL PRIVILEGES ON DATABASE waqf_db TO dbadmin;
GRANT ALL PRIVILEGES ON DATABASE projet2_db TO dbadmin;
GRANT ALL PRIVILEGES ON DATABASE projet3_db TO dbadmin;

# Quitter
\q
```

### URLs de connexion

```
# Projet Waqf
DATABASE_URL=postgresql://dbadmin:VotreMotDePasseSecurise123!@localhost:5432/waqf_db

# Projet 2
DATABASE_URL=postgresql://dbadmin:VotreMotDePasseSecurise123!@localhost:5432/projet2_db

# Projet 3
DATABASE_URL=postgresql://dbadmin:VotreMotDePasseSecurise123!@localhost:5432/projet3_db
```

---

## 🌐 Étape 5 : Installer Nginx

```bash
# Installer Nginx
apt install nginx -y

# Démarrer et activer
systemctl enable nginx
systemctl start nginx

# Vérifier
systemctl status nginx
```

---

## 📁 Étape 6 : Structure des projets

Créer la structure de dossiers :

```bash
# Créer le dossier principal
mkdir -p /var/www
cd /var/www

# Structure recommandée
/var/www/
├── waqf/
│   ├── backend/      # NestJS API (port 3001)
│   └── frontend/     # Next.js (port 3000)
├── projet2/          # Autre projet (port 4000)
├── projet3/          # Autre projet (port 5000)
└── ...
```

---

## 🚀 Étape 7 : Déployer le projet Waqf

### 7.1 Cloner le projet

```bash
cd /var/www
git clone https://github.com/votre-username/waqf.git
cd waqf
```

### 7.2 Configurer le Backend (NestJS)

```bash
cd /var/www/waqf/backend

# Installer les dépendances
npm install

# Créer le fichier .env
nano .env
```

Contenu du fichier `.env` backend :

```env
# Database
DATABASE_URL=postgresql://dbadmin:VotreMotDePasseSecurise123!@localhost:5432/waqf_db

# JWT
JWT_SECRET=votre-secret-jwt-tres-long-et-securise-minimum-32-caracteres
JWT_EXPIRES_IN=7d

# Server
PORT=3001
NODE_ENV=production

# Cloudinary
CLOUDINARY_CLOUD_NAME=dbw2obgrj
CLOUDINARY_API_KEY=848296998124334
CLOUDINARY_API_SECRET=8joW6PltE2KpMIudtwp6fzVXQ0M

# Frontend URL (pour CORS)
FRONTEND_URL=https://waqf-daara.org
```

```bash
# Exécuter les migrations Prisma
npx prisma migrate deploy

# Générer le client Prisma
npx prisma generate

# Builder l'application
npm run build
```

### 7.3 Configurer le Frontend (Next.js)

```bash
cd /var/www/waqf/frontend

# Installer les dépendances
npm install

# Créer le fichier .env.local
nano .env.local
```

Contenu du fichier `.env.local` frontend :

```env
NEXT_PUBLIC_API_URL=https://api.waqf-daara.org
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=dbw2obgrj
NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET=waqf_unsigned
```

```bash
# Builder l'application
npm run build
```

---

## ⚙️ Étape 8 : Configurer PM2

PM2 garde vos applications en ligne 24/7.

### 8.1 Créer le fichier de configuration PM2

```bash
nano /var/www/waqf/ecosystem.config.js
```

```javascript
module.exports = {
  apps: [
    // Waqf Backend (NestJS)
    {
      name: 'waqf-backend',
      cwd: '/var/www/waqf/backend',
      script: 'dist/main.js',
      instances: 1,
      exec_mode: 'fork',
      env: {
        NODE_ENV: 'production',
        PORT: 3001
      }
    },
    // Waqf Frontend (Next.js)
    {
      name: 'waqf-frontend',
      cwd: '/var/www/waqf/frontend',
      script: 'node_modules/next/dist/bin/next',
      args: 'start -p 3000',
      instances: 1,
      exec_mode: 'fork',
      env: {
        NODE_ENV: 'production',
        PORT: 3000
      }
    }
  ]
};
```

### 8.2 Démarrer les applications

```bash
cd /var/www/waqf

# Démarrer toutes les apps
pm2 start ecosystem.config.js

# Sauvegarder la configuration
pm2 save

# Configurer le démarrage automatique
pm2 startup
# Exécutez la commande affichée par pm2 startup

# Vérifier le statut
pm2 status
pm2 logs
```

### 8.3 Commandes PM2 utiles

```bash
pm2 status              # Voir le statut
pm2 logs                # Voir les logs
pm2 logs waqf-backend   # Logs d'une app spécifique
pm2 restart all         # Redémarrer tout
pm2 restart waqf-backend # Redémarrer une app
pm2 stop all            # Arrêter tout
pm2 delete all          # Supprimer tout
```

---

## 🔀 Étape 9 : Configurer Nginx (Reverse Proxy)

### 9.1 Configuration pour Waqf

```bash
nano /etc/nginx/sites-available/waqf.conf
```

```nginx
# Frontend Waqf - waqf-daara.org
server {
    listen 80;
    server_name waqf-daara.org www.waqf-daara.org;

    location / {
        proxy_pass http://127.0.0.1:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }
}

# Backend API Waqf - api.waqf-daara.org
server {
    listen 80;
    server_name api.waqf-daara.org;

    location / {
        proxy_pass http://127.0.0.1:3001;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
        
        # Augmenter la taille max des uploads
        client_max_body_size 50M;
    }
}
```

### 9.2 Configuration pour d'autres projets

```bash
nano /etc/nginx/sites-available/projet2.conf
```

```nginx
# Projet 2 - projet2.com
server {
    listen 80;
    server_name projet2.com www.projet2.com;

    location / {
        proxy_pass http://127.0.0.1:4000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }
}
```

### 9.3 Activer les configurations

```bash
# Activer les sites
ln -s /etc/nginx/sites-available/waqf.conf /etc/nginx/sites-enabled/
ln -s /etc/nginx/sites-available/projet2.conf /etc/nginx/sites-enabled/

# Tester la configuration
nginx -t

# Recharger Nginx
systemctl reload nginx
```

---

## 🔒 Étape 10 : Installer SSL (HTTPS)

### 10.1 Configurer les DNS

Dans **hPanel Hostinger** (ou votre registrar DNS) :

| Type | Nom | Valeur |
|------|-----|--------|
| A | @ | 123.45.67.89 (IP du VPS) |
| A | www | 123.45.67.89 |
| A | api | 123.45.67.89 |

Attendez 5-30 minutes pour la propagation DNS.

### 10.2 Installer Certbot

```bash
# Installer Certbot
apt install certbot python3-certbot-nginx -y

# Obtenir les certificats SSL pour Waqf
certbot --nginx -d waqf-daara.org -d www.waqf-daara.org -d api.waqf-daara.org

# Pour d'autres projets
certbot --nginx -d projet2.com -d www.projet2.com

# Vérifier le renouvellement automatique
certbot renew --dry-run
```

---

## 🔄 Étape 11 : Script de déploiement automatique

Créez un script pour faciliter les mises à jour :

```bash
nano /var/www/waqf/deploy.sh
```

```bash
#!/bin/bash

echo "🚀 Déploiement Waqf..."

cd /var/www/waqf

# Pull les dernières modifications
echo "📥 Pull Git..."
git pull origin main

# Backend
echo "🔧 Build Backend..."
cd /var/www/waqf/backend
npm install
npx prisma migrate deploy
npx prisma generate
npm run build

# Frontend
echo "🎨 Build Frontend..."
cd /var/www/waqf/frontend
npm install
npm run build

# Redémarrer les applications
echo "♻️ Redémarrage PM2..."
pm2 restart waqf-backend
pm2 restart waqf-frontend

echo "✅ Déploiement terminé!"
pm2 status
```

```bash
# Rendre le script exécutable
chmod +x /var/www/waqf/deploy.sh

# Pour déployer
/var/www/waqf/deploy.sh
```

---

## 📊 Étape 12 : Monitoring

### Voir les logs

```bash
# Logs PM2
pm2 logs

# Logs Nginx
tail -f /var/log/nginx/access.log
tail -f /var/log/nginx/error.log

# Logs PostgreSQL
tail -f /var/log/postgresql/postgresql-*-main.log
```

### Monitorer les ressources

```bash
# Installer htop
apt install htop -y

# Voir les ressources
htop

# Espace disque
df -h

# Mémoire
free -h
```

---

## 🔧 Commandes utiles

```bash
# Redémarrer tout
pm2 restart all
systemctl restart nginx
systemctl restart postgresql

# Voir les ports utilisés
netstat -tlnp

# Tester une URL
curl -I https://waqf-daara.org

# Backup base de données
pg_dump -U dbadmin waqf_db > backup_waqf_$(date +%Y%m%d).sql

# Restaurer une base
psql -U dbadmin waqf_db < backup_waqf_20260129.sql
```

---

## 📝 Résumé des ports

| Projet | Service | Port |
|--------|---------|------|
| Waqf | Frontend (Next.js) | 3000 |
| Waqf | Backend (NestJS) | 3001 |
| Projet 2 | App | 4000 |
| Projet 3 | App | 5000 |
| PostgreSQL | Base de données | 5432 |
| Nginx | HTTP | 80 |
| Nginx | HTTPS | 443 |

---

## ❓ Dépannage

### L'application ne démarre pas
```bash
pm2 logs waqf-backend --lines 50
```

### Erreur de connexion à la base
```bash
# Vérifier que PostgreSQL tourne
systemctl status postgresql

# Tester la connexion
psql -U dbadmin -d waqf_db -h localhost
```

### Erreur Nginx
```bash
nginx -t
systemctl status nginx
tail -f /var/log/nginx/error.log
```

### Certificat SSL expiré
```bash
certbot renew
systemctl reload nginx
```

---

## 🎉 C'est terminé !

Votre VPS est maintenant configuré pour héberger plusieurs projets Node.js avec PostgreSQL.

Pour ajouter un nouveau projet :
1. Cloner le projet dans `/var/www/nouveau-projet`
2. Ajouter une config PM2 (nouveau port)
3. Ajouter une config Nginx
4. Créer une base PostgreSQL
5. Configurer le DNS
6. Installer le SSL avec Certbot
