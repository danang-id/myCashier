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
import { IProduct } from "../interfaces/model/IProduct";

export async function getProducts(request: Request, response: Response) {
	let connection;
	try {
		connection = await initialiseConnection();
		let useCondition = false;
		let condition = "";
		if (!!request.query.query) {
			// TODO: SQL Injection Warning
			condition = condition.concat('name LIKE "%' + request.query.query + '%" ');
			useCondition = true;
		}
		if (!!request.query.sort_by) {
			if (
				request.query.sort_by === 'name' ||
				request.query.sort_by === 'category_id' ||
				request.query.sort_by === 'updated_at'
			) {
				let sortMethod = 'ASC';
				if (request.query.sort_method.toUpperCase() === 'ASC' || request.query.sort_method.toUpperCase() === 'DESC' ) {
					sortMethod = request.query.sort_method.toUpperCase();
				}
				// TODO: SQL Injection Warning
				condition = condition.concat('ORDER BY ' + request.query.sort_by.toLowerCase() + ' ' + sortMethod + ' ');
				useCondition = true;
			}
		}
		const products = useCondition ? await Product.fetch(connection, condition) : await Product.fetch(connection);
		let usePagination = false;
		let page = 0;
		let pageBy = 10;
		if (!!request.query.page) {
			request.query.page = parseInt(request.query.page);
			if (request.query.page >= 0) {
				page = request.query.page;
				if (!!request.query.page_by) {
					request.query.page_by = parseInt(request.query.page_by);
					if (request.query.page_by > 0) {
						pageBy = request.query.page_by;
					}
				}
				usePagination = true;
			}
		}
		const pagedProducts: IProduct[][] = [];
		if (usePagination) {
			let iterationIndex = 0;
			let iterationPage = 0;
			for (const product of products) {
				if (iterationIndex === 0) {
					pagedProducts.push([]);
				}
				pagedProducts[iterationPage].push(product);
				iterationIndex++;
				if (iterationIndex === pageBy) {
					iterationIndex = 0;
					iterationPage++;
				}
			}
			if (page > (pagedProducts.length - 1)) {
				page = pagedProducts.length - 1
			}
		}
		sendSuccessResponse(response, usePagination ? pagedProducts[page] : products);
	} catch (error) {
		throw error;
	} finally {
		if (typeof connection !== "undefined") {
			await closeConnection(connection);
		}
	}
}

export async function getProduct(request: Request, response: Response) {
	let connection;
	try {
		connection = await initialiseConnection();
		const requirements: RequestRequirements = {
			query: ["id"],
		};
		validateRequest(request, requirements);
		const product = Product.aBillionDollarMistakeCheck(
			await Product.fetchByID(connection, request.query.id),
			request.query.id
		);
		sendSuccessResponse(response, product);
	} catch (error) {
		throw error;
	} finally {
		if (typeof connection !== "undefined") {
			await closeConnection(connection);
		}
	}
}

export async function createProduct(request: Request, response: Response) {
	let connection;
	try {
		connection = await initialiseConnection();
		await connection.beginTransaction();
		const requirements: RequestRequirements = {
			body: ["name", "description", "image", "price", "category_id"],
		};
		validateRequest(request, requirements);
		const category = Category.aBillionDollarMistakeCheck(
			await Category.fetchByID(connection, request.body.category_id),
			request.body.category_id
		);
		let product: IProduct = {
			id: UUID.generate(),
			name: request.body.name,
			description: request.body.description,
			image: request.body.image,
			price: parseInt(request.body.price),
			category_id: category.id,
			quantity: 0
		};
		const { insertId } = await Product.create(connection, product);
		product = Product.aBillionDollarMistakeCheck(
			await Product.fetchByID(connection, insertId),
			insertId
		);
		await connection.commit();
		sendSuccessResponse(response, category, "Successfully created product " + product.name + ".");
	} catch (error) {
		throw error;
	} finally {
		if (typeof connection !== "undefined") {
			await connection.rollback();
			await closeConnection(connection);
		}
	}
}

export async function modifyProduct(request: Request, response: Response) {
	let connection;
	try {
		connection = await initialiseConnection();
		const requirements: RequestRequirements = {
			query: ["id"],
		};
		validateRequest(request, requirements);
		let product = Product.aBillionDollarMistakeCheck(
			await Product.fetchByID(connection, request.query.id),
			request.query.id
		);
		product.name = request.body.name || product.name;
		product.description = request.body.description || product.description;
		product.image = request.body.image || product.image;
		product.price = request.body.price || product.price;
		if (!!request.body.category_id) {
			const category = Category.aBillionDollarMistakeCheck(
				await Category.fetchByID(connection, request.body.category_id),
				request.body.category_id
			);
			product.category_id = category.id;
		}
		await Product.modify(connection, product);
		product = Product.aBillionDollarMistakeCheck(
			await Product.fetchByID(connection, request.query.id),
			request.query.id
		);
		await connection.commit();
		sendSuccessResponse(response, product, "Successfully modified product " + product.name + ".");
	} catch (error) {
		throw error;
	} finally {
		if (typeof connection !== "undefined") {
			await connection.rollback();
			await closeConnection(connection);
		}
	}
}

export async function deleteProduct(request: Request, response: Response) {
	let connection;
	try {
		connection = await initialiseConnection();
		const requirements: RequestRequirements = {
			query: ["id"]
		};
		validateRequest(request, requirements);
		const product = Product.aBillionDollarMistakeCheck(
			await Product.fetchByID(connection, request.query.id),
			request.query.id
		);
		await Product.deleteByID(connection, request.query.id);
		await connection.commit();
		sendSuccessResponse(response, "Successfully deleted product " + product.name + ".");
	} catch (error) {
		throw error;
	} finally {
		if (typeof connection !== "undefined") {
			await connection.rollback();
			await closeConnection(connection);
		}
	}
}
