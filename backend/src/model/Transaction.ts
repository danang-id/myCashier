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

import { Default, Property, Required } from "@tsed/common"
import { Column, CreateDateColumn, Entity, PrimaryColumn, Unique, UpdateDateColumn } from "typeorm"
import { v1 as uuidv1 } from "uuid"

@Entity()
@Unique(["_id"])
export class Transaction {
	@PrimaryColumn({ length: 36 })
	@Default(uuidv1())
	_id: string = uuidv1()

	@Column({ length: 36 })
	@Required()
	user_id: string

	@CreateDateColumn({ type: "timestamp" })
	@Property()
	created_at: Date

	@UpdateDateColumn({ type: "timestamp" })
	@Property()
	updated_at: Date
}
