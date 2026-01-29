// PM2 Configuration pour le projet Waqf
// Usage: pm2 start ecosystem.config.js

module.exports = {
  apps: [
    // ========================================
    // WAQF BACKEND (NestJS API)
    // ========================================
    {
      name: 'waqf-backend',
      cwd: '/var/www/waqf/backend',
      script: 'dist/main.js',
      instances: 1,
      exec_mode: 'fork',
      watch: false,
      max_memory_restart: '500M',
      env: {
        NODE_ENV: 'production',
        PORT: 3001
      },
      error_file: '/var/log/pm2/waqf-backend-error.log',
      out_file: '/var/log/pm2/waqf-backend-out.log',
      log_date_format: 'YYYY-MM-DD HH:mm:ss Z'
    },

    // ========================================
    // WAQF FRONTEND (Next.js)
    // ========================================
    {
      name: 'waqf-frontend',
      cwd: '/var/www/waqf/frontend',
      script: 'node_modules/next/dist/bin/next',
      args: 'start -p 3000',
      instances: 1,
      exec_mode: 'fork',
      watch: false,
      max_memory_restart: '500M',
      env: {
        NODE_ENV: 'production',
        PORT: 3000
      },
      error_file: '/var/log/pm2/waqf-frontend-error.log',
      out_file: '/var/log/pm2/waqf-frontend-out.log',
      log_date_format: 'YYYY-MM-DD HH:mm:ss Z'
    }
  ]
};
