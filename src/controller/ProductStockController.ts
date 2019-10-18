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

import { getModel } from "../helpers/database";
import { sendSuccessResponse, throwError, validateRequest, RequestRequirements } from "../helpers/express";
import { IProduct } from "../model/IProduct";
import { ModelChoice } from "../model/factory/DatabaseFactory";

export async function addProductStock(request: Request, response: Response) {
	const Product = getModel(ModelChoice.Product);
	try {
		const requirements: RequestRequirements = {
			body: ["_id", "value"],
		};
		validateRequest(request, requirements);
		await Product.initialise();
		await Product.startTransaction();
		let product = <IProduct> await Product.fetchByID<IProduct>(request.body._id);
		if (!product) {
			throwError("Product with ID " + request.body._id + " is not found.", 404);
		}
		request.body.value = parseInt(request.body.value);
		if (request.body.value <= 0) {
			throwError(
				"Parameter \"value\" should be a positive integer. Given: " + request.body.value + ".",
				400
			);
		}
		product.stock = product.stock + request.body.value;
		product = <IProduct> await Product.modifyByID<IProduct>(product, product._id);
		await Product.commit();
		sendSuccessResponse(response, product, "Successfully added " + request.body.value + " stock of " + product.name + ".");
	} catch (error) {
		await Product.rollback();
		throw error;
	} finally {
		await Product.close();
	}
}

export async function reduceProductStock(request: Request, response: Response) {
	const Product = getModel(ModelChoice.Product);
	try {
		const requirements: RequestRequirements = {
			body: ["_id", "value"],
		};
		validateRequest(request, requirements);
		await Product.initialise();
		await Product.startTransaction();
		let product = <IProduct> await Product.fetchByID<IProduct>(request.body._id);
		if (!product) {
			throwError("Product with ID " + request.body._id + " is not found.", 404);
		}
		request.body.value = parseInt(request.body.value);
		if (request.body.value <= 0) {
			throwError(
				"Parameter \"value\" should be a positive integer. Given: " + request.body.value + ".",
				400
			);
		}
		const oldStock = product.stock;
		let stock = product.stock - request.body.value;
		if (stock < 0) {
			stock = 0;
		}
		product.stock = stock;
		product = <IProduct> await Product.modifyByID<IProduct>(product, product._id);
		await Product.commit();
		sendSuccessResponse(response, product, "Successfully reduced " + (oldStock - stock) + " stock of " + product.name + ".");
	} catch (error) {
		await Product.rollback();
		throw error;
	} finally {
		await Product.close();
	}
}
