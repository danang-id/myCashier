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

import dotenv from "dotenv";

dotenv.config();

const options = {
	host: process.env.DB_HOST || "localhost",
	name: process.env.DB_NAME || "bcaf12-point-of-sales",
	username: process.env.DB_USERNAME || "root",
	password: process.env.DB_PASSWORD || ""
};

export default {
	options,
};
