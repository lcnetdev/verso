// sudo DB_STORAGE=mongodb DB_URL=mongodb://127.0.0.1:27017/bfpilot pm2 start -n verso ./server/server.js --update-env

module.exports = {
  apps: [
    {
      name: 'verso',
      script: './server/server.js',
      watch: false,
      env: {
        'AUTH': false,
        'DB_STORAGE': 'file',
        'DB_FILE': '/opt/bibliomata/verso/bfpilot.json',
      },
      env_mongo: {
        'AUTH': true,
        'DB_URL': 'mongodb://127.0.0.1:27017/bfpilot',
        'DB_STORAGE': 'mongodb',
      },
    },
  ],
};

