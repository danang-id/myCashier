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

function Fetcher(factory, runner) {
	if (typeof factory === 'undefined') {
		throw new Error('Fetcher: Fetcher Factory must be defined.');
	}
	this.defaultRunner = async function(fun, ...args) {
		if ('navigator' in window && !window.navigator.onLine) {
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
	};
	this.instance = factory.getInstance();
	this.runner = typeof runner !== 'undefined' ? runner : this.defaultRunner;
}

Fetcher.prototype.setFactory = function(factory) {
	if (typeof factory !== 'undefined') {
		this.instance = factory.getInstance();
	}
};

Fetcher.prototype.setRunner = function(runner) {
	this.runner = typeof runner !== 'undefined' ? runner : this.defaultRunner;
};

Fetcher.prototype.get = async function(url, config) {
	return this.runner(this.instance.get.bind(this), url, config);
};

Fetcher.prototype.post = async function(url, data, config) {
	return this.runner(this.instance.post.bind(this), url, data, config);
};

Fetcher.prototype.put = async function(url, data, config) {
	return this.runner(this.instance.put.bind(this), url, data, config);
};

Fetcher.prototype.patch = async function(url, data, config) {
	return this.runner(this.instance.patch.bind(this), url, data, config);
};

Fetcher.prototype.delete = async function(url, config) {
	return this.runner(this.instance.delete.bind(this), url, config);
};

Fetcher.prototype.useAuth = function(token, config) {
	return {
		...config,
		headers: {
			Authorization: 'Bearer ' + token
		}
	}
};

export default Fetcher;
