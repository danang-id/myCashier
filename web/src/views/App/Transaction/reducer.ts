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
import { TransactionAction } from './action';

const initialState = {
	transaction: {},
	shoppingCart: []
};

const reducer: Reducer = (state: State = initialState, action: Action) => {
	switch(action.type) {
		case TransactionAction.RESET_TRANSACTION:
			return {
				...state,
				transaction: action.payload,
				shoppingCart: []
			};
		case TransactionAction.SET_SHOPPING_CART:
			return {
				...state,
				shoppingCart: action.payload
			};
		default:
			return state;
	}
};

export default reducer;
