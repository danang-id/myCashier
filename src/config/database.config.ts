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

import dotenv from "dotenv";
dotenv.config();

export const DatabaseConfig = {
	type: process.env.DB_TYPE || "mysqlx",
	host: process.env.DB_HOST || "localhost",
	port: parseInt(process.env.DB_PORT || ((<any>this).type === "mysqlx" ? "33060" : "3306")),
	schema: process.env.DB_NAME || "bcaf12-point-of-sales",
	user: process.env.DB_USERNAME || "root",
	password: process.env.DB_PASSWORD,
	poolingOptions: {
		pooling: {
			enabled: true,
			maxSize: 3,
		},
	},
};
