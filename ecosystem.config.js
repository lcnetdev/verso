// sudo DB_STORAGE=mongodb DB_URL=mongodb://127.0.0.1:27017/bfpilot pm2 start -n verso ./server/server.js --update-env

module.exports = {
  apps: [
    {
      name: 'verso',
      script: './server/server.js',
      watch: false,
      append_env_to_name: true,
      env_production: {
        'AUTH': false,
	'NODE_ENV': 'production',
        'DB_STORAGE': 'file',
        'DB_FILE': './bfpilot.json',
        'NODE_OPTIONS': '--max_old_space_size=4096'
      },
      env_staging: {
        'AUTH': false,
	'NODE_ENV': 'staging',
        'DB_STORAGE': 'file',
        'DB_FILE': './bfpilot_staging.json',
        'NODE_OPTIONS': '--max_old_space_size=4096'
      },
      env_mongo: {
        'AUTH': true,
        'DB_URL': 'mongodb://127.0.0.1:27017/bfpilot',
        'DB_STORAGE': 'mongodb',
      },
    }
  ],
};

