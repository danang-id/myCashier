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

import { ServerLoader, ServerSettings, $log } from '@tsed/common';
import '@tsed/typeorm';
import '@tsed/swagger';
import '@tsed/ajv';
import '@tsed/multipartfiles';

import Path from 'path';
import { ejs } from 'consolidate';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit'
import session from 'express-session';
import redis from 'redis';
import connectRedis from 'connect-redis';
import cors from 'cors';
import compress from 'compression';
import methodOverride from 'method-override';
import { json, urlencoded } from 'body-parser';
import favicon from 'express-favicon';
import SendGridMail from '@sendgrid/mail';

import { DatabaseConfig } from './config/database.config';
import { MailConfig } from './config/mail.config';
import { ServerConfig } from './config/server.config';
import { ErrorHandlerMiddleware } from './middlewares/ErrorHandlerMiddleware';
import { NotFoundMiddleware } from './middlewares/NotFoundMiddleware';
import { ResponseMiddleware } from './middlewares/ResponseMiddleware';
import { TooManyRequests } from 'ts-httpexceptions';
import { SessionConfig } from './config/session.config';
import { MemoryConfig } from './config/memory.config';

const rootDir = Path.resolve(__dirname);

@ServerSettings({
	rootDir,
	httpPort: ServerConfig.address + ':' + ServerConfig.port,
	httpsPort: false,
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
			.use(rateLimit({
				windowMs: 60 * 60 * 1000,
				max: 100,
				handler(request) {
					const now = new Date();
					const resetTime = !!(<any>request).resetTime ? <Date> (<any>request).resetTime : now;
					if (resetTime.getTime() === now.getTime()) {
						resetTime.setTime(resetTime.getTime() + 60 * 60 * 1000);
					}
					throw new TooManyRequests(`Too many request submitted from your IP address. Please try again after ${resetTime.getMinutes()} minutes ${resetTime.getSeconds()} seconds.`);
				}
			}))
			.use(session({
				name: SessionConfig.name,
				secret: SessionConfig.secret,
				store: new RedisStore({ client }),
				resave: false,
				saveUninitialized: true,
				cookie: {
					httpOnly: true,
					secure: true,
				},
			}))
			.use(cors({
				origin: ServerConfig.cors.origin,
				methods: 'GET,HEAD,POST,PUT,PATCH,DELETE,OPTIONS',
				credentials: true,
				allowedHeaders: 'Content-Type, Authorization, X-Requested-With',
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
