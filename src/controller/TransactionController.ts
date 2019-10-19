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


import clone from "lodash.clone";
import { Request, Response } from "express-serve-static-core";

import { getModel } from "../helpers/database";
import { craftError, sendErrorResponse, sendSuccessResponse, validateRequest, RequestRequirements } from "../helpers/express";
import { IProduct } from "../model/IProduct";
import { IProductTransaction } from "../model/IProductTransaction";
import { ITransaction } from "../model/ITransaction";
import { ModelChoice } from "../model/factory/DatabaseFactory";
import { UUID } from "../helpers/uuid";

export async function getTransaction(request: Request, response: Response) {
	const Product = getModel(ModelChoice.Product);
	const ProductTransaction = getModel(ModelChoice.ProductTransaction);
	const Transaction = getModel(ModelChoice.Transaction);
	try {
		const requirements: RequestRequirements = {
			query: ["_id"]
		};
		validateRequest(request, requirements);
		const backbone = await Product.initialise();
		await ProductTransaction.initialise(clone(backbone));;
		await Transaction.initialise(clone(backbone));;
		const transaction = <ITransaction> await Transaction.fetchByID<ITransaction>(request.query._id);
		if (!transaction) {
			return sendErrorResponse(request, response,
				craftError("Transaction with ID " + request.query._id + " is not found.", 404)
			);
		}
		const responseObject: any = transaction;
		const productTransactions = <IProductTransaction[]> await ProductTransaction.fetch();
		const productTransaction = productTransactions.find(
			pt => pt.transaction_id === transaction._id
		);
		responseObject.products = [];
		for (const productTransaction of productTransactions) {
			const quantity = productTransaction.quantity;
			const product = <IProduct> await Product.fetchByID<IProduct>(productTransaction.product_id);
			responseObject.products.push({
				...product,
				quantity
			});
		}
		sendSuccessResponse(response, responseObject);
	} catch (error) {
		return sendErrorResponse(request, response, error);
	} finally {
		await Transaction.close();
	}
}

export async function createNewTransaction(request: Request, response: Response) {
	const Transaction = getModel(ModelChoice.Transaction);
	try {
		await Transaction.initialise();
		await Transaction.startTransaction();
		let transaction: ITransaction = {
			_id: UUID.generateShort(),
			user_id: (<any>request).user._id,
			created_at: (new Date()).getTime()
		};
		transaction = <ITransaction> await Transaction.create<ITransaction>(transaction);
		await Transaction.commit();
		sendSuccessResponse(response, transaction, "Successfully created new transaction.");
	} catch (error) {
		await Transaction.rollback();
		return sendErrorResponse(request, response, error);
	} finally {
		await Transaction.close();
	}
}

export async function addProductTransactionQuantity(request: Request, response: Response) {
	const Product = getModel(ModelChoice.Product);
	const ProductTransaction = getModel(ModelChoice.ProductTransaction);
	const Transaction = getModel(ModelChoice.Transaction);
	try {
		const requirements: RequestRequirements = {
			body: ["product_id", "transaction_id", "value"],
		};
		validateRequest(request, requirements);
		const backbone = await Product.initialise();
		await ProductTransaction.initialise(clone(backbone));;
		await Transaction.initialise(clone(backbone));;
		await Transaction.startTransaction();
		let product = <IProduct> await Product.fetchByID<IProduct>(request.body.product_id);
		if (!product) {
			return sendErrorResponse(request, response,
				craftError("Product with ID " + request.body.product_id + " is not found.", 404)
			);
		}
		const transaction = <ITransaction> await Transaction.fetchByID<ITransaction>(request.body.transaction_id);
		if (!transaction) {
			return sendErrorResponse(request, response,
				craftError("Transaction with ID " + request.body.transaction_id + " is not found.", 404)
			);
		}
		request.body.value = parseInt(request.body.value);
		if (request.body.value <= 0) {
			return sendErrorResponse(request, response,
				craftError(
				"Parameter \"value\" should be a positive integer. Given: " + request.body.value + ".",
				400)
			);
		}
		let outOfStock = false;
		if (request.body.value > product.stock) {
			outOfStock = true;
			request.body.value = product.stock;
		}
		const productTransactions = <IProductTransaction[]> await ProductTransaction.fetch();
		let productTransaction = productTransactions.find(
			pt => pt.product_id === product._id && pt.transaction_id === transaction._id
		);
		if (!productTransaction) {
			productTransaction = <IProductTransaction> await ProductTransaction.create<IProductTransaction>({
				_id: UUID.generateShort(),
				product_id: product._id,
				transaction_id: transaction._id,
				quantity: 0,
				created_at: (new Date()).getTime(),
				updated_at: null
			});
		}
		productTransaction.quantity = productTransaction.quantity + request.body.value;
		product.stock = product.stock - request.body.value;
		productTransaction = <IProductTransaction> await ProductTransaction.modifyByID<IProductTransaction>(
			productTransaction, productTransaction._id
		);
		product = <IProduct> await Product.modifyByID<IProduct>(product, product._id);
		await Transaction.commit();
		const message = outOfStock
			? "Product " + product.name + " is out of stock."
			: "Successfully added " + request.body.value + " quantity of " + product.name + ".";
		sendSuccessResponse(response, productTransaction, message);
	} catch (error) {
		await Transaction.rollback();
		return sendErrorResponse(request, response, error);
	} finally {
		await Transaction.close();
	}
}

export async function reduceProductTransactionQuantity(request: Request, response: Response) {
	const Product = getModel(ModelChoice.Product);
	const ProductTransaction = getModel(ModelChoice.ProductTransaction);
	const Transaction = getModel(ModelChoice.Transaction);
	try {
		const requirements: RequestRequirements = {
			body: ["product_id", "transaction_id", "value"],
		};
		validateRequest(request, requirements);
		const backbone = await Product.initialise();
		await ProductTransaction.initialise(clone(backbone));;
		await Transaction.initialise(clone(backbone));;
		await Transaction.startTransaction();
		let product = <IProduct> await Product.fetchByID<IProduct>(request.body.product_id);
		if (!product) {
			return sendErrorResponse(request, response,
				craftError("Product with ID " + request.body.product_id + " is not found.", 404)
			);
		}
		const transaction = <ITransaction> await Transaction.fetchByID<ITransaction>(request.body.transaction_id);
		if (!transaction) {
			return sendErrorResponse(request, response,
				craftError("Transaction with ID " + request.body.transaction_id + " is not found.", 404)
			);
		}
		request.body.value = parseInt(request.body.value);
		if (request.body.value <= 0) {
			return sendErrorResponse(request, response,
				craftError(
				"Parameter \"value\" should be a positive integer. Given: " + request.body.value + ".",
				400)
			);
		}
		const productTransactions = <IProductTransaction[]> await ProductTransaction.fetch();
		let productTransaction = productTransactions.find(
			pt => pt.product_id === product._id && pt.transaction_id === transaction._id
		);
		if (!productTransaction) {
			productTransaction = <IProductTransaction> await ProductTransaction.create<IProductTransaction>({
				_id: UUID.generateShort(),
				product_id: product._id,
				transaction_id: transaction._id,
				quantity: 0,
				created_at: (new Date()).getTime(),
				updated_at: null
			});
		}
		if (request.body.value > productTransaction.quantity) {
			request.body.value = productTransaction.quantity;
		}
		productTransaction.quantity = productTransaction.quantity - request.body.value;
		product.stock = product.stock + request.body.value;
		productTransaction = <IProductTransaction> await ProductTransaction.modifyByID<IProductTransaction>(
			productTransaction, productTransaction._id
		);
		product = <IProduct> await Product.modifyByID<IProduct>(product, product._id);
		await Transaction.commit();
		sendSuccessResponse(response, productTransaction, "Successfully reduced " + request.body.value + " quantity of " + product.name + ".");
	} catch (error) {
		await Transaction.rollback();
		return sendErrorResponse(request, response, error);
	} finally {
		await Transaction.close();
	}
}
