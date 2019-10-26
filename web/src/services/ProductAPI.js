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

export async function getProducts(token, params) {
	return fetcher.get('products', fetcher.useAuth(token, { params }))
}

export async function getProduct(token, _id) {
	return fetcher.get('product', fetcher.useAuth(token, { params: { _id } }))
}

export async function createProduct(token, name, description, image, price, category_id) {
	return fetcher.post('product', {
		name, description, image, price, category_id
	}, fetcher.useAuth(token, {}))
}

export async function modifyProduct(token, _id, name, description, image, price, category_id) {
	return fetcher.patch('product', {
		name, description, image, price, category_id
	}, fetcher.useAuth(token, { params: { _id } }))
}

export async function deleteProduct(token, _id) {
	return fetcher.delete('product', fetcher.useAuth(token, { params: { _id } }))
}
