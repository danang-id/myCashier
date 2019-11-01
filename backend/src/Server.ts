/**
 * Copyright 2019, Danang Galuh Tegar Prasetyo.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *    http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import { isArray, isString } from '@tsed/core';
import { ServerLoader, ServerSettings, Req, Res, Next } from '@tsed/common';
import '@tsed/typeorm';
import '@tsed/swagger';
import '@tsed/ajv';
import '@tsed/multipartfiles';

import fs from 'fs';
import Path from 'path';
import { ejs } from 'consolidate';
import helmet from 'helmet';
import cookieParser from 'cookie-parser';
import session from 'express-session';
import redis from 'redis';
import connectRedis from 'connect-redis';
import compress from 'compression';
import methodOverride from 'method-override';
import { json, urlencoded } from 'body-parser';
import favicon from 'express-favicon';
import SendGridMail from '@sendgrid/mail';

import { DatabaseConfig } from './config/database.config';
import { MailConfig } from './config/mail.config';
import { ServerConfig } from './config/server.config';
import { MemoryConfig } from './config/memory.config';
import { SessionConfig } from './config/session.config';
import { NotFoundMiddleware } from './middlewares/NotFoundMiddleware';
import { ResponseMiddleware } from './middlewares/ResponseMiddleware';
import { ErrorHandlerMiddleware } from './middlewares/ErrorHandlerMiddleware';

const rootDir = Path.resolve(__dirname);

@ServerSettings({
	rootDir,
	httpPort: ServerConfig.address + ':' + (+ServerConfig.port + 1),
	httpsPort: ServerConfig.address + ':' + ServerConfig.port,
	httpsOptions: {
		key: fs.readFileSync(Path.join(__dirname, '..', 'keys', 'server.key')),
		cert: fs.readFileSync(Path.join(__dirname, '..', 'keys', 'server.cert'))
	},
	viewsDir: `${rootDir}/views`,
	mount: {
		'/': `${rootDir}/controllers/*{.ts,.js}`,
		'/v1': `${rootDir}/controllers/v1/**/*{.ts,.js}`,
	},
	uploadDir: `${rootDir}/../data`,
	typeorm: [
		{
			name: 'default',
			type: <any>DatabaseConfig.type,
			host: DatabaseConfig.host,
			port: DatabaseConfig.port,
			username: DatabaseConfig.username,
			password: DatabaseConfig.password,
			database: DatabaseConfig.name,
			synchronize: true,
			logging: false,
			entities: [
				`${rootDir}/model/*{.ts,.js}`
			],
			migrations: [
				`${rootDir}/migrations/*{.ts,.js}`
			],
			subscribers: [
				`${rootDir}/subscriber/*{.ts,.js}`
			]
		}
	],
	swagger: [{
		path: '/docs',
		doc: 'api-v1',
	}],
	ajv: {
		errorFormat: (error) => `Parameter "${error.dataPath.substr(1)}" ${error.message}.`,
	},
})
export class Server extends ServerLoader {

	public $beforeInit(): void {
		this.set('trust proxy', 1);
		this.set('views', this.settings.get('viewsDir'));
		this.engine('ejs', ejs);
		SendGridMail.setApiKey(MailConfig.sendGridKey);
	}

	public $beforeRoutesInit(): void {
		const RedisStore = connectRedis(session);
		const client = redis.createClient(MemoryConfig.redis.url);
		this
			.use(helmet())
			.use((request: Req, response: Res, next: Next) => {
				let origin = 'https://'.concat(ServerConfig.productionURL);
				if (!!request.headers.origin) {
					if (isArray(request.headers.origin) && request.headers.origin.length > 0) {
						origin = <string> request.headers.origin[0];
					} else if (isString(request.headers.origin)) {
						origin = <string> request.headers.origin;
					}
				}
				response.header('Access-Control-Allow-Credentials', 'true');
				response.header('Access-Control-Allow-Origin', origin);
				response.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,UPDATE,OPTIONS');
				response.header(
					'Access-Control-Allow-Headers',
					'X-Requested-With, X-HTTP-Method-Override, Content-Type, Accept, Authorization'
				);
				next();
			})
			.use(cookieParser())
			.use(session({
				name: SessionConfig.name,
				secret: SessionConfig.secret,
				store: new RedisStore({ client }),
				resave: false,
				saveUninitialized: false,
				cookie: {
					maxAge: 60 * 60 * 1000,
					sameSite: 'none',
					httpOnly: true,
					// @ts-ignore
					secure: 'auto',
				},

			}))
			.use(compress({}))
			.use(methodOverride())
			.use(json())
			.use(urlencoded({
				extended: true
			}))
			.use(favicon(Path.join(__dirname, 'views', 'favicon.ico')));
	}

	public $afterRoutesInit(): void {
		this.use(NotFoundMiddleware)
			.use(ResponseMiddleware)
			.use(ErrorHandlerMiddleware)
	}

}
