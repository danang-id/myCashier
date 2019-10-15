module.exports = {
	apps: [
		{
			name: 'bcaf12-point-of-sales',
			script: 'lib/app.js',
			instances: 'max',
			autorestart: true,
			watch: false,
			max_memory_restart: '1G',
			env: {
				NODE_ENV: 'development',
				DEBUG: 'bcaf12-point-of-sales:*'
			},
			env_production: {
				NODE_ENV: 'production',
				DEBUG: 'bcaf12-point-of-sales:*'
			}
		}
	]
};
