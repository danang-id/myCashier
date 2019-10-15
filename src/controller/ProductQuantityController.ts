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
import { Product } from "../model/Product";

export async function addProductQuantity(request: Request, response: Response) {
	let connection;
	try {
		connection = await initialiseConnection();
		await connection.beginTransaction();
		const requirements: RequestRequirements = {
			query: ["id", "value"],
		};
		validateRequest(request, requirements);
		request.query.value = parseInt(request.query.value);
		if (request.query.value <= 0) {
			const error = new Error('Parameter "value" should be a positive integer. Given: ' + request.query.value + '.');
			(<any>error).code = 400;
			throw error;
		}
		let product = Product.aBillionDollarMistakeCheck(
			await Product.fetchByID(connection, request.query.id),
			request.query.id
		);
		product.quantity += request.query.value;
		await Product.modify(connection, product);
		product = Product.aBillionDollarMistakeCheck(
			await Product.fetchByID(connection, request.query.id),
			request.query.id
		);
		await connection.commit();
		sendSuccessResponse(response, product, "Successfully added " + request.query.value + " qty of " + product.name + ".");
	} catch (error) {
		throw error;
	} finally {
		if (typeof connection !== "undefined") {
			await connection.rollback();
			await closeConnection(connection);
		}
	}
}

export async function reduceProductQuantity(request: Request, response: Response) {
	let connection;
	try {
		connection = await initialiseConnection();
		await connection.beginTransaction();
		const requirements: RequestRequirements = {
			query: ["id", "value"],
		};
		validateRequest(request, requirements);
		request.query.value = parseInt(request.query.value);
		if (request.query.value <= 0) {
			const error = new Error('Parameter "value" should be a positive integer. Given: ' + request.query.value + '.');
			(<any>error).code = 400;
			throw error;
		}
		let product = Product.aBillionDollarMistakeCheck(
			await Product.fetchByID(connection, request.query.id),
			request.query.id
		);
		const oldQuantity = product.quantity;
		let quantity = product.quantity - request.query.value;
		if (quantity < 0) {
			quantity = 0;
		}
		product.quantity = quantity;
		await Product.modify(connection, product);
		product = Product.aBillionDollarMistakeCheck(
			await Product.fetchByID(connection, request.query.id),
			request.query.id
		);
		await connection.commit();
		sendSuccessResponse(response, product, "Successfully added " + (oldQuantity - quantity) + " qty of " + product.name + ".");
	} catch (error) {
		throw error;
	} finally {
		if (typeof connection !== "undefined") {
			await connection.rollback();
			await closeConnection(connection);
		}
	}
}
