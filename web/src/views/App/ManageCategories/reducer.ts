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
import { CategoryActions } from './action';

const initialState = {
	categories: [],
	category: {},
};

const reducer: Reducer = (state: State = initialState, action: Action) => {
	switch(action.type) {
		case CategoryActions.SET_CATEGORIES:
			return {
				...state,
				categories: action.payload
			};
		case CategoryActions.SET_CATEGORY:
			return {
				...state,
				category: action.payload
			};
		case CategoryActions.ADD_CATEGORY:
			const categoriesAfterAdded = state.categories.slice(0);
			categoriesAfterAdded.push(action.payload);
			return {
				...state,
				categories: categoriesAfterAdded,
				category: {}
			};
		case CategoryActions.UPDATE_CATEGORY:
			const categoriesAfterModified = state.categories.map(
				(category: any) => category._id === action.payload._id ? action.payload : category
			);
			return {
				...state,
				categories: categoriesAfterModified,
				category: {}
			};
		case CategoryActions.REMOVE_CATEGORY:
			const categoriesAfterDeleted = state.categories.filter(
				(category: any) => category._id !== state.category._id
			);
			return {
				...state,
				categories: categoriesAfterDeleted,
				category: {}
			};
		default:
			return state;
	}
};

export default reducer;
