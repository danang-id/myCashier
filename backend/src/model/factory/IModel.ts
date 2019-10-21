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

export interface IModel {

	close(): Promise<boolean>;
	commit(): Promise<boolean>;
	create<T>(document: T): Promise<T>;
	fetch<T>(condition?: SearchCondition | SearchConditionString): Promise<T[]>;
	fetchByID<T>(_id: Identifier): Promise<T | null>;
	fetchOne<T>(condition?: SearchCondition | SearchConditionString): Promise<T | null>;
	initialise<B>(backbone?: B): Promise<B>;
	modify<T>(document: T, condition?: SearchCondition | SearchConditionString): Promise<T[]>;
	modifyByID<T>(document: T, _id: Identifier): Promise<T | null>;
	remove<T>(condition?: SearchCondition | SearchConditionString): Promise<boolean>;
	removeByID<T>(_id: Identifier): Promise<boolean>;
	rollback(): Promise<boolean>;
	startTransaction(): Promise<boolean>;

}

export type SearchCondition =
	| boolean
	| {
	[key: string]: any
}
export type SearchConditionString = string
export type Identifier = string;
