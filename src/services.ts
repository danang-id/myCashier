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

import { HTTP_METHOD } from "./helpers/express";

function endpoint(uri: string) {
	return "/api/v1/".concat(uri);
}

export const Services: ServicesType = {
	GetCategories: {
		endpoint: endpoint("categories"),
		method: HTTP_METHOD.GET,
		handler: "getCategories"
	},
	GetCategory: {
		endpoint: endpoint("category"),
		method: HTTP_METHOD.GET,
		handler: "getCategory"
	},
	CreateCategory: {
		endpoint: endpoint("category"),
		method: HTTP_METHOD.POST,
		handler: "createCategory"
	},
	ModifyCategory: {
		endpoint: endpoint("category"),
		method: HTTP_METHOD.PATCH,
		handler: "modifyCategory"
	},
	DeleteCategory: {
		endpoint: endpoint("category"),
		method: HTTP_METHOD.DELETE,
		handler: "deleteCategory"
	},
	GetProducts: {
		endpoint: endpoint("products"),
		method: HTTP_METHOD.GET,
		handler: "getProducts"
	},
	GetProduct: {
		endpoint: endpoint("product"),
		method: HTTP_METHOD.GET,
		handler: "getProduct"
	},
	CreateProduct: {
		endpoint: endpoint("product"),
		method: HTTP_METHOD.POST,
		handler: "createProduct"
	},
	ModifyProduct: {
		endpoint: endpoint("product"),
		method: HTTP_METHOD.PATCH,
		handler: "modifyProduct"
	},
	DeleteProduct: {
		endpoint: endpoint("product"),
		method: HTTP_METHOD.DELETE,
		handler: "deleteProduct"
	},
	AddProductQuantity: {
		endpoint: endpoint("product/add"),
		method: HTTP_METHOD.POST,
		handler: "addProductQuantity"
	},
	ReduceProductQuantity: {
		endpoint: endpoint("product/reduce"),
		method: HTTP_METHOD.POST,
		handler: "reduceProductQuantity"
	},
};

export default Services

type ServicesType = {
	[k: string]: {
		endpoint: string,
		method: HTTP_METHOD,
		handler: string
	}
}
