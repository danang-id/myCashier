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


import fs from "fs";
import path from "path";
import { notFound } from "../helpers/express";
import { NextFunction, Request, Response } from "express-serve-static-core";

export async function serve(request: Request, response: Response, next: NextFunction) {
	if (request.originalUrl.substr(0, 4) === "/api") {
		notFound(request, response, next);
		return;
	}
	try {
		const indexPath = path.join(__dirname, "..", "..", "client", "build", "index.html");
		const indexContent = fs.readFileSync(indexPath, "utf-8");
		response
			.status(200)
			.set("Content-Type", "text/html; charset=utf-8")
			.send(indexContent);
	} catch (error) {
		throw error;
	}
}
