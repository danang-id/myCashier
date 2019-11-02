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

import { Reducer } from 'redux';
import { State } from '../../../reducers';
import { Action } from '../../../actions';
import { ProductActions } from './action';

const initialState = {
	products: [],
	product: {},
};

const reducer: Reducer = (state: State = initialState, action: Action) => {
	switch(action.type) {
		case ProductActions.SET_PRODUCTS:
			const { products, categories } = action.payload as {
				products: any[], categories: any[]
			};
			return {
				...state,
				products: products.map((p: any) => {
					const category = categories.find((c: any) => c._id === p.category_id);
					p.category = category.name;
					return p;
				})
			};
		case ProductActions.SET_PRODUCT:
			return {
				...state,
				product: action.payload
			};
		case ProductActions.ADD_PRODUCT:
			const { addProduct, addCategories } = action.payload as {
				addProduct: any, addCategories: any[]
			};
			const productsAfterAdded = state.products.slice(0);
			productsAfterAdded.push(addProduct);
			return {
				...state,
				products: productsAfterAdded.map((p: any) => {
					const category = addCategories.find((c: any) => c._id === p.category_id);
					p.category = category.name;
					return p;
				}),
				product: {}
			};
		case ProductActions.UPDATE_PRODUCT:
			const { updateProduct, updateCategories } = action.payload as {
				updateProduct: any, updateCategories: any[]
			};
			const productsAfterModified = state.products.map(
				(product: any) => product._id === updateProduct._id ? updateProduct : product
			);
			return {
				...state,
				products: productsAfterModified.map((p: any) => {
					const category = updateCategories.find((c: any) => c._id === p.category_id);
					p.category = category.name;
					return p;
				}),
				product: {}
			};
		case ProductActions.REMOVE_PRODUCT:
			const productsAfterDeleted = state.products.fiter(
				(product: any) => product._id !== state.product._id
			);
			return {
				...state,
				products: productsAfterDeleted,
				product: {}
			};
		default:
			return state;
	}
};

export default reducer;
