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

export enum CategoryActions {
	SET_CATEGORIES = 'SET_CATEGORIES',
	SET_CATEGORY = 'SET_CATEGORY',
	ADD_CATEGORY = 'ADD_CATEGORY',
	UPDATE_CATEGORY = 'UPDATE_CATEGORY',
	REMOVE_CATEGORY = 'REMOVE_CATEGORY',
}

export const setCategories = (categories: any[]) => ({
	type: CategoryActions.SET_CATEGORIES,
	payload: categories
});

export const setCategory = (category: any) => ({
	type: CategoryActions.SET_CATEGORY,
	payload: category
});

export const addCategory = (category: any) => ({
	type: CategoryActions.ADD_CATEGORY,
	payload: category
});

export const updateCategory = (category: any) => ({
	type: CategoryActions.UPDATE_CATEGORY,
	payload: category
});

export const removeCategory = () => ({
	type: CategoryActions.REMOVE_CATEGORY
});

