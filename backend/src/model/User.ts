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

import { Default, IgnoreProperty, Property, Required } from "@tsed/common"
import { Column, CreateDateColumn, Entity, PrimaryColumn, Unique, UpdateDateColumn } from "typeorm"
import { v1 as uuidv1 } from "uuid"

@Entity()
@Unique(["_id"])
@Unique(["email_address"])
export class User {
	@PrimaryColumn({ length: 36 })
	@Default(uuidv1())
	_id: string = uuidv1()

	@Column({ length: 255 })
	@Required()
	given_name: string

	@Column({ length: 255 })
	@Required()
	maiden_name: string

	@Column({ length: 255 })
	@Required()
	email_address: string

	@Column({ length: 255 })
	@Required()
	@IgnoreProperty()
	password: string

	@Column()
	@Required()
	@Default(false)
	is_activated: boolean = false

	@CreateDateColumn({ type: "timestamp" })
	@Property()
	created_at: Date

	@UpdateDateColumn({ type: "timestamp" })
	@Property()
	updated_at: Date
}
