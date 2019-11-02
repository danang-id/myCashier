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

import axios, {  AxiosInstance, AxiosRequestConfig } from 'axios';

const defaultBaseURL = window.location.protocol + '//' + window.location.hostname + ':' + window.location.port + '/';
const defaultVersion = 'v1';
const validateStatus = (status: number) => status >= 200 && status <= 500;

export enum ConfigSet {
	DEFAULT_API,
	RESOURCE_API
}

const getCookie = (name: string) => {
	const value = '; ' + document.cookie;
	const parts = value.split('; ' + name + '=');
	return parts.length === 2 ? parts[1] : void 0;
};

const userAgent = window.navigator.userAgent;
export const shouldUseToken = !!userAgent.match(/iPad/i)
	|| !!userAgent.match(/iPhone/i)
	|| !!userAgent.match(/WebKit/i);

class FetcherFactory {

	private readonly config: AxiosRequestConfig;

	constructor(configSet?: ConfigSet) {
		this.config = FetcherFactory.getConfig(
			typeof configSet !== 'undefined' ? configSet : ConfigSet.DEFAULT_API
		);
	}

	private static getConfig(configSet: ConfigSet): AxiosRequestConfig {
		switch (configSet) {
			case ConfigSet.DEFAULT_API:
				return {
					baseURL: (process.env.REACT_APP_API_BASE_URL || defaultBaseURL),
					validateStatus,
					withCredentials: true,
					headers: shouldUseToken ? {
						'Use-Token': true
					} : {}
				};
			case ConfigSet.RESOURCE_API:
				return {
					baseURL: (process.env.REACT_APP_API_BASE_URL || defaultBaseURL)
						.concat(process.env.REACT_APP_API_VERSION || defaultVersion)
						.concat('/'),
					validateStatus,
					withCredentials: true,
					headers: shouldUseToken && !!getCookie('x-access-token') ? {
						Authorization:  'Bearer ' + getCookie('x-access-token')
					} : {}
				};
		}
	}

	public getInstance(): AxiosInstance {
		return axios.create(this.config);
	}

}

export default FetcherFactory;
