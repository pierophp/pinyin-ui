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
      repo: 'https://github.com/pierophp/pinyin.git',
      ssh_options: 'StrictHostKeyChecking=no',
      path: '/var/www/api.pinyin',
      'post-deploy': 'cd /home/ubuntu/ && rm -Rf dist/ && unzip pinyin.dist.zip && sudo rm -Rf /var/www/pinyin && mv /home/ubuntu/dist /var/www/pinyin && cd /var/www/api.pinyin/current/api && cp ../../env/* . && yarn install --production && knex migrate:latest --env production && sudo pm2 startOrRestart ecosystem.json --env production',
    },
  },
};
