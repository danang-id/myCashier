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
import { craftError, sendErrorResponse, sendSuccessResponse, validateRequest, RequestRequirements } from "../helpers/express";
import { UUID } from "../helpers/uuid";
import { ICategory } from "../model/ICategory";
import { IProduct } from "../model/IProduct";
import { ModelChoice } from "../model/factory/DatabaseFactory";

export async function getProducts(request: Request, response: Response) {
	const Product = getModel(ModelChoice.Product);
	try {
		await Product.initialise();
		let products = await Product.fetch<IProduct>();
		// Process search query
		if (!!request.query.query) {
			products = products.filter((product) => {
				return product.name.toLowerCase().includes(request.query.query.toLowerCase());
			});
		}
		// Sort search results
		if (!!request.query.sort_by && (
			request.query.sort_by === 'name' ||
			request.query.sort_by === 'category_id' ||
			request.query.sort_by === 'updated_at'
		)) {
			let sortMethod = 1;
			function compare(a: any, b: any): number {
				return (a[request.query.sort_by] > b[request.query.sort_by]) ? sortMethod :
					((b[request.query.sort_by] > a[request.query.sort_by]) ? (-1 * sortMethod) : 0);
			}
			products = products.sort(compare);
		}
		// Paginate results
		const skip = typeof request.query.skip !== "undefined" ? parseInt(request.query.skip) : 0;
		const limit = typeof request.query.limit !== "undefined" ? parseInt(request.query.limit) : 0;
		const offset = limit <= 0 ? products.length : skip + limit;
		products = products.slice(skip, offset);
		sendSuccessResponse(response, products);
	} catch (error) {
		return sendErrorResponse(request, response, error);
	} finally {
		await Product.close();
	}
}

export async function getProduct(request: Request, response: Response) {
	const Product = getModel(ModelChoice.Product);
	try {
		const requirements: RequestRequirements = {
			query: ["_id"],
		};
		validateRequest(request, requirements);
		await Product.initialise();
		const product = await Product.fetchByID<IProduct>(request.query._id);
		if (!product) {
			return sendErrorResponse(request, response,
				craftError("Product with ID " + request.query._id + " is not found.", 404)
			);
		}
		sendSuccessResponse(response, product);
	} catch (error) {
		return sendErrorResponse(request, response, error);
	} finally {
		await Product.close();
	}
}

export async function createProduct(request: Request, response: Response) {
	const Category = getModel(ModelChoice.Category);
	const Product = getModel(ModelChoice.Product);
	try {
		const requirements: RequestRequirements = {
			body: ["name"],
		};
		validateRequest(request, requirements);
		const backbone = await Category.initialise();
		await Product.initialise(backbone);
		await Product.startTransaction();
		const categories = <ICategory[]> await Category.fetch<ICategory>({ _id: request.body.category_id });
		if (categories.length < 0) {
			return sendErrorResponse(request, response,
				craftError("Category with ID " + request.body.category_id + " is not found.", 404)
			);
		}
		let product: IProduct = {
			_id: UUID.generateShort(),
			name: request.body.name,
			description: request.body.description,
			image: request.body.image,
			price: request.body.price,
			category_id: request.body.category_id,
			stock: 0,
			created_at: (new Date()).getTime(),
			updated_at: null,
		};
		product = <IProduct> await Product.create<IProduct>(product);
		await Product.commit();
		sendSuccessResponse(response, product, "Successfully created product " + product.name + ".");
	} catch (error) {
		await Product.rollback();
		return sendErrorResponse(request, response, error);
	} finally {
		await Product.close();
	}
}

export async function modifyProduct(request: Request, response: Response) {
	const Category = getModel(ModelChoice.Category);
	const Product = getModel(ModelChoice.Product);
	try {
		const requirements: RequestRequirements = {
			query: ["_id"],
		};
		validateRequest(request, requirements);
		const backbone = await Category.initialise();
		await Product.initialise(backbone);
		await Product.startTransaction();
		let product = <IProduct> await Product.fetchByID<IProduct>(request.query._id);
		if (!product) {
			return sendErrorResponse(request, response,
				craftError("Product with ID " + request.query._id + " is not found.", 404)
			);
		}
		const categories = <ICategory[]> await Product.fetch<ICategory>({ _id: request.body.category_id });
		if (categories.length === 0) {
			return sendErrorResponse(request, response,
				craftError("Parameter \"category_id\" is invalid. Category with ID " + request.body.category_id + " is not found.", 404)
			);
		}
		product.name = request.body.name || product.name;
		product.description = request.body.description || product.description;
		product.image = request.body.image || product.image;
		product.price = request.body.price || product.price;
		product.category_id = request.body.category_id;
		product.updated_at = (new Date()).getTime();
		product = <IProduct> await Product.modifyByID(product, product._id);
		await Product.commit();
		sendSuccessResponse(response, product, "Successfully modified product " + product.name + ".");
	} catch (error) {
		await Product.rollback();
		return sendErrorResponse(request, response, error);
	} finally {
		await Product.close();
	}
}

export async function deleteProduct(request: Request, response: Response) {
	const Product = getModel(ModelChoice.Product);
	try {
		const requirements: RequestRequirements = {
			query: ["_id"],
		};
		validateRequest(request, requirements);
		await Product.initialise();
		await Product.startTransaction();
		let product = <IProduct> await Product.fetchByID<IProduct>(request.query._id);
		if (!product) {
			return sendErrorResponse(request, response,
				craftError("Product with ID " + request.query._id + " is not found.", 404)
			);
		}
		await Product.removeByID(product._id);
		await Product.commit();
		sendSuccessResponse(response, "Successfully deleted category " + product.name + ".");
	} catch (error) {
		await Product.rollback();
		return sendErrorResponse(request, response, error);
	} finally {
		await Product.close();
	}
}
