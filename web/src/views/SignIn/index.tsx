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

import React from 'react';
import {useDispatch, useSelector} from "react-redux";
import Button from '@material-ui/core/Button';
import CssBaseline from '@material-ui/core/CssBaseline';
import TextField from '@material-ui/core/TextField';
import Link from '@material-ui/core/Link';
import Box from '@material-ui/core/Box';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
// internal components
import Copyright from "../../components/Copyright";
import PropTypes from "prop-types";
import {signIn} from "../../services/AuthenticationAPI";
import {CircularProgress} from "@material-ui/core";
import {green} from "@material-ui/core/colors";
import {State} from "../../reducers";
import Logo from "../../assets/myCashier.png";
import Container from "@material-ui/core/Container";
import {authenticate, hideLoading, showLoading, showNotification} from "../../actions";

const useStyles = makeStyles(theme => ({
	'@global': {
		body: {
			backgroundColor: theme.palette.common.white,
		},
	},
	wrapper: {
		margin: theme.spacing(1),
		position: 'relative',
	},
	submit: {
		margin: theme.spacing(3, 0, 2),
	},
	buttonProgress: {
		color: green[500],
		position: 'absolute',
		top: '50%',
		left: '50%',
		marginTop: -12,
		marginLeft: -12,
	},
	paper: {
		marginTop: theme.spacing(8),
		display: 'flex',
		flexDirection: 'column',
		alignItems: 'center',
	},
	avatar: {
		margin: 20,
		width: '3rem',
		height: '3rem'
	},
	form: {
		width: '100%', // Fix IE 11 issue.
		marginTop: theme.spacing(3),
	},
}));

const SignIn: React.FC = (props)  => {
	const classes = useStyles();

	const [signInForm, setSignInForm] = React.useState({
		emailAddress: '',
		password: '',
	});

	const isLoading = useSelector((state: State) => state.root.isLoading);
	const dispatch = useDispatch();

	const onFormChange: React.ChangeEventHandler = (event) => {
		const { name, value } = event.target as any;
		const form = signInForm;
		(form as any)[name] = value;
		setSignInForm(form);
	};

	const doSignIn: React.MouseEventHandler = async (event) => {
		event.preventDefault();
		if (signInForm.emailAddress === '') {
			dispatch(showNotification('Email address cannot be empty!', 'error'));
			return;
		}
		if (signInForm.password === '') {
			dispatch(showNotification('Password cannot be empty!', 'error'));
			return;
		}
		try {
			dispatch(showLoading());
			const response: any = await signIn(signInForm.emailAddress, signInForm.password);
			dispatch(showNotification(response.message));
			dispatch(authenticate());
		} catch (error) {
			dispatch(showNotification(error.message, 'error'));
		} finally {
			dispatch(hideLoading());
		}
	};

	return (
		<Container component="main" maxWidth="xs">
			<CssBaseline />
			<div className={classes.paper}>
				<img className={classes.avatar} alt="myCashier" src={Logo} />
				<Typography component="h1" variant="h5">
					myCashier
				</Typography>
				<form className={classes.form} noValidate>
					<TextField
						variant="outlined"
						margin="normal"
						required
						fullWidth
						id="emailAddress"
						label="Email Address"
						name="emailAddress"
						autoComplete="email"
						autoFocus
						disabled={isLoading}
						onChange={onFormChange}
					/>
					<TextField
						variant="outlined"
						margin="normal"
						required
						fullWidth
						name="password"
						label="Password"
						type="password"
						id="password"
						autoComplete="current-password"
						disabled={isLoading}
						onChange={onFormChange}
					/>
					<div className={classes.wrapper}>
						<Button
							type="submit"
							fullWidth
							variant="contained"
							color="primary"
							className={classes.submit}
							disabled={isLoading}
							onClick={doSignIn}
						>
							Sign In
						</Button>
						{isLoading && <CircularProgress size={24} className={classes.buttonProgress} />}
					</div>
					<Grid container>
						<Grid item xs>
							<Link href="/forget-password" variant="body2">
								Forgot password?
							</Link>
						</Grid>
						<Grid item>
							{"Don't have an account? "}
							<Link href="/register" variant="body2">
								Register
							</Link>
						</Grid>
					</Grid>
					<Box mt={5}>
						<Copyright />
					</Box>
				</form>
			</div>
		</Container>
	)
};

SignIn.propTypes = {
	className: PropTypes.string,
};

export default SignIn;
