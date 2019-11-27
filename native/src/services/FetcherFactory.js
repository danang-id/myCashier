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

const validateStatus = (status: number) => status >= 200 && status <= 500;

export const ConfigSet = {
	DEFAULT_API: 0,
	RESOURCE_API: 1
};

class FetcherFactory {

	config: AxiosRequestConfig;

	constructor(configSet?: ConfigSet) {
		this.config = FetcherFactory.getConfig(
			typeof configSet !== 'undefined' ? configSet : ConfigSet.DEFAULT_API
		);
	}

	static getConfig(configSet: ConfigSet): AxiosRequestConfig {
		switch (configSet) {
			case ConfigSet.DEFAULT_API:
				return {
					baseURL: 'https://api.mycashier.pw/',
					validateStatus,
					headers: {
						'Use-Token': true
					}
				};
			case ConfigSet.RESOURCE_API:
				return {
					baseURL: 'https://api.mycashier.pw/v1/',
					validateStatus,
				};
		}
	}

	getInstance(): AxiosInstance {
		return axios.create(this.config);
	}

}

export default FetcherFactory;
