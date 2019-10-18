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

import fs from "fs";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import { Request, Response } from "express-serve-static-core";

import { getModel } from "../helpers/database";
import { sendSuccessResponse, throwError, validateRequest, RequestRequirements } from "../helpers/express";
import { IUser } from "../model/IUser";
import { ModelChoice } from "../model/factory/DatabaseFactory";
import { UUID } from "../helpers/uuid";
import { JWTConfig } from "../config/jwt.config";

export async function registerUser(request: Request, response: Response) {
	const User = getModel(ModelChoice.User);
	try {
		const requirements: RequestRequirements = {
			body: ["given_name", "maiden_name", "email_address", "password"],
		};
		validateRequest(request, requirements);
		await User.initialise();
		await User.startTransaction();
		const shortUUID = UUID.generateShort();
		let user: IUser = {
			_id: shortUUID,
			given_name: request.body.given_name,
			maiden_name: request.body.maiden_name,
			email_address: request.body.email_address,
			password: bcrypt.hashSync(request.query.password, shortUUID),
			created_at: (new Date()).getTime(),
			updated_at: null
		};
		user = <IUser> await User.create<IUser>(user);
		await User.commit();
		sendSuccessResponse(response, "Successfully registered " + user.given_name + " " + user.maiden_name + ".");
	} catch (error) {
		await User.rollback();
		throw error;
	} finally {
		await User.close();
	}
}

export async function signInUser(request: Request, response: Response) {
	const User = getModel(ModelChoice.User);
	try {
		const requirements: RequestRequirements = {
			body: ["email_address", "password"],
		};
		validateRequest(request, requirements);
		await User.initialise();
		await User.startTransaction();
		const user = <IUser> await User.fetchOne<IUser>({ email_address: request.query.email_address });
		if (!user) {
			throwError("Sign in failed! Please check your email address or password.", 400);
		}
		if (!bcrypt.compareSync(request.query.password, user.password)) {
			throwError("Sign in failed! Please check your email address or password.", 400);
		}
		const { password, ...signedUser } = user;
		const privateKey = fs.readFileSync(JWTConfig.privateKeyPath);
		const token = jwt.sign(signedUser, privateKey);
		await User.commit();
		sendSuccessResponse(response, { token  });
	} catch (error) {
		await User.rollback();
		throw error;
	} finally {
		await User.close();
	}
}

export interface ISignedUser extends Omit<IUser, 'password'> {}
