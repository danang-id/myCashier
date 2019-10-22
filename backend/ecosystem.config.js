module.exports = {
	apps: [
		{
			name: 'my-cashier-backend',
			script: 'lib/app.js',
			instances: 'max',
			autorestart: true,
			watch: false,
			max_memory_restart: '1G',
			env: {
				NODE_ENV: 'development',
				DEBUG: 'my-cashier-backend:*'
			},
			env_production: {
				NODE_ENV: 'production',
				DEBUG: 'my-cashier-backend:*'
			}
		}
	]
};
