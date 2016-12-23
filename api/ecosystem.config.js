module.exports = {
 /**
   * Deployment section
   * http://pm2.keymetrics.io/docs/usage/deployment/
   */
  deploy: {
    production: {
      user: process.env.SSH_USER,
      host: [{
        host: process.env.SSH_HOST,
        port: process.env.SSH_PORT,
      },
      ],
      ref: 'origin/master',
      repo: 'git@github.com:pierophp/pinyin.git',
      ssh_options: 'StrictHostKeyChecking=no',
      path: '/var/www/api.pinyin',
      'post-deploy': 'cd ui && npm install && npm run build && cd .. && rm -Rf /var/www/pinyin && cp -R ./ui/dist /var/www/pinyin && cd api && cp ../../env/* . && npm install --production && knex migrate:latest && pm2 startOrRestart ecosystem.json --env production',
    },
  },
};
