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

// @flow

import { AsyncStorage } from 'react-native';
import { Reducer, combineReducers } from 'redux';
import { persistReducer } from 'redux-persist';
import createSecureStore from 'redux-persist-expo-securestore';
import { Action, RootActions } from '../actions/index';
import { expo } from '../../app.json';
// import category from '../views/App/ManageCategories/reducer';
// import product from '../views/App/ManageProducts/reducer';
import transaction from '../screens/App/TransactionScreen/reducer';

const initialState = {
	accessToken: null,
	emailAddress: null,
	isLoading: false,
	isSigningOut: false,
	notification: null
};

const rootReducer: Reducer = (state: State = initialState, action: Action) => {
	switch(action.type) {
		case RootActions.SET_ACCESS_TOKEN:
			return {
				...state,
				accessToken: action.payload === null ? action.payload : action.payload.accessToken,
				emailAddress: action.payload === null ? action.payload : action.payload.emailAddress,
			};
		case RootActions.SET_LOADING:
			return {
				...state,
				isLoading: action.payload
			};
		case RootActions.SET_NOTIFICATION:
			return {
				...state,
				notification: action.payload,
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

const storage = createSecureStore();

const persistConfig = {
	key: expo.name,
	storage: AsyncStorage,
};

const rootPersistConfig= {
	...persistConfig,
	storage,
	key: 'root',
	blacklist: [ 'isLoading', 'isSigningOut', 'notification' ],
};

const reducers: Reducer = combineReducers({
	root: persistReducer(rootPersistConfig, rootReducer),
	transaction
});

export type State = {
	[key: string]: any;
};

export default persistReducer(persistConfig, reducers);
