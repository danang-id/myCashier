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

import { serve } from "./MainController";
import { getCategories, getCategory, createCategory, modifyCategory, deleteCategory } from "./CategoryController";
import { getProducts, getProduct, createProduct, modifyProduct, deleteProduct } from "./ProductController";
import { addProductStock, reduceProductStock } from "./ProductStockController";
import {
	getTransaction,
	createNewTransaction,
	addProductTransactionQuantity,
	reduceProductTransactionQuantity,
} from "./TransactionController";
import { registerUser, signInUser } from "./AuthenticationController";
import { RequestHandler } from "express-serve-static-core";

export const Controllers: ControllersType = {
	serve,
	getCategories,
	getCategory,
	createCategory,
	modifyCategory,
	deleteCategory,
	getProducts,
	getProduct,
	createProduct,
	modifyProduct,
	deleteProduct,
	addProductStock,
	reduceProductStock,
	getTransaction,
	createNewTransaction,
	addProductTransactionQuantity,
	reduceProductTransactionQuantity,
	registerUser,
	signInUser,
};

export default Controllers;

type ControllersType = {
	[k: string]: RequestHandler;
};
