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


// component library
import React from 'react';
import { useHistory } from "react-router";
import { useDispatch, useSelector } from "react-redux";
import Button from '@material-ui/core/Button';
import CssBaseline from '@material-ui/core/CssBaseline';
import TextField from '@material-ui/core/TextField';
import Link from '@material-ui/core/Link';
import Grid from '@material-ui/core/Grid';
import Box from '@material-ui/core/Box';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';
// internal components
import Copyright from "../../components/Copyright";
import PropTypes from "prop-types";
import {register} from "../../services/AuthenticationAPI";
import {CircularProgress} from "@material-ui/core";
import {green} from "@material-ui/core/colors";
import {State} from "../../reducers";
import {hideLoading, showLoading, showNotification} from "../../actions";
import Logo from "../../assets/myCashier.png";

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

const Register: React.FC = (props: any) => {
	const classes = useStyles();

	const [registrationForm, setRegistrationForm] = React.useState({
		givenName: '',
		maidenName: '',
		emailAddress: '',
		password: '',
		passwordConfirmation: '',
	});

	const isLoading = useSelector((state: State) => state.root.isLoading);
	const dispatch = useDispatch();
	const history = useHistory();

	const onFormChange: React.ChangeEventHandler = (event) => {
		const { name, value } = event.target as any;
		const form = registrationForm;
		(form as any)[name] = value;
		setRegistrationForm(form);
	};

	const doRegister: React.MouseEventHandler = async (event: any) => {
		event.preventDefault();
		if (registrationForm.givenName === '') {
			dispatch(showNotification('Given name cannot be empty!', 'error'));
			return;
		}
		if (registrationForm.maidenName === '') {
			dispatch(showNotification('Maiden name cannot be empty!', 'error'));
			return;
		}
		if (registrationForm.emailAddress === '') {
			dispatch(showNotification('Email address cannot be empty!', 'error'));
			return;
		}
		if (registrationForm.password === '') {
			dispatch(showNotification('Password cannot be empty!', 'error'));
			return;
		}
		if (registrationForm.passwordConfirmation === '') {
			dispatch(showNotification('Password confirmation cannot be empty!', 'error'));
			return;
		}
		const emailRegExp = new RegExp(
			/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
		);
		if (!emailRegExp.test(registrationForm.emailAddress)) {
			dispatch(showNotification(registrationForm.emailAddress + ' is not a valid email address!', 'error'));
			return;
		}
		if (registrationForm.password.length < 8) {
			dispatch(showNotification('Password should consists of minimum 8 characters!', 'error'));
			return;
		}
		if (registrationForm.password !== registrationForm.passwordConfirmation) {
			dispatch(showNotification('Password confirmation does not match your password. Please check again!', 'error'));
			return;
		}
		try {
			dispatch(showLoading());
			const response: any = await register(
				registrationForm.givenName,
				registrationForm.maidenName,
				registrationForm.emailAddress,
				registrationForm.password,
				registrationForm.passwordConfirmation
			);
			dispatch(showNotification(response.message, 'success'));
			history.push('/');
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
					Register myCashier
				</Typography>
				<form className={classes.form} noValidate>
					<Grid container spacing={2}>
						<Grid item xs={12} sm={6}>
							<TextField
								autoComplete="fname"
								name="givenName"
								variant="outlined"
								required
								fullWidth
								id="givenName"
								label="Given Name"
								autoFocus
								disabled={isLoading}
								onChange={onFormChange}
							/>
						</Grid>
						<Grid item xs={12} sm={6}>
							<TextField
								autoComplete="lname"
								name="maidenName"
								variant="outlined"
								required
								fullWidth
								id="maidenName"
								label="Maiden Name"
								disabled={isLoading}
								onChange={onFormChange}
							/>
						</Grid>
						<Grid item xs={12}>
							<TextField
								variant="outlined"
								required
								fullWidth
								id="emailAddress"
								label="Email Address"
								name="emailAddress"
								autoComplete="email"
								disabled={isLoading}
								onChange={onFormChange}
							/>
						</Grid>
						<Grid item xs={12}>
							<Typography component="p">
								Double check your email address. We will sent an activation email to this address.
							</Typography>
						</Grid>
						<Grid item xs={12}>
							<TextField
								variant="outlined"
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
						</Grid>
						<Grid item xs={12}>
							<TextField
								variant="outlined"
								required
								fullWidth
								name="passwordConfirmation"
								label="Confirm Password"
								type="password"
								id="passwordConfirmation"
								autoComplete="off"
								disabled={isLoading}
								onChange={onFormChange}
							/>
						</Grid>
					</Grid>
					<div className={classes.wrapper}>
						<Button
							fullWidth
							variant="contained"
							color="primary"
							className={classes.submit}
							disabled={isLoading}
							onClick={doRegister}
						>
							Register
						</Button>
						{isLoading && <CircularProgress size={24} className={classes.buttonProgress} />}
					</div>
					<Grid container justify="flex-end">
						<Grid item>
							{'Already have an account? '}
							<Link href="/sign-in" variant="body2">
								Sign in
							</Link>
						</Grid>
					</Grid>
				</form>
			</div>
			<Box mt={5}>
				<Copyright />
			</Box>
		</Container>
	);
};

Register.propTypes = {
	className: PropTypes.string,
};

export default Register;
