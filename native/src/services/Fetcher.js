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

import { NetInfo } from 'react-native';
import { AxiosInstance, AxiosRequestConfig } from 'axios';
import FetcherFactory from './FetcherFactory';

class Fetcher {

	instance: AxiosInstance;
	runner: Runner;

	constructor(factory: FetcherFactory, runner?: Runner) {
		if (typeof factory === 'undefined') {
			throw new Error('Fetcher: Fetcher Factory must be defined.');
		}
		this.instance = factory.getInstance();
		this.runner = typeof runner !== 'undefined' ? runner : Fetcher.defaultRunner;
	}

	static async defaultRunner<R>(fun: Function, ...args: any[]): Promise<R> {
		if (!(await NetInfo.isConnected.fetch())) {
			throw new Error('You are offline. Make sure you are connected to the network.');
		}
		try {
			const { data } = await fun(...args);
			if (data.success === true) {
				return data;
			}
			const error = new Error(data.message);
			error.response = data;
			throw error;
		} catch (error) {
			throw error;
		}
	}

	setFactory(factory: FetcherFactory) {
		if (typeof factory !== 'undefined') {
			this.instance = factory.getInstance();
		}
	}

	setRunner(runner: Runner): void {
		this.runner = typeof runner !== 'undefined' ? runner : Fetcher.defaultRunner;
	}

	async get(endpoint: string, config?: AxiosRequestConfig) {
		return this.runner(this.instance.get.bind(this), endpoint, config);
	}

	async post(endpoint: string, data?: any, config?: AxiosRequestConfig) {
		return this.runner(this.instance.post.bind(this), endpoint, data, config);
	}

	async put(endpoint: string, data?: any, config?: AxiosRequestConfig) {
		return this.runner(this.instance.put.bind(this), endpoint, data, config);
	}

	async patch(endpoint: string, data?: any, config?: AxiosRequestConfig) {
		return this.runner(this.instance.patch.bind(this), endpoint, data, config);
	}

	async delete(endpoint: string, config?: AxiosRequestConfig) {
		return this.runner(this.instance.delete.bind(this), endpoint, config);
	}

	static useAuthorisation(config: AxiosRequestConfig, token: string): AxiosRequestConfig {
		return {
			...config,
			headers: { Authorization: 'Bearer ' + token }
		};
	}

}

export type Runner = <R>(fun: Function, ...args: any[]) => Promise<R>

export default Fetcher;
