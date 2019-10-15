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
import { IProduct } from "../interfaces/model/IProduct";

export class Product {

	private static TableName: string = "products";

	public static async fetch(connection: mysql.Connection, condition?: string): Promise<IProduct[]> {
		try {
			return await connection.query(
				"SELECT * FROM " + Product.TableName + (!!condition ? " WHERE " + condition : "")
			);
		} catch (error) {
			throw error;
		}
	}

	public static async fetchOne(connection: mysql.Connection, condition?: string): Promise<IProduct | null> {
		try {
			const result = await Product.fetch(connection, condition);
			if (!Array.isArray(result) || result.length < 1) {
				return null;
			}
			return result[0];
		} catch (error) {
			throw error;
		}
	}

	public static async fetchByID(connection: mysql.Connection, id: string): Promise<IProduct | null> {
		try {
			return await Product.fetchOne(connection, 'id = "' + id + '"');
		} catch (error) {
			throw error;
		}
	}

	public static async create(connection: mysql.Connection, product: IProduct) {
		try {
			return await connection.query(
				"INSERT INTO " + Product.TableName + " SET ?",
				product
			);
		} catch (error) {
			throw error;
		}
	}

	public static async modify(connection: mysql.Connection, product: IProduct, condition?: string) {
		try {
			return await connection.query(
				"UPDATE " + Product.TableName + " SET ?" + (!!condition ? " WHERE " + condition : ""),
				product
			);
		} catch (error) {
			throw error;
		}
	}

	public static async modifyByID(connection: mysql.Connection, product: IProduct, id: string) {
		try {
			return await Product.modify(connection, product, 'id = "' + id + '"');
		} catch (error) {
			throw error;
		}
	}

	public static async delete(connection: mysql.Connection, condition?: string) {
		try {
			return await connection.query(
				"DELETE FROM " + Product.TableName + (!!condition ? " WHERE " + condition : "")
			);
		} catch (error) {
			throw error;
		}
	}

	public static async deleteByID(connection: mysql.Connection, id: string) {
		try {
			return Product.delete(connection, 'id = "' + id + '"')
		} catch (error) {
			throw error;
		}
	}

	public static aBillionDollarMistakeCheck(product: IProduct | null, id: string): IProduct {
		if (product === null) {
			const error = new Error("Product with ID " + id + " is not found.");
			(<any>error).code = 404;
			throw error;
		}
		return <IProduct> product;
	}

}
