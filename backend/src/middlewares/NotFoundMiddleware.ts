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

import { IMiddleware, Middleware, Req, ResponseData } from "@tsed/common"
import { NotFound } from "ts-httpexceptions"

@Middleware()
export class NotFoundMiddleware implements IMiddleware {
	public use(@ResponseData() data: any, @Req() request: Req): void {
		if (typeof data === "undefined") {
			throw new NotFound(
				"The resource you're looking for at " +
					request.method.toUpperCase() +
					" " +
					request.originalUrl +
					" is not found."
			)
		}
	}
}
