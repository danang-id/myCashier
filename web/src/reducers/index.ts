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

import { Reducer, combineReducers } from 'redux';
import { createInstance, INDEXEDDB } from 'localforage';
import { Action, RootActions } from '../actions';
import pkg from '../../package.json';
import category from '../views/App/ManageCategories/reducer';
import product from '../views/App/ManageProducts/reducer';
import transaction from '../views/App/Transaction/reducer';
import {persistReducer} from "redux-persist";
import {PersistConfig} from "redux-persist/es/types";

const initialState = {
	isAuthenticated: false,
	isLoading: false,
	isSigningOut: false,
	notification: null
};

const rootReducer: Reducer = (state: State = initialState, action: Action) => {
	switch(action.type) {
		case RootActions.SET_AUTHENTICATION:
			return {
				...state,
				isAuthenticated: action.payload
			};
		case RootActions.SET_LOADING:
			return {
				...state,
				isLoading: action.payload
			};
		case RootActions.SET_NOTIFICATION:
			return {
				...state,
				notification: action.payload
			};
		case RootActions.SET_SIGNING_OUT:
			return {
				...state,
				isSigningOut: action.payload
			};
		default:
			return state;
	}
};


const persistConfig: PersistConfig<Reducer> = {
	key: pkg.name,
	storage: createInstance({
		name: pkg.name,
		driver: INDEXEDDB,
		version: 1.0,
	}),
};

const rootPersistConfig: PersistConfig<Reducer> = {
	...persistConfig,
	key: 'root',
	blacklist: [ 'isLoading', 'isSigningOut', 'notification' ],
};

const reducers: Reducer = combineReducers({
	root: persistReducer(rootPersistConfig, rootReducer),
	category,
	product,
	transaction
});

export type State = {
	[key: string]: any;
};

export default persistReducer(persistConfig, reducers);
