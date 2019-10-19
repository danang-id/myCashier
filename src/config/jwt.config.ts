/**
 * Copyright 2019, Danang Galuh Tegar Prasetyo & Mokhamad Mustaqim.
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

import path from "path";
import isString from 'lodash.isstring';
import dotenv from 'dotenv';
import { PathLike } from "fs";
dotenv.config();

function createAbsolutePath(relativePath: string): PathLike {
	return path.join(__dirname, '..', '..', relativePath)
}

export const JWTConfig: JWTConfiguration = {
	isActive: typeof process.env.USE_JWT !== "undefined"
		? isString(process.env.USE_JWT) ? process.env.USE_JWT === "true" : process.env.USE_JWT
		: false,
	secretKey: process.env.JWT_SECRET_KEY || "",
	privateKeyPath: typeof process.env.PRIVATE_KEY_PATH !== "undefined"
		? createAbsolutePath(process.env.PRIVATE_KEY_PATH)
		: createAbsolutePath(path.join("keys", "id_rsa")),
	publicKeyPath: typeof process.env.PUBLIC_KEY_PATH !== "undefined"
		? createAbsolutePath(process.env.PUBLIC_KEY_PATH)
		: createAbsolutePath(path.join("keys", "id_rsa.pub"))
};

type JWTConfiguration = {
	isActive: boolean,
	secretKey: string,
	privateKeyPath: PathLike,
	publicKeyPath: PathLike,
}
