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

import "@babel/polyfill";
import http from "http";
import express from "express";
import cors, { CorsOptions } from "cors";
import { json, urlencoded } from "body-parser";

import Controllers from "./controller";
import Services from "./services";
import { createErrorHandler, createRouter, promisify, showLog } from "./helpers/express";
import { createLogger } from "./helpers/logger";

const app = express();
const router = createRouter(app);
const logger = createLogger("Application");
const server = new http.Server(app);
const port = process.env.PORT || 9000;
const corsWhiteList = ["http://localhost:" + port];
const corsOptions: CorsOptions = {
	origin: function (origin: any, callback: any) {
		if (corsWhiteList.indexOf(origin) !== -1 || !origin) {
			callback(null, true);
		} else {
			callback(new Error('Not allowed by CORS'));
		}
	}
};

app.use(json());
app.use(urlencoded({ extended: true }));
app.use(cors(corsOptions));
app.use(showLog(logger));

for (const key in Services) {
	if (Services.hasOwnProperty(key)) {
		const service = Services[key];
		logger.i("Added " + key + " service on endpoint " + service.method + " " + service.endpoint + ".");
		(<{ [k: string]: any }>router)[service.method.toLowerCase()](service.endpoint)
			.handle(Controllers[service.handler]);
	}
}

app.use(promisify(Controllers.serve));
app.use(createErrorHandler(logger));

server.listen(port, function () {
	logger.i("Server listening http://localhost:" + port + ".");
});
