/**
 * This program was written and submitted for Bootcamp Arkademy
 * Batch 12 selection.
 *
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

import mysql from "promise-mysql";

export async function initialiseConnection(): Promise<mysql.Connection> {
	try {
		return await mysql.createConnection({
			host     : 'localhost',
			user     : 'me',
			password : 'secret',
			database : 'my_db'
		});
	} catch (error) {
		throw error;
	}
}

export async function closeConnection(connection: mysql.Connection) {
	try {
		await connection.end();
	} catch (error) {
		throw error;
	}
}

