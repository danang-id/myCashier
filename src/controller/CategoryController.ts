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


import { Request, Response } from "express-serve-static-core";

import { initialiseConnection, closeConnection } from "../helpers/database";
import { sendSuccessResponse, validateRequest, RequestRequirements } from "../helpers/express";
import { UUID } from "../helpers/uuid";
import { Category } from "../model/Category";
import { Product } from "../model/Product";
import { ICategory } from "../interfaces/model/ICategory";

export async function getCategories(request: Request, response: Response) {
	let connection;
	try {
		connection = await initialiseConnection();
		const categories = await Category.fetch(connection);
		sendSuccessResponse(response, categories);
	} catch (error) {
		throw error;
	} finally {
		if (typeof connection !== "undefined") {
			await closeConnection(connection);
		}
	}
}

export async function getCategory(request: Request, response: Response) {
	let connection;
	try {
		connection = await initialiseConnection();
		const requirements: RequestRequirements = {
			query: ["id"],
		};
		validateRequest(request, requirements);
		const category = Category.aBillionDollarMistakeCheck(
			await Category.fetchByID(connection, request.query.id),
			request.query.id
		);
		sendSuccessResponse(response, category);
	} catch (error) {
		throw error;
	} finally {
		if (typeof connection !== "undefined") {
			await closeConnection(connection);
		}
	}
}

export async function createCategory(request: Request, response: Response) {
	let connection;
	try {
		connection = await initialiseConnection();
		await connection.beginTransaction();
		const requirements: RequestRequirements = {
			body: ["name"],
		};
		validateRequest(request, requirements);
		let category: ICategory = {
			id: UUID.generate(),
			name: request.body.name,
			description: request.body.description || ""
		};
		const { insertId } = await Category.create(connection, category);
		category = Category.aBillionDollarMistakeCheck(
			await Category.fetchByID(connection, insertId),
			insertId
		);
		await connection.commit();
		sendSuccessResponse(response, category, "Successfully created category " + category.name + ".");
	} catch (error) {
		throw error;
	} finally {
		if (typeof connection !== "undefined") {
			await connection.rollback();
			await closeConnection(connection);
		}
	}
}

export async function modifyCategory(request: Request, response: Response) {
	let connection;
	try {
		connection = await initialiseConnection();
		const requirements: RequestRequirements = {
			query: ["id"],
		};
		validateRequest(request, requirements);
		let category = Category.aBillionDollarMistakeCheck(
			await Category.fetchByID(connection, request.query.id),
			request.query.id
		);
		category.name = request.body.name || category.name;
		category.description = request.body.description || category.description;
		await Category.modify(connection, category);
		category = Category.aBillionDollarMistakeCheck(
			await Category.fetchByID(connection, request.query.id),
			request.query.id
		);
		await connection.commit();
		sendSuccessResponse(response, category, "Successfully modified category " + category.name + ".");
	} catch (error) {
		throw error;
	} finally {
		if (typeof connection !== "undefined") {
			await connection.rollback();
			await closeConnection(connection);
		}
	}
}

export async function deleteCategory(request: Request, response: Response) {
	let connection;
	try {
		connection = await initialiseConnection();
		const requirements: RequestRequirements = {
			query: ["id"]
		};
		validateRequest(request, requirements);
		const category = Category.aBillionDollarMistakeCheck(
			await Category.fetchByID(connection, request.query.id),
			request.query.id
		);
		const products = await Product.fetch(connection, "condition_id = " + request.query.id);
		if (products.length > 0) {
			const counts = products.length === 1 ? "is 1 product" : "are " + products.length + " products";
			const error = new Error("Failed to delete category " + category.name + ". Currently, there " + counts + " that defined under this category. Please delete them first.");
			(<any>error).code = 400;
			throw error;
		}
		await Category.deleteByID(connection, request.query.id);
		await connection.commit();
		sendSuccessResponse(response, "Successfully deleted category " + category.name + ".");
	} catch (error) {
		throw error;
	} finally {
		if (typeof connection !== "undefined") {
			await connection.rollback();
			await closeConnection(connection);
		}
	}
}
