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

export async function getTransactions(token: string) {
	return fetcher.get('transactions', Fetcher.useAuthorisation({}, token));
}

export async function getTransaction(token: string, _id: string) {
	return fetcher.get('transaction', Fetcher.useAuthorisation({ params: { _id } }, token));
}

export async function createTransaction(token: string) {
	return fetcher.post('transaction', Fetcher.useAuthorisation({}, token));
}

export async function addProductQuantity(
	token: string,
	_id: string,
	product_id: string,
	value: number
) {
	return fetcher.post('transaction/add', {
		product_id, value
	}, Fetcher.useAuthorisation({ params: { _id } }));
}

export async function reduceProductQuantity(
	token: string,
	_id: string,
	product_id: string,
	value: number
) {
	return fetcher.post('transaction/reduce', {
		product_id, value
	}, Fetcher.useAuthorisation({ params: { _id } }));
}
