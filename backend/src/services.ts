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
import packageJson from "../package.json";

function endpoint(uri: string) {
	const version = "v".concat(packageJson.version.split(".")[0]);
	return version.concat("/").concat(uri);
}

export const Services: ServicesType = {
	GetCategories: {
		endpoint: endpoint("categories"),
		method: HTTP_METHOD.GET,
		handler: "getCategories",
		useAuth: true
	},
	GetCategory: {
		endpoint: endpoint("category"),
		method: HTTP_METHOD.GET,
		handler: "getCategory",
		useAuth: true
	},
	CreateCategory: {
		endpoint: endpoint("category"),
		method: HTTP_METHOD.POST,
		handler: "createCategory",
		useAuth: true
	},
	ModifyCategory: {
		endpoint: endpoint("category"),
		method: HTTP_METHOD.PATCH,
		handler: "modifyCategory",
		useAuth: true
	},
	DeleteCategory: {
		endpoint: endpoint("category"),
		method: HTTP_METHOD.DELETE,
		handler: "deleteCategory",
		useAuth: true
	},
	GetProducts: {
		endpoint: endpoint("products"),
		method: HTTP_METHOD.GET,
		handler: "getProducts",
		useAuth: true
	},
	GetProduct: {
		endpoint: endpoint("product"),
		method: HTTP_METHOD.GET,
		handler: "getProduct",
		useAuth: true
	},
	CreateProduct: {
		endpoint: endpoint("product"),
		method: HTTP_METHOD.POST,
		handler: "createProduct",
		useAuth: true
	},
	ModifyProduct: {
		endpoint: endpoint("product"),
		method: HTTP_METHOD.PATCH,
		handler: "modifyProduct",
		useAuth: true
	},
	DeleteProduct: {
		endpoint: endpoint("product"),
		method: HTTP_METHOD.DELETE,
		handler: "deleteProduct",
		useAuth: true
	},
	AddProductStock: {
		endpoint: endpoint("product/add"),
		method: HTTP_METHOD.POST,
		handler: "addProductStock",
		useAuth: true
	},
	ReduceProductStock: {
		endpoint: endpoint("product/reduce"),
		method: HTTP_METHOD.POST,
		handler: "reduceProductStock",
		useAuth: true
	},
	GetTransaction: {
		endpoint: endpoint("transaction"),
		method: HTTP_METHOD.GET,
		handler: "getTransaction",
		useAuth: true
	},
	CreateNewTransaction: {
		endpoint: endpoint("transaction"),
		method: HTTP_METHOD.POST,
		handler: "createNewTransaction",
		useAuth: true
	},
	AddProductTransactionQuantity: {
		endpoint: endpoint("transaction/add"),
		method: HTTP_METHOD.POST,
		handler: "addProductTransactionQuantity",
		useAuth: true
	},
	ReduceProductTransactionQuantity: {
		endpoint: endpoint("transaction/reduce"),
		method: HTTP_METHOD.POST,
		handler: "reduceProductTransactionQuantity",
		useAuth: true
	},
	RegisterUser: {
		endpoint: endpoint("register"),
		method: HTTP_METHOD.POST,
		handler: "registerUser",
		useAuth: false
	},
	SignInUser: {
		endpoint: endpoint("sign_in"),
		method: HTTP_METHOD.POST,
		handler: "signInUser",
		useAuth: false
	},
};

export default Services

type ServicesType = {
	[k: string]: {
		endpoint: string,
		method: HTTP_METHOD,
		handler: string,
		useAuth: boolean
	}
}
