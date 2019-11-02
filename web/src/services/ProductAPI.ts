/**
 * This program was written and submitted for Bootcamp Arkademy
 * Batch 12 selection.
 *
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

import FetcherFactory, { ConfigSet } from './FetcherFactory';
import Fetcher from './Fetcher';

const fetcher = new Fetcher(new FetcherFactory(ConfigSet.RESOURCE_API));

export async function getProducts(params?: GetProductsParams) {
	return fetcher.get('products', { params });
}

export async function getProduct(_id: string) {
	return fetcher.get('product', { params: { _id } });
}

export async function createProduct(
	name: string,
	description: string,
	image: string,
	price: number,
	category_id: string,
	stock?: number
) {
	return fetcher.post('product', {
		name, description, image, price, category_id, stock
	});
}

export async function replaceProduct(
	_id: string,
	name: string,
	description: string,
	image: string,
	price: number,
	category_id: string,
	stock?: number
) {
	return fetcher.put('product', {
		name, description, image, price, category_id, stock
	}, { params: { _id } });
}

export async function modifyProduct(
	_id: string,
	name: string,
	description: string,
	image: string,
	price: number,
	category_id: string,
	stock?: number
) {
	return fetcher.patch('product', {
		name, description, image, price, category_id, stock
	}, { params: { _id } });
}

export async function deleteProduct(_id: string) {
	return fetcher.delete('product', { params: { _id } });
}

export async function addProductStock(_id: string, value: number) {
	return fetcher.post('product/add', { _id, value });
}

export async function reduceProductStock(_id: string, value: number) {
	return fetcher.post('product/reduce', { _id, value });
}

export type GetProductsParams = {
	query?: string
	page?: number
	page_by?: number
	sort_by?: 'name' | 'category_id' | 'updated_at',
	sort_method?: 0 | 1
}
