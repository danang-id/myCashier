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

import mysql, { Connection } from "promise-mysql";
import isBoolean from "lodash.isboolean";
import isNumber from "lodash.isnumber";
import isString from "lodash.isstring";
import { DatabaseConfig} from "../../../config/database.config";
import { Identifier, IModel, SearchCondition, SearchConditionString } from "../IModel";

export class Model implements IModel {

	private backbone?: Backbone;
	private readonly modelName: string = "";

	constructor(modelName: string) {
		this.modelName = modelName;
	}

	private static isBackbone(backbone: any): backbone is Backbone {
		return typeof backbone.connection !== "undefined";
	}

	private static createConditionString(condition: SearchCondition | SearchConditionString): SearchConditionString {
		let conditionString: SearchConditionString = '';
		if (isString(condition)) {
			conditionString = condition
		} else if (isBoolean(condition)) {
			conditionString = condition.toString()
		} else {
			let firstCondition = true;
			for (const key in condition) {
				if (condition.hasOwnProperty(key)) {
					const value = isNumber(condition[key]) || isBoolean(condition[key]) ? condition[key].toString() : `"${condition[key]}"`;
					conditionString = conditionString
						.concat(firstCondition ? '' : '  AND ')
						.concat(key)
						.concat('=')
						.concat(value);
					if (firstCondition) {
						firstCondition = false
					}
				}
			}
		}
		return conditionString
	}

	public async close(): Promise<boolean> {
		if (typeof this.backbone === "undefined") {
			throw new Error("Connection has not been initialised.")
		}
		try {
			await this.backbone.connection.end();
			return true;
		} catch (error) {
			throw error;
		}
	}

	public async commit(): Promise<boolean> {
		if (typeof this.backbone === "undefined") {
			throw new Error("Connection has not been initialised.")
		}
		try {
			await this.backbone.connection.commit();
			return true;
		} catch (error) {
			throw error;
		}
	}

	public async create<T>(document: T): Promise<T> {
		if (typeof this.backbone === "undefined") {
			throw new Error("Connection has not been initialised.")
		}
		try {
			const result = await this.backbone.connection.query("INSERT INTO " + this.modelName + " SET ?", document);
			const identifier = !(<any>document)._id ? (<any>document)._id : result.insertId;
			return <T> await this.fetchByID(identifier);
		} catch (error) {
			throw error;
		}
	}

	public async fetch<T>(condition: SearchCondition | SearchConditionString = true): Promise<T[]> {
		if (typeof this.backbone === "undefined") {
			throw new Error("Connection has not been initialised.")
		}
		try {
			const appendCondition = typeof condition !== "undefined"
				? " WHERE ".concat(Model.createConditionString(condition))
				: "";
			const result = await this.backbone.connection.query("SELECT * FROM " + this.modelName + appendCondition);
			return Array.isArray(result) ? result : [ result ];
		} catch (error) {
			throw error;
		}
	}

	public async fetchByID<T>(_id: string): Promise<T | null> {
		if (typeof this.backbone === "undefined") {
			throw new Error("Connection has not been initialised.")
		}
		try {
			return await this.fetchOne({ _id });
		} catch (error) {
			throw error;
		}
	}

	public async fetchOne<T>(condition: SearchCondition | SearchConditionString = true): Promise<T | null> {
		if (typeof this.backbone === "undefined") {
			throw new Error("Connection has not been initialised.")
		}
		try {
			const result = <T[]> await this.fetch(condition);
			return result.length > 0 ? result[0] : null;
		} catch (error) {
			throw error;
		}
	}

	public async initialise<B>(backbone?: B): Promise<B> {
		if (typeof backbone !== "undefined" && Model.isBackbone(backbone)) {
			this.backbone = backbone;
		} else {
			this.backbone = <any> {};
			// @ts-ignore
			this.backbone.connection = await mysql.createConnection({
				host: DatabaseConfig.host,
				port: DatabaseConfig.port,
				database: DatabaseConfig.schema,
				user: DatabaseConfig.user,
				password: DatabaseConfig.password
			});
		}
		return <B> <unknown> this.backbone;
	}

	public async modify<T>(document: T, condition: SearchCondition | SearchConditionString = true): Promise<T[]> {
		if (typeof this.backbone === "undefined") {
			throw new Error("Connection has not been initialised.")
		}
		try {
			const appendCondition = typeof condition !== "undefined"
				? " WHERE ".concat(Model.createConditionString(condition))
				: "";
			await this.backbone.connection.query("UPDATE " + this.modelName + " SET ? " + appendCondition, document);
			return await this.fetch(condition);
		} catch (error) {
			throw error;
		}
	}

	public async modifyByID<T>(document: T, _id: string): Promise<T | null> {
		if (typeof this.backbone === "undefined") {
			throw new Error("Connection has not been initialised.")
		}
		try {
			const result = <T[]> await this.modify(document, { _id });
			return result.length > 0 ? result[0] : null;
		} catch (error) {
			throw error;
		}
	}

	public async remove<T>(condition: SearchCondition | SearchConditionString = true): Promise<boolean> {
		if (typeof this.backbone === "undefined") {
			throw new Error("Connection has not been initialised.")
		}
		try {
			const appendCondition = typeof condition !== "undefined"
				? " WHERE ".concat(Model.createConditionString(condition))
				: "";
			const result = await this.backbone.connection.query("DELETE FROM " + this.modelName + appendCondition);
			return result.affectedRows > 0;
		} catch (error) {
			throw error;
		}
	}

	public async removeByID<T>(_id: Identifier): Promise<boolean> {
		if (typeof this.backbone === "undefined") {
			throw new Error("Connection has not been initialised.")
		}
		try {
			return await this.remove({ _id });
		} catch (error) {
			throw error;
		}
	}

	public async rollback(): Promise<boolean> {
		if (typeof this.backbone === "undefined") {
			throw new Error("Connection has not been initialised.")
		}
		try {
			await this.backbone.connection.rollback();
			return true;
		} catch (error) {
			throw error;
		}
	}

	public async startTransaction(): Promise<boolean> {
		if (typeof this.backbone === "undefined") {
		throw new Error("Connection has not been initialised.")
	}
		try {
			await this.backbone.connection.beginTransaction();
			return true;
		} catch (error) {
			throw error;
		}
	}

}

export type Backbone = {
	connection: Connection
};
