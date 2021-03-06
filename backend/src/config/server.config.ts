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

require("dotenv").config()

export const ServerConfig = {
	baseURL: process.env.BASE_URL || "https://mycashier.danang.id/",
	address: process.env.ADDRESS || "0.0.0.0",
	port: process.env.PORT || "8000",
	productionURL: process.env.PRODUCTION_URL || "localhost:8000",
	httpsEnable: process.env.HTTPS_ENABLE == "true" || false,
}
