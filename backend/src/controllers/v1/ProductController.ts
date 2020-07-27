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

import { Controller, Delete, Get, Patch, Post, Put, Req, UseAuth } from "@tsed/common"
import { Docs } from "@tsed/swagger"
import { BadRequest, NotFound } from "ts-httpexceptions"
import { EntityManager } from "typeorm"

import { DatabaseService } from "../../services/DatabaseService"
import { ValidateRequest } from "../../decorators/ValidateRequestDecorator"
import { Category } from "../../model/Category"
import { Product } from "../../model/Product"
import { AuthenticationMiddleware } from "../../middlewares/AuthenticationMiddleware"

@Controller("/")
@Docs("api-v1")
export class ProductController {
	private manager: EntityManager

	constructor(private databaseService: DatabaseService) {}

	public $afterRoutesInit(): void {
		this.manager = this.databaseService.getManager()
	}

	@Get("/products")
	@ValidateRequest({
		useTrim: true,
	})
	@UseAuth(AuthenticationMiddleware)
	public async find(@Req() request): Promise<Product[]> {
		const query = {
			query: request.query.query,
			page: request.query.page,
			page_by: request.query.page_by,
			sort_by: request.query.sort_by,
			sort_method: request.query.sort_method,
		}
		let products = await this.manager.find(Product)
		// Process search query
		if (!!query.query) {
			products = products.filter((product) => {
				return product.name.toLowerCase().includes(query.query.toLowerCase())
			})
		}
		// Paginate results
		if (!!query.page) {
			query.page = parseInt(query.page)
			if (!query.page_by) {
				query.page_by = 10
			}
			const skip = (query.page - 1) * query.page_by
			const offset = skip + query.page_by
			products = products.slice(skip, offset)
		}
		// Sort search results
		if (!!query.sort_by) {
			let sortMethod = !!query.sort_method ? parseInt(query.sort_method) : 1
			if (query.sort_by === "name" || query.sort_by === "updated_at") {
				products = products.sort((a, b) => {
					return a[query.sort_by] > b[query.sort_by]
						? sortMethod
						: b[query.sort_by] > a[query.sort_by]
						? -1 * sortMethod
						: 0
				})
			} else if (query.sort_by === "category_id") {
				const categories: string[] = []
				for (const product of products) {
					const category = await this.manager.findOne(Category, product.category_id)
					categories.push(category.name)
				}
				let index = 0
				products = products.sort((a, b) => {
					const aC = categories[index]
					const bC = categories[index + 1]
					index++
					return aC > bC ? sortMethod : bC > aC ? -1 * sortMethod : 0
				})
			}
		}
		return products
	}

	@Get("/product")
	@ValidateRequest({
		query: ["_id"],
		useTrim: true,
	})
	@UseAuth(AuthenticationMiddleware)
	public async findByID(@Req() request): Promise<Product> {
		const query = {
			_id: request.query._id,
		}
		const product = await this.manager.findOne(Product, query._id)
		if (typeof product === "undefined") {
			throw new NotFound("Product with ID " + query._id + " is not found.")
		}
		return product
	}

	@Post("/product")
	@ValidateRequest({
		body: ["name", "description", "image", "price", "category_id"],
		useTrim: true,
	})
	@UseAuth(AuthenticationMiddleware)
	public async create(@Req() request): Promise<{ $data: Product; $message: string }> {
		const body = {
			name: request.body.name,
			description: request.body.description,
			image: request.body.image,
			price: request.body.price,
			category_id: request.body.category_id,
			stock: request.body.stock,
		}
		try {
			await this.databaseService.startTransaction()
			const category = await this.manager.findOne(Category, body.category_id)
			if (typeof category === "undefined") {
				throw new NotFound("Category with ID " + body.category_id + " is not found.")
			}
			let product = new Product()
			product.name = body.name
			product.description = body.description
			product.image = body.image
			product.price = body.price
			product.category_id = category._id
			product.stock = body.stock || 0
			product = await this.manager.save(product)
			await this.databaseService.commit()
			return { $data: product, $message: 'Successfully created product "' + product.name + '".' }
		} catch (error) {
			await this.databaseService.rollback()
			throw error
		}
	}

	@Put("/product")
	@ValidateRequest({
		query: ["_id"],
		body: ["name", "description", "image", "price", "category_id"],
		useTrim: true,
	})
	@UseAuth(AuthenticationMiddleware)
	public async replace(@Req() request): Promise<{ $data: Product; $message: string }> {
		const query = {
			_id: request.query._id,
		}
		const body = {
			name: request.body.name,
			description: request.body.description,
			image: request.body.image,
			price: request.body.price,
			category_id: request.body.category_id,
			stock: request.body.stock,
		}
		try {
			await this.databaseService.startTransaction()
			let product = await this.manager.findOne(Product, query._id)
			if (typeof product === "undefined") {
				throw new NotFound("Product with ID " + query._id + " is not found.")
			}
			const category = await this.manager.findOne(Category, body.category_id)
			if (typeof category === "undefined") {
				throw new NotFound("Category with ID " + body.category_id + " is not found.")
			}
			product.name = body.name
			product.description = body.description
			product.image = body.image
			product.price = body.price
			product.category_id = category._id
			product.stock = body.stock || 0
			product = await this.manager.save(product)
			await this.databaseService.commit()
			return { $data: product, $message: 'Successfully replaced product to "' + product.name + '".' }
		} catch (error) {
			await this.databaseService.rollback()
			throw error
		}
	}

	@Patch("/product")
	@ValidateRequest({
		query: ["_id"],
		useTrim: true,
	})
	@UseAuth(AuthenticationMiddleware)
	public async modify(@Req() request): Promise<{ $data: Product; $message: string }> {
		const query = {
			_id: request.query._id,
		}
		const body = {
			name: request.body.name,
			description: request.body.description,
			image: request.body.image,
			price: request.body.price,
			category_id: request.body.category_id,
			stock: request.body.stock,
		}
		try {
			await this.databaseService.startTransaction()
			let product = await this.manager.findOne(Product, query._id)
			if (typeof product === "undefined") {
				throw new NotFound("Product with ID " + query._id + " is not found.")
			}
			const category = await this.manager.findOne(Category, body.category_id || product.category_id)
			if (typeof category === "undefined") {
				throw new NotFound("Category with ID " + body.category_id + " is not found.")
			}
			product.name = body.name || product.name
			product.description = body.description || product.description
			product.image = body.image || product.image
			product.price = body.price || product.price
			product.category_id = category._id
			product.stock = body.stock || product.stock
			product = await this.manager.save(product)
			await this.databaseService.commit()
			return { $data: product, $message: 'Successfully modified product to "' + product.name + '".' }
		} catch (error) {
			await this.databaseService.rollback()
			throw error
		}
	}

	@Delete("/product")
	@ValidateRequest({
		query: ["_id"],
		useTrim: true,
	})
	@UseAuth(AuthenticationMiddleware)
	public async delete(@Req() request): Promise<string> {
		const query = {
			_id: request.query._id,
		}
		try {
			await this.databaseService.startTransaction()
			let product = await this.manager.findOne(Product, query._id)
			if (typeof product === "undefined") {
				throw new NotFound("Product with ID " + query._id + " is not found.")
			}
			await this.manager.remove(product)
			await this.databaseService.commit()
			return 'Successfully deleted product "' + product.name + '".'
		} catch (error) {
			await this.databaseService.rollback()
			throw error
		}
	}

	@Post("/product/add")
	@ValidateRequest({
		body: ["_id", "value"],
		useTrim: true,
	})
	@UseAuth(AuthenticationMiddleware)
	public async addStock(@Req() request: Req): Promise<{ $data: Product; $message: string }> {
		const body = {
			_id: request.body._id,
			value: parseInt(request.body.value),
		}
		try {
			await this.databaseService.startTransaction()
			let product = await this.manager.findOne(Product, body._id)
			if (typeof product === "undefined") {
				throw new NotFound("Product with ID " + body._id + " is not found.")
			}
			if (body.value <= 0) {
				throw new BadRequest('Parameter "value" should be a positive integer. Given: ' + body.value + ".")
			}
			product.stock = product.stock + body.value
			product = await this.manager.save(product)
			await this.databaseService.commit()
			return {
				$data: product,
				$message: "Successfully added " + body.value + " stock of " + product.name + ".",
			}
		} catch (error) {
			await this.databaseService.rollback()
			throw error
		}
	}

	@Post("/product/reduce")
	@ValidateRequest({
		body: ["_id", "value"],
		useTrim: true,
	})
	@UseAuth(AuthenticationMiddleware)
	public async reduceStock(@Req() request: Req): Promise<{ $data: Product; $message: string }> {
		const body = {
			_id: request.body._id,
			value: parseInt(request.body.value),
		}
		try {
			await this.databaseService.startTransaction()
			let product = await this.manager.findOne(Product, body._id)
			if (typeof product === "undefined") {
				throw new NotFound("Product with ID " + body._id + " is not found.")
			}
			if (body.value <= 0) {
				throw new BadRequest('Parameter "value" should be a positive integer. Given: ' + body.value + ".")
			}
			const oldStock = product.stock
			let stock = product.stock - body.value
			if (stock < 0) {
				stock = 0
			}
			product.stock = stock
			product = await this.manager.save(product)
			await this.databaseService.commit()
			return {
				$data: product,
				$message: "Successfully reduced " + (oldStock - stock) + " stock of " + product.name + ".",
			}
		} catch (error) {
			await this.databaseService.rollback()
			throw error
		}
	}
}
