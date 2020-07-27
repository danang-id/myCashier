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

import { isArray, isString } from "@tsed/core"
import { Req, Res, Next, Configuration, Inject, PlatformApplication } from "@tsed/common"
import "@tsed/typeorm"
import "@tsed/swagger"
import "@tsed/ajv"
import "@tsed/multipartfiles"

import fs from "fs"
import Path from "path"
import helmet from "helmet"
import cookieParser from "cookie-parser"
import session from "express-session"
import redis from "redis"
import connectRedis from "connect-redis"
import compress from "compression"
import methodOverride from "method-override"
import { json, urlencoded } from "body-parser"
import favicon from "express-favicon"
import SendGridMail from "@sendgrid/mail"

import { DatabaseConfig } from "./config/database.config"
import { MailConfig } from "./config/mail.config"
import { ServerConfig } from "./config/server.config"
import { MemoryConfig } from "./config/memory.config"
import { SessionConfig } from "./config/session.config"
import { NotFoundMiddleware } from "./middlewares/NotFoundMiddleware"
import { ResponseMiddleware } from "./middlewares/ResponseMiddleware"
import { ErrorHandlerMiddleware } from "./middlewares/ErrorHandlerMiddleware"
import { ServerOptions } from "https"

const rootDir = Path.resolve(__dirname)
const httpPort = ServerConfig.address + ":" + ServerConfig.port
const httpsPort = ServerConfig.httpsEnable ? ServerConfig.address + ":" + (parseInt(ServerConfig.port) + 1) : false
const httpsOptionsFunc = function () {
	if (ServerConfig.httpsEnable) {
		return <ServerOptions>{
			key: fs.readFileSync(Path.join(__dirname, "..", "keys", "server.key")),
			cert: fs.readFileSync(Path.join(__dirname, "..", "keys", "server.crt")),
		}
	}
}

@Configuration({
	rootDir,
	httpPort,
	httpsPort,
	httpsOptions: httpsOptionsFunc(),
	viewsDir: `${rootDir}/views`,
	mount: {
		"/": `${rootDir}/controllers/*{.ts,.js}`,
		"/v1": `${rootDir}/controllers/v1/**/*{.ts,.js}`,
	},
	uploadDir: `${rootDir}/../data`,
	typeorm: [
		{
			name: "default",
			type: <any>DatabaseConfig.type,
			host: DatabaseConfig.host,
			port: DatabaseConfig.port,
			username: DatabaseConfig.username,
			password: DatabaseConfig.password,
			database: DatabaseConfig.name,
			connectTimeout: 20000,
			acquireTimeout: 20000,
			synchronize: true,
			logging: false,
			entities: [`${rootDir}/model/*{.ts,.js}`],
			migrations: [`${rootDir}/migrations/*{.ts,.js}`],
			subscribers: [`${rootDir}/subscriber/*{.ts,.js}`],
		},
	],
	swagger: [
		{
			path: "/docs",
			doc: "api-v1",
		},
	],
	ajv: {
		errorFormat: (error) => `Parameter "${error.dataPath.substr(1)}" ${error.message}.`,
	},
})
export class Server {
	@Inject()
	app: PlatformApplication

	@Configuration()
	settings: Configuration

	public $beforeInit(): void {
		// this.set('trust proxy', 1);
		// this.set('views', this.settings.get('viewsDir'));
		// this.engine('ejs', ejs);
		if (MailConfig.sendGridEnable) {
			SendGridMail.setApiKey(MailConfig.sendGridKey)
		}
	}

	public $beforeRoutesInit(): void {
		this.app
			.use(helmet())
			.use((request: Req, response: Res, next: Next) => {
				let origin = "https://".concat(ServerConfig.productionURL)
				if (!!request.headers.origin) {
					if (isArray(request.headers.origin) && request.headers.origin.length > 0) {
						origin = <string>request.headers.origin[0]
					} else if (isString(request.headers.origin)) {
						origin = <string>request.headers.origin
					}
				}
				const protocol = origin.match(/^[^:]+/)[0]
				const hostname =
					protocol === "https"
						? origin.substring(8).match(/^[^:]+/)[0]
						: origin.substring(7).match(/^[^:]+/)[0]
				;(<any>response).crossOrigin = {
					origin,
					protocol,
					hostname,
				}
				response.header("Access-Control-Allow-Credentials", "true")
				response.header("Access-Control-Allow-Origin", origin)
				response.header("Access-Control-Allow-Methods", "GET,POST,PATCH,PUT,DELETE,UPDATE,OPTIONS")
				response.header(
					"Access-Control-Allow-Headers",
					"X-Requested-With, X-HTTP-Method-Override, Content-Type, Accept, Authorization, Use-Token"
				)
				next()
			})
			.use(cookieParser())
			.use((request: Req, response: Res, next: Next) => {
				if (MemoryConfig.redis.enable) {
					const RedisStore = connectRedis(session)
					const client = redis.createClient(MemoryConfig.redis.url)
					session({
						name: SessionConfig.name,
						secret: SessionConfig.secret,
						store: new RedisStore({ client }),
						resave: false,
						saveUninitialized: false,
						cookie: {
							maxAge: 60 * 60 * 1000,
							sameSite: "none",
							httpOnly: true,
							secure: true,
						},
					})(request, response, next)
				} else {
					session({
						name: SessionConfig.name,
						secret: SessionConfig.secret,
						resave: false,
						saveUninitialized: false,
						cookie: {
							maxAge: 60 * 60 * 1000,
							sameSite: "none",
							httpOnly: true,
							secure: true,
						},
					})(request, response, next)
				}
			})
			.use(compress({}))
			.use(methodOverride())
			.use(json())
			.use(
				urlencoded({
					extended: true,
				})
			)
			.use(favicon(Path.join(__dirname, "views", "favicon.ico")))
	}

	public $afterRoutesInit(): void {
		this.app.use(NotFoundMiddleware).use(ResponseMiddleware).use(ErrorHandlerMiddleware)
	}
}
