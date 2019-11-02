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

import { Controller, Get, Post, Req, UseAuth } from '@tsed/common';
import { Docs } from '@tsed/swagger';
import { BadRequest, NotFound } from 'ts-httpexceptions';
import { EntityManager } from 'typeorm';

import { DatabaseService } from '../../services/DatabaseService';
import { ValidateRequest } from '../../decorators/ValidateRequestDecorator';
import { Product } from '../../model/Product';
import { Transaction } from '../../model/Transaction';
import { ProductTransaction } from '../../model/ProductTransaction';
import { User } from '../../model/User';
import { AuthenticationMiddleware } from '../../middlewares/AuthenticationMiddleware';

@Controller('/')
@Docs('api-v1')
export class TransactionController {

	private manager: EntityManager;

	constructor(private databaseService: DatabaseService) {}

	public $afterRoutesInit(): void {
		this.manager = this.databaseService.getManager();
	}

	@Get('/transactions')
	@UseAuth(AuthenticationMiddleware)
	public async find(@Req() request): Promise<Transaction[]> {
		return await this.manager.find(Transaction);
	}

	@Get('/transaction')
	@ValidateRequest({
		query: ['_id'],
		useTrim: true
	})
	@UseAuth(AuthenticationMiddleware)
	public async findByID(@Req() request): Promise<Transaction & { products: Product[] }> {
		const query = {
			_id: request.query._id
		};
		const transaction = await this.manager.findOne(Transaction, query._id);
		if (typeof transaction === 'undefined') {
			throw new NotFound('Transaction with ID ' + query._id + ' is not found.');
		}
		const t: any = { ...transaction };
		const productTransactions = await this.manager.find(ProductTransaction, {
			transaction_id: transaction._id
		});
		t.products = [];
		const productPromises = [];
		for (const productTransaction of productTransactions) {
			t.products.push(productTransaction.quantity);
			productPromises.push(this.manager.findOne(Product, productTransaction.product_id));
		}
		const products = await Promise.all(productPromises);
		for (const [index,product] of products.entries()) {
			const quantity = t.products[index];
			t.products[index] = {
				...product,
				quantity
			}
		}
		return t;
	}

	@Post('/transaction')
	@UseAuth(AuthenticationMiddleware)
	public async create(@Req() request): Promise<{ $data: Transaction, $message: string }> {
		const user: User = (<any>request).user;
		try {
			await this.databaseService.startTransaction();
			let transaction = new Transaction();
			transaction.user_id = user._id;
			transaction = await this.manager.save(transaction);
			await this.databaseService.commit();
			return { $data: transaction, $message: 'Successfully created new transaction.' };
		} catch (error) {
			await this.databaseService.rollback();
			throw error;
		}
	}

	@Post('/transaction/add')
	@ValidateRequest({
		query: ['_id'],
		body: ['product_id', 'value'],
		useTrim: true
	})
	@UseAuth(AuthenticationMiddleware)
	public async addProductQuantity(@Req() request): Promise<{ $data: Transaction & { products: Product[] }, $message: string }> {
		const query = {
			_id: request.query._id,
		};
		const body = {
			product_id: request.body.product_id,
			value: parseInt(request.body.value)
		};
		try {
			await this.databaseService.startTransaction();
			const transaction = await this.manager.findOne(Transaction, query._id);
			if (typeof transaction === 'undefined') {
				throw new NotFound('Transaction with ID ' + query._id + ' is not found.');
			}
			let product = await this.manager.findOne(Product, body.product_id);
			if (typeof product === 'undefined') {
				throw new NotFound('Category with ID ' + body.product_id + ' is not found.');
			}
			if (body.value <= 0) {
				throw new BadRequest('Parameter "value" should be a positive integer. Given: ' + body.value + '.')
			}
			let productTransaction = await this.manager.findOne(ProductTransaction, {
				transaction_id: transaction._id, product_id: product._id
			});
			if (typeof productTransaction === 'undefined') {
				productTransaction = new ProductTransaction();
				productTransaction.transaction_id = transaction._id;
				productTransaction.product_id = product._id;
			}
			let outOfStock = false;
			if (body.value > product.stock) {
				outOfStock = true;
				body.value = product.stock;
			}
			productTransaction.quantity = productTransaction.quantity + body.value;
			product.stock = product.stock - body.value;
			await Promise.all([
				this.manager.save(productTransaction),
				this.manager.save(product)
			]);
			const t: any = { ...transaction };
			const productTransactions = await this.manager.find(ProductTransaction, {
				transaction_id: transaction._id
			});
			t.products = [];
			const productPromises = [];
			for (const productTransaction of productTransactions) {
				t.products.push(productTransaction.quantity);
				productPromises.push(this.manager.findOne(Product, productTransaction.product_id));
			}
			const products = await Promise.all(productPromises);
			for (const [index,product] of products.entries()) {
				const quantity = t.products[index];
				t.products[index] = {
					...product,
					quantity
				}
			}
			await this.databaseService.commit();
			return {
				$data: t,
				$message: outOfStock
					? product.name + ' is out of stock.'
					: 'Successfully added ' + body.value + ' quantity of ' + product.name + '.'
			};
		} catch (error) {
			await this.databaseService.rollback();
			throw error;
		}
	}

	@Post('/transaction/reduce')
	@ValidateRequest({
		query: ['_id'],
		body: ['product_id', 'value'],
		useTrim: true
	})
	@UseAuth(AuthenticationMiddleware)
	public async reduceProductQuantity(@Req() request): Promise<{ $data: Transaction & { products: Product[] }, $message: string }> {
		const query = {
			_id: request.query._id,
		};
		const body = {
			product_id: request.body.product_id,
			value: parseInt(request.body.value)
		};
		try {
			await this.databaseService.startTransaction();
			const transaction = await this.manager.findOne(Transaction, query._id);
			if (typeof transaction === 'undefined') {
				throw new NotFound('Transaction with ID ' + query._id + ' is not found.');
			}
			let product = await this.manager.findOne(Product, body.product_id);
			if (typeof product === 'undefined') {
				throw new NotFound('Category with ID ' + body.product_id + ' is not found.');
			}
			if (body.value <= 0) {
				throw new BadRequest('Parameter "value" should be a positive integer. Given: ' + body.value + '.')
			}
			let productTransaction = await this.manager.findOne(ProductTransaction, {
				transaction_id: transaction._id, product_id: product._id
			});
			if (typeof productTransaction === 'undefined') {
				productTransaction = new ProductTransaction();
				productTransaction.transaction_id = transaction._id;
				productTransaction.product_id = product._id;
			}
			if (body.value > productTransaction.quantity) {
				body.value = productTransaction.quantity;
			}
			productTransaction.quantity = productTransaction.quantity - body.value;
			product.stock = product.stock + body.value;
			await Promise.all([
				this.manager.save(productTransaction),
				this.manager.save(product)
			]);
			const t: any = { ...transaction };
			const productTransactions = await this.manager.find(ProductTransaction, {
				transaction_id: transaction._id
			});
			t.products = [];
			const productPromises = [];
			for (const productTransaction of productTransactions) {
				t.products.push(productTransaction.quantity);
				productPromises.push(this.manager.findOne(Product, productTransaction.product_id));
			}
			const products = await Promise.all(productPromises);
			for (const [index,product] of products.entries()) {
				const quantity = t.products[index];
				t.products[index] = {
					...product,
					quantity
				}
			}
			await this.databaseService.commit();
			return {
				$data: t,
				$message: 'Successfully reduced ' + request.body.value + ' quantity of ' + product.name + '.'
			};
		} catch (error) {
			await this.databaseService.rollback();
			throw error;
		}
	}

}
