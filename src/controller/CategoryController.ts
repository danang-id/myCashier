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

export async function getCategories(request: Request, response: Response) {
	const Category = getModel(ModelChoice.Category);
	try {
		const b = await Category.initialise();
		const categories = await Category.fetch<ICategory>();
		sendSuccessResponse(response, categories);
	} catch (error) {
		return sendErrorResponse(request, response, error);
	} finally {
		await Category.close();
	}
}

export async function getCategory(request: Request, response: Response) {
	const Category = getModel(ModelChoice.Category);
	try {
		const requirements: RequestRequirements = {
			query: ["_id"],
		};
		validateRequest(request, requirements);
		await Category.initialise();
		const category = await Category.fetchByID<ICategory>(request.query._id);
		if (!category) {
			return sendErrorResponse(request, response,
				craftError("Category with ID " + request.query._id + " is not found.", 404)
			);
		}
		sendSuccessResponse(response, category);
	} catch (error) {
		return sendErrorResponse(request, response, error);
	} finally {
		await Category.close();
	}
}

export async function createCategory(request: Request, response: Response) {
	const Category = getModel(ModelChoice.Category);
	try {
		const requirements: RequestRequirements = {
			body: ["name"],
		};
		validateRequest(request, requirements);
		await Category.initialise();
		await Category.startTransaction();
		let category: ICategory = {
			_id: UUID.generateShort(),
			name: request.body.name,
			description: request.body.description || "",
			created_at: (new Date()).getTime(),
			updated_at: null,
		};
		category = await Category.create<ICategory>(category);
		await Category.commit();
		sendSuccessResponse(response, category, "Successfully created category " + category.name + ".");
	} catch (error) {
		await Category.rollback();
		return sendErrorResponse(request, response, error);
	} finally {
		await Category.close();
	}
}

export async function modifyCategory(request: Request, response: Response) {
	const Category = getModel(ModelChoice.Category);
	try {
		const requirements: RequestRequirements = {
			query: ["_id"],
		};
		validateRequest(request, requirements);
		await Category.initialise();
		await Category.startTransaction();
		let category = <ICategory> await Category.fetchByID<ICategory>(request.query._id);
		if (!category) {
			return sendErrorResponse(request, response,
				craftError("Category with ID " + request.query._id + " is not found.", 404)
			);
		}
		category.name = request.body.name || category.name;
		category.description = request.body.description || category.description;
		category.updated_at = (new Date()).getTime();
		category = <ICategory> await Category.modifyByID<ICategory>(category, category._id);
		await Category.commit();
		sendSuccessResponse(response, category, "Successfully modified category " + category.name + ".");
	} catch (error) {
		await Category.rollback();
		return sendErrorResponse(request, response, error);
	} finally {
		await Category.close();
	}
}

export async function deleteCategory(request: Request, response: Response) {
	const Category = getModel(ModelChoice.Category);
	const Product = getModel(ModelChoice.Product);
	try {
		const requirements: RequestRequirements = {
			query: ["_id"],
		};
		validateRequest(request, requirements);
		const backbone = await Category.initialise();
		await Product.initialise(backbone);
		await Category.startTransaction();
		let category = <ICategory> await Category.fetchByID<ICategory>(request.query._id);
		if (!category) {
			return sendErrorResponse(request, response,
				craftError("Category with ID " + request.query._id + " is not found.", 404)
			);
		}
		const productsUnderThisCategory = await Product.fetch<IProduct>({ category_id: category._id });
		if (productsUnderThisCategory.length > 0) {
			const totalProduct = productsUnderThisCategory.length;
			const counts = totalProduct === 1 ? "is 1 product" : "are " + totalProduct + " products";
			return sendErrorResponse(request, response,
				craftError("Failed to delete category " + category.name + ". Currently, there " + counts + " that defined under this category. Please delete them first.", 400)
			);
		}
		await Category.removeByID(category._id);
		await Category.commit();
		sendSuccessResponse(response, "Successfully deleted category " + category.name + ".");
	} catch (error) {
		await Category.rollback();
		return sendErrorResponse(request, response, error);
	} finally {
		await Category.close();
	}
}
