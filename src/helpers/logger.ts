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

import debug from "debug";
import StackTrace from "stacktrace-js";
import { ILogger } from "../interfaces/ILogger";
import Package from "../../package.json";

function printStackTraces(traces: any[]) {
	for (const trace of traces) {
		console.log(`     at ${trace.functionName} ${trace.filename} ${trace.lineNumber}:${trace.columnNumber}`);
	}
}

export function createLogger(tag: string): ILogger {
	tag = Package.name.concat(":", tag);
	const logger = debug(tag);
	return {
		i(message: string) {
			logger("I: %s", message);
		},
		d(message: string, error?: Error, showWarningOnProduction: boolean = false) {
			if (process.env.NODE_ENV !== "production") {
				if (!!error) {
					logger("D: %s", message);
					StackTrace.fromError(error, {}).then(printStackTraces);
				} else {
					logger("D: %s", message);
				}
			} else {
				if (showWarningOnProduction) {
					this.w(message, error);
				}
			}
		},
		w(message: string, error?: Error) {
			if (!!error) {
				logger("W: %s", message);
				StackTrace.fromError(error, {}).then(printStackTraces);
			} else {
				logger("W: %s", message);
			}
		},
		e(message: string, error: Error) {
			logger("E: %s", message);
			StackTrace.fromError(error, {}).then(printStackTraces);
		},
	};
}
