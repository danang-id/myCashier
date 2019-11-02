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

export type Action = {
	type: string;
	payload?: any;
	[key: string]: any;
};

export enum RootActions {
	SET_AUTHENTICATION = 'SET_AUTHENTICATION',
	SET_LOADING = 'SET_LOADING',
	SET_NOTIFICATION = 'SET_NOTIFICATION',
	SET_SIGNING_OUT = 'SET_SIGNING_OUT'
}

export const authenticate = () => ({
	type: RootActions.SET_AUTHENTICATION,
	payload: true,
});

export const deAuthenticate = () => ({
	type: RootActions.SET_AUTHENTICATION,
	payload: false
});

export const showLoading = () => ({
	type: RootActions.SET_LOADING,
	payload: true
});

export const hideLoading = () => ({
	type: RootActions.SET_LOADING,
	payload: false
});

export const showNotification = (
	message: string,
	type: 'info' | 'success' | 'warning' | 'error' = 'info'
) => ({
	type: RootActions.SET_NOTIFICATION,
	payload: { message, type }
});

export const hideNotification = () => ({
	type: RootActions.SET_NOTIFICATION,
	payload: null
});

export const showSignOutModal = () => ({
	type: RootActions.SET_SIGNING_OUT,
	payload: true
});

export const hideSignOutModal = () => ({
	type: RootActions.SET_SIGNING_OUT,
	payload: false
});
