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

import { Controller, Delete, Get, Patch, Post, Put, Req, UseAuth } from '@tsed/common';
import { Docs } from '@tsed/swagger';
import { BadRequest, NotFound } from 'ts-httpexceptions';
import { EntityManager } from 'typeorm';

import { DatabaseService } from '../../services/DatabaseService';
import { ValidateRequest } from '../../decorators/ValidateRequestDecorator';
import { Category } from '../../model/Category';
import { Product } from '../../model/Product';
import { AuthenticationMiddleware } from '../../middlewares/AuthenticationMiddleware';

@Controller('/')
@Docs('api-v1')
export class CategoryController {

	private manager: EntityManager;

	constructor(private databaseService: DatabaseService) {}

	public $afterRoutesInit(): void {
		this.manager = this.databaseService.getManager();
	}

	@Get('/categories')
	@ValidateRequest({
		useTrim: true
	})
	@UseAuth(AuthenticationMiddleware)
	public async find(@Req() request): Promise<Category[]> {
		return this.manager.find(Category);
	}

	@Get('/category')
	@ValidateRequest({
		query: ['_id'],
		useTrim: true
	})
	@UseAuth(AuthenticationMiddleware)
	public async findByID(@Req() request): Promise<Category> {
		const query = {
			_id: request.query._id
		};
		const category = await this.manager.findOne(Category, query._id);
		if (typeof category === 'undefined') {
			throw new NotFound('Category with ID ' + query._id + ' is not found.');
		}
		return category;
	}

	@Post('/category')
	@ValidateRequest({
		body: ['name', 'description'],
		useTrim: true
	})
	@UseAuth(AuthenticationMiddleware)
	public async create(@Req() request): Promise<{ $data: Category, $message: string }> {
		const body = {
			name: request.body.name,
			description: request.body.description,
		};
		try {
			await this.databaseService.startTransaction();
			let category = new Category();
			category.name = body.name;
			category.description = body.description;
			category = await this.manager.save(category);
			await this.databaseService.commit();
			return { $data: category, $message: 'Successfully created category "' + category.name + '".' };
		} catch (error) {
			await this.databaseService.rollback();
			throw error;
		}
	}

	@Put('/category')
	@ValidateRequest({
		query: ['_id'],
		body: ['name', 'description'],
		useTrim: true
	})
	@UseAuth(AuthenticationMiddleware)
	public async replace(@Req() request): Promise<{ $data: Category, $message: string }> {
		const query = {
			_id: request.query._id,
		};
		const body = {
			name: request.body.name,
			description: request.body.description
		};
		try {
			await this.databaseService.startTransaction();
			let category = await this.manager.findOne(Category, query._id);
			if (typeof category === 'undefined') {
				throw new NotFound('Category with ID ' + query._id + ' is not found.');
			}
			category.name = body.name;
			category.description = body.description;
			category = await this.manager.save(category);
			await this.databaseService.commit();
			return { $data: category, $message: 'Successfully replaced category to "' + category.name + '".' };
		} catch (error) {
			await this.databaseService.rollback();
			throw error;
		}
	}

	@Patch('/category')
	@ValidateRequest({
		query: ['_id'],
		useTrim: true
	})
	@UseAuth(AuthenticationMiddleware)
	public async modify(@Req() request): Promise<{ $data: Category, $message: string }> {
		const query = {
			_id: request.query._id,
		};
		const body = {
			name: request.body.name,
			description: request.body.description
		};
		try {
			await this.databaseService.startTransaction();
			let category = await this.manager.findOne(Category, query._id);
			if (typeof category === 'undefined') {
				throw new NotFound('Category with ID ' + query._id + ' is not found.');
			}
			category.name = body.name || category.name;
			category.description = body.description || category.description;
			category = await this.manager.save(category);
			await this.databaseService.commit();
			return { $data: category, $message: 'Successfully modified category to "' + category.name + '".' };
		} catch (error) {
			await this.databaseService.rollback();
			throw error;
		}
	}

	@Delete('/category')
	@ValidateRequest({
		query: ['_id'],
		useTrim: true
	})
	@UseAuth(AuthenticationMiddleware)
	public async delete(@Req() request): Promise<string> {
		const query = {
			_id: request.query._id,
		};
		try {
			await this.databaseService.startTransaction();
			let category = await this.manager.findOne(Category, query._id);
			if (typeof category === 'undefined') {
				throw new NotFound('Category with ID ' + query._id + ' is not found.');
			}
			const productsUnderThisCategory = await this.manager.find(Product, {
				category_id: category._id
			});
			if (productsUnderThisCategory.length > 0) {
				const totalProduct = productsUnderThisCategory.length;
				const counts = totalProduct === 1 ? 'is 1 product' : 'are ' + totalProduct + ' products';
				throw new BadRequest('Failed to delete category "' +
					category.name +
					'". Currently, there ' +
					counts +
					' that defined under this category. Please delete them first.')
			}
			await this.manager.remove(category);
			await this.databaseService.commit();
			return 'Successfully deleted category "' + category.name + '".';
		} catch (error) {
			await this.databaseService.rollback();
			throw error;
		}
	}

}
