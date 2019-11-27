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

// @flow

import FetcherFactory, { ConfigSet } from './FetcherFactory';
import Fetcher from './Fetcher';

const fetcher = new Fetcher(new FetcherFactory(ConfigSet.RESOURCE_API));

export async function getProducts(token: string, params?: GetProductsParams) {
	return fetcher.get('products', Fetcher.useAuthorisation({ params }, token));
}

export async function getPaginatedProducts(token: string, params?: GetProductsParams) {
	return fetcher.get('products/paginated', Fetcher.useAuthorisation({ params }, token));
}

export async function getProduct(token: string, _id: string) {
	return fetcher.get('product', Fetcher.useAuthorisation({ params: { _id } }, token));
}

export async function createProduct(
	token: string,
	name: string,
	description: string,
	image: string,
	price: number,
	category_id: string,
	stock?: number
) {
	return fetcher.post('product', {
		name, description, image, price, category_id, stock
	}, Fetcher.useAuthorisation({}, token));
}

export async function replaceProduct(
	token: string,
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
	}, Fetcher.useAuthorisation({ params: { _id } }, token));
}

export async function modifyProduct(
	token: string,
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
	}, Fetcher.useAuthorisation({ params: { _id } }, token));
}

export async function deleteProduct(token: string, _id: string) {
	return fetcher.delete('product', Fetcher.useAuthorisation({ params: { _id } }));
}

export async function addProductStock(token: string, _id: string, value: number) {
	return fetcher.post('product/add', { _id, value }, Fetcher.useAuthorisation({}, token));
}

export async function reduceProductStock(token: string, _id: string, value: number) {
	return fetcher.post('product/reduce', { _id, value }, Fetcher.useAuthorisation({}, token));
}

export type GetProductsParams = {
	query?: string,
	page?: number,
	page_by?: number,
	sort_by?: 'name' | 'category_id' | 'updated_at',
	sort_method?: 0 | 1,
}
