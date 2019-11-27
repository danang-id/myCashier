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

export const TransactionAction = {
	RESET_TRANSACTION: 'RESET_TRANSACTION',
	SET_CATEGORIES: 'SET_CATEGORIES',
	SET_PAGINATED_PRODUCT: 'SET_PAGINATED_PRODUCT',
	SET_SHOPPING_CART: 'SET_SHOPPING_CART'
}

export const resetTransaction = (transaction: any) => ({
	type: TransactionAction.RESET_TRANSACTION,
	payload: transaction
});

export const setCategories = (categories: any[]) => ({
	type: TransactionAction.SET_CATEGORIES,
	payload: categories
});

export const setPaginatedProducts = (paginatedProducts: []) => ({
	type: TransactionAction.SET_PAGINATED_PRODUCT,
	payload: paginatedProducts
});

export const setShoppingCart = (cart: any[]) => ({
	type: TransactionAction.SET_SHOPPING_CART,
	payload: cart
});
