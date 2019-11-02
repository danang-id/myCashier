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

import { createStore, applyMiddleware, Middleware } from 'redux';
import { persistStore } from 'redux-persist';
import { composeWithDevTools } from 'redux-devtools-extension';

import reducers from '../reducers';

const middlewares: Middleware[] = [];

middlewares.push(require('redux-promise-middleware').default);
if (process.env.NODE_ENV === 'development') {
	const { logger } = require('redux-logger');
	middlewares.push(logger);
}

export const store = createStore(reducers, process.env.NODE_ENV === 'development'
	? composeWithDevTools(applyMiddleware(...middlewares))
	: applyMiddleware(...middlewares)
);

export const persistor = persistStore(store);
