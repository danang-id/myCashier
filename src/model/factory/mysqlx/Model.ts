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

import mysqlx, { Client, Session, Schema, Collection } from "mysqlx";
import { DatabaseConfig} from "../../../config/database.config";
import { Identifier, IModel, SearchCondition, SearchConditionString } from "../IModel";
import { throwError } from "../../../helpers/express";

export class Model implements IModel {

	private backbone?: Backbone;
	private readonly modelName: string = "";

	constructor(modelName: string) {
		this.modelName = modelName;
	}

	private static isBackbone(backbone: any): backbone is Backbone {
		return typeof backbone.client !== "undefined" &&
			typeof backbone.schema !== "undefined" &&
			typeof backbone.session !== "undefined" &&
			typeof backbone.collection !== "undefined";
	}

	public async close(): Promise<boolean> {
		if (typeof this.backbone === "undefined") {
			throw new Error("Connection has not been initialised.")
		}
		try {
			await this.backbone.client.close();
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
			return await this.backbone.session.commit();
		} catch (error) {
			throw error;
		}
	}

	public async create<T>(document: T): Promise<T> {
		if (typeof this.backbone === "undefined") {
			throw new Error("Connection has not been initialised.")
		}
		try {
			const result = await this.backbone.collection.add(document).execute();
			if (result.getWarningsCount() > 0) {
				const warning = result.getWarnings()[0];
				throwError(warning.msg, warning.code);
			}
			const identifier = !(<any>document)._id ? (<any>document)._id : result.getGeneratedIds()[0];
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
			const result = await this.backbone.collection.find(condition).execute();
			if (result.getWarningsCount() > 0) {
				const warning = result.getWarnings()[0];
				throwError(warning.msg, warning.code);
			}
			return <T[]> result.getDocuments();
		} catch (error) {
			throw error;
		}
	}

	public async fetchByID<T>(_id: string): Promise<T | null> {
		if (typeof this.backbone === "undefined") {
			throw new Error("Connection has not been initialised.")
		}
		try {
			return <T> await this.backbone.collection.findOne(_id);
		} catch (error) {
			throw error;
		}
	}

	public async fetchOne<T>(condition: SearchCondition | SearchConditionString = true): Promise<T | null> {
		if (typeof this.backbone === "undefined") {
			throw new Error("Connection has not been initialised.")
		}
		try {
			return <T> await this.backbone.collection.findOne(condition);
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
			this.backbone.client = mysqlx.getClient({
				host: DatabaseConfig.host,
				port: DatabaseConfig.port,
				schema: DatabaseConfig.schema,
				user: DatabaseConfig.user,
				password: DatabaseConfig.password
			}, DatabaseConfig.poolingOptions);
			// @ts-ignore
			this.backbone.session = await this.backbone.client.getSession();
			// @ts-ignore
			this.backbone.schema = await this.backbone.session.getSchema(DatabaseConfig.schema);
			// @ts-ignore
			if (!this.backbone.schema.existsInDatabase()) {
				// @ts-ignore
				this.backbone.schema = await this.backbone.session.createSchema(DatabaseConfig.schema);
			}
		}
		// @ts-ignore
		this.backbone.collection = await this.backbone.schema.getCollection(this.modelName);
		// @ts-ignore
		if (!this.backbone.collection.existsInDatabase()) {
			// @ts-ignore
			this.backbone.collection = await this.backbone.schema.createCollection(this.modelName);
		}
		return <B> <unknown> this.backbone;
	}

	public async modify<T>(document: T, condition: SearchCondition | SearchConditionString = true): Promise<T[]> {
		if (typeof this.backbone === "undefined") {
			throw new Error("Connection has not been initialised.")
		}
		try {
			const result = await this.backbone.collection.modify(condition).patch(document).execute();
			if (result.getWarningsCount() > 0) {
				const warning = result.getWarnings()[0];
				throwError(warning.msg, warning.code);
			}
			return <T[]> await this.fetch(condition);
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
			const result = await this.backbone.collection.remove(condition).execute();
			if (result.getWarningsCount() > 0) {
				const warning = result.getWarnings()[0];
				throwError(warning.msg, warning.code);
			}
			return result.getAffectedItemsCount() > 0;
		} catch (error) {
			throw error;
		}
	}

	public async removeByID<T>(_id: Identifier): Promise<boolean> {
		if (typeof this.backbone === "undefined") {
			throw new Error("Connection has not been initialised.")
		}
		try {
			const result = await this.backbone.collection.removeByID(_id);
			if (result.getWarningsCount() > 0) {
				const warning = result.getWarnings()[0];
				throwError(warning.msg, warning.code);
			}
			return result.getAffectedItemsCount() > 0;
		} catch (error) {
			throw error;
		}
	}

	public async rollback(): Promise<boolean> {
		if (typeof this.backbone === "undefined") {
			throw new Error("Connection has not been initialised.")
		}
		try {
			return await this.backbone.session.rollback();
		} catch (error) {
			throw error;
		}
	}

	public async startTransaction(): Promise<boolean> {
		if (typeof this.backbone === "undefined") {
			throw new Error("Connection has not been initialised.")
		}
		try {
			return await this.backbone.session.startTransaction();
		} catch (error) {
			throw error;
		}
	}

}

export type Backbone = {
	client: Client,
	session: Session,
	schema: Schema,
	collection: Collection
};
