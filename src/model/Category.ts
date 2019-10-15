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

import mysql from "promise-mysql";
import { ICategory } from "../interfaces/model/ICategory";

export class Category {

	private static TableName: string = "categories";

	public static async fetch(connection: mysql.Connection, condition?: string): Promise<ICategory[]> {
		try {
			return await connection.query(
				"SELECT * FROM " + Category.TableName + (!!condition ? " WHERE " + condition : "")
			);
		} catch (error) {
			throw error;
		}
	}

	public static async fetchOne(connection: mysql.Connection, condition?: string): Promise<ICategory | null> {
		try {
			const result = await Category.fetch(connection, condition);
			if (!Array.isArray(result) || result.length < 1) {
				return null;
			}
			return result[0];
		} catch (error) {
			throw error;
		}
	}

	public static async fetchByID(connection: mysql.Connection, id: string): Promise<ICategory | null> {
		try {
			return await Category.fetchOne(connection, 'id = "' + id + '"');
		} catch (error) {
			throw error;
		}
	}

	public static async create(connection: mysql.Connection, category: ICategory) {
		try {
			return await connection.query(
				"INSERT INTO " + Category.TableName + " SET ?",
				category
			);
		} catch (error) {
			throw error;
		}
	}

	public static async modify(connection: mysql.Connection, category: ICategory, condition?: string) {
		try {
			return await connection.query(
				"UPDATE " + Category.TableName + " SET ?" + (!!condition ? " WHERE " + condition : ""),
				category
			);
		} catch (error) {
			throw error;
		}
	}

	public static async modifyByID(connection: mysql.Connection, category: ICategory, id: string) {
		try {
			return await Category.modify(connection, category, 'id = "' + id + '"');
		} catch (error) {
			throw error;
		}
	}

	public static async delete(connection: mysql.Connection, condition?: string) {
		try {
			return await connection.query(
				"DELETE FROM " + Category.TableName + (!!condition ? " WHERE " + condition : "")
			);
		} catch (error) {
			throw error;
		}
	}

	public static async deleteByID(connection: mysql.Connection, id: string) {
		try {
			return Category.delete(connection, 'id = "' + id + '"')
		} catch (error) {
			throw error;
		}
	}

	public static aBillionDollarMistakeCheck(category: ICategory | null, id: string): ICategory {
		if (category === null) {
			const error = new Error("Category with ID " + id + " is not found.");
			(<any>error).code = 404;
			throw error;
		}
		return <ICategory> category;
	}

}
