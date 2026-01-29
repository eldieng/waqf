# 🕌 Waqf And Liggeyal Daara

## Plateforme Web de Dons & Transparence

> **"Jëmbate Luy meññ te du Rag"**

[![Version](https://img.shields.io/badge/version-2.0-blue.svg)](https://github.com)
[![License](https://img.shields.io/badge/license-Private-red.svg)](https://github.com)
[![Node.js](https://img.shields.io/badge/Node.js-18+-green.svg)](https://nodejs.org)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-15+-blue.svg)](https://postgresql.org)

---

## 📋 À propos du projet

L'Association **Waqf And Liggeyal Daara** met en place une plateforme numérique fiable, sécurisée et évolutive dédiée à :

- 💰 La collecte de dons (Waqf)
- 📊 La transparence financière
- 📢 La communication institutionnelle
- 🎓 La gestion de projets sociaux et éducatifs

---

## 🎯 Objectifs Stratégiques

| Objectif | Description |
|----------|-------------|
| **Crédibilité** | Image institutionnelle moderne et professionnelle |
| **Conversion** | Processus de don rapide et intuitif (< 30 secondes) |
| **Transparence** | Suivi clair de l'utilisation des fonds |
| **Sécurité** | Protection maximale des transactions |
| **Internationalisation** | Accès diaspora & partenaires étrangers |
| **Évolutivité** | Ajout futur de nouvelles fonctionnalités |

---

## 🏗️ Architecture Technique

### Frontend
- **Framework** : Next.js 14 (React 18)
- **Styling** : Tailwind CSS
- **Design** : Responsive (Mobile First)
- **i18n** : Support multilingue (FR 🇫🇷, EN 🇬🇧, AR 🇸🇦 avec RTL)

### Backend
- **Runtime** : Node.js 18+
- **Framework** : NestJS / Express
- **API** : REST sécurisée
- **Auth** : JWT (JSON Web Tokens)

### Base de données
- **SGBD** : PostgreSQL 15+
- **ORM** : Prisma
- **Tables principales** : utilisateurs, dons, projets, campagnes, transactions, contenus

### Sécurité
- HTTPS / SSL obligatoire
- Hashage des mots de passe (bcrypt)
- Protection CSRF / XSS
- Logs de transactions
- Sauvegardes automatiques

---

## 📁 Structure du Projet

```
waqf/
├── frontend/                 # Application Next.js
│   ├── app/                  # App Router (pages)
│   ├── components/           # Composants React réutilisables
│   ├── lib/                  # Utilitaires et helpers
│   ├── locales/              # Fichiers de traduction
│   ├── public/               # Assets statiques
│   └── styles/               # Styles globaux
│
├── backend/                  # API NestJS/Express
│   ├── src/
│   │   ├── modules/          # Modules métier
│   │   ├── common/           # Guards, interceptors, filters
│   │   ├── config/           # Configuration
│   │   └── prisma/           # Client Prisma
│   └── prisma/
│       └── schema.prisma     # Schéma base de données
│
├── docs/                     # Documentation
├── scripts/                  # Scripts utilitaires
└── docker/                   # Configuration Docker
```

---

## 🚀 Installation & Démarrage

### Prérequis

- Node.js 18+
- PostgreSQL 15+
- npm ou yarn
- Git

### Configuration de la base de données

```bash
# Variables d'environnement (.env)
DATABASE_URL="postgresql://postgres:Aladji%4004@localhost:5432/waqf_db"
```

### Installation

```bash
# Cloner le repository
git clone <repository-url>
cd waqf

# Installer les dépendances
npm install

# Configurer Prisma
npx prisma generate
npx prisma migrate dev

# Lancer le développement
npm run dev
```

---

## 🌐 Fonctionnalités Principales

### 🏠 Site Public
- **Accueil** : Bannière, chiffres clés, projets urgents, témoignages
- **À propos** : Présentation, vision, équipe, section Waqf
- **Projets** : Liste des causes avec jauge de progression
- **Faire un Don** : Don ponctuel/mensuel, multi-paiement
- **Boutique** : Produits solidaires
- **Actualités** : Articles et annonces
- **Événements** : Calendrier des campagnes
- **Contact** : Formulaire et coordonnées

### 👤 Espace Donateur
- Création de compte (email/téléphone)
- Historique des dons
- Téléchargement des reçus fiscaux
- Gestion des dons récurrents

### 💳 Paiements
- Wave
- Orange Money
- Free Money
- Visa / Mastercard
- Webhooks sécurisés
- Protection anti-fraude

### ⚙️ Back-office Administratif
- Tableau de bord avec statistiques
- Gestion des projets et campagnes
- Gestion des donateurs
- Export Excel/PDF
- Gestion des rôles utilisateurs

---

## 🌍 Internationalisation

| Langue | Code | Direction |
|--------|------|-----------|
| Français | `fr` | LTR |
| Anglais | `en` | LTR |
| Arabe | `ar` | **RTL** |

---

## 📧 Notifications

- Email de confirmation de don
- WhatsApp de remerciement
- Notifications admin en temps réel

---

## 📈 SEO & Performance

- Temps de chargement optimisé (< 3s)
- SEO technique intégré
- URLs propres et sémantiques
- Sitemap automatique
- Meta tags multilingues
- Lazy loading des images

---

## 🔐 Sécurité

- Authentification JWT avec refresh tokens
- Hashage bcrypt (salt rounds: 12)
- Protection CSRF
- Sanitization des inputs (XSS)
- Rate limiting
- Logs de sécurité
- Sauvegardes quotidiennes

---

## 📦 Livrables

- ✅ Application web complète (Frontend + Backend)
- ✅ Code source commenté
- ✅ Base de données configurée
- ✅ Accès administrateur
- ✅ Documentation technique
- ✅ Formation équipe (2h)
- ✅ Support au lancement

---

## 👥 Équipe de développement

| Rôle | Responsabilité |
|------|----------------|
| Lead Developer | Architecture et développement |
| Frontend Dev | Interface utilisateur |
| Backend Dev | API et sécurité |
| DevOps | Déploiement et infrastructure |

---

## 📄 Licence

Ce projet est propriétaire et développé exclusivement pour l'Association Waqf And Liggeyal Daara.

---

## 📞 Contact

**Association Waqf And Liggeyal Daara**

- 🌐 Site web : [À définir]
- 📧 Email : contact@waqf-daara.org
- 📱 Téléphone : [À définir]

---

<p align="center">
  <strong>🤲 Ensemble, construisons un avenir meilleur</strong>
</p>
