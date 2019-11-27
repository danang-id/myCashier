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

export async function getCategories(token: string) {
	return fetcher.get('categories', Fetcher.useAuthorisation({}, token));
}

export async function getCategory(token: string, _id: string) {
	return fetcher.get('category', Fetcher.useAuthorisation({ params: { _id } }, token));
}

export async function createCategory(
	token: string,
	name: string,
	description: string
) {
	return fetcher.post('category', {
		name, description
	}, Fetcher.useAuthorisation({}, token));
}

export async function replaceCategory(
	token: string,
	_id: string,
	name: string,
	description: string
) {
	return fetcher.put('category', {
		name, description
	}, Fetcher.useAuthorisation({ params: { _id } }, token));
}

export async function modifyCategory(
	token: string,
	_id: string,
	name: string,
	description: string,
) {
	return fetcher.patch('category', {
		name, description
	}, Fetcher.useAuthorisation({ params: { _id } }, token));
}

export async function deleteCategory(token: string, _id: string) {
	return fetcher.delete('category', Fetcher.useAuthorisation({ params: { _id } }, token));
}
