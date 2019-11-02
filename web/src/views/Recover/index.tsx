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
import * as QueryString from 'query-string';
import Button from '@material-ui/core/Button';
import CssBaseline from '@material-ui/core/CssBaseline';
import TextField from '@material-ui/core/TextField';
import Grid from '@material-ui/core/Grid';
import Box from '@material-ui/core/Box';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';
// internal components
import Copyright from "../../components/Copyright";
import PropTypes from "prop-types";
import {recover} from "../../services/AuthenticationAPI";
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

const Recover: React.FC = (props: any) => {
	const classes = useStyles();
	const query = QueryString.parse(window.location.search);
	const [recoverForm, setRecoverForm] = React.useState({
		emailAddress: (query.email_address as string) || '',
		token: (query.token as string) || '',
		password: '',
		passwordConfirmation: '',
	});

	const isLoading = useSelector((state: State) => state.root.isLoading);
	const dispatch = useDispatch();
	const history = useHistory();

	const onFormChange: React.ChangeEventHandler = (event) => {
		const { name, value } = event.target as any;
		const form = recoverForm;
		(form as any)[name] = value;
		setRecoverForm(form);
	};

	const doRecover: React.MouseEventHandler = async (event) => {
		event.preventDefault();
		if (recoverForm.password === '') {
			dispatch(showNotification('Password cannot be empty!', 'error'));
			return;
		}
		if (recoverForm.passwordConfirmation === '') {
			dispatch(showNotification('Password confirmation cannot be empty!', 'error'));
			return;
		}
		if (recoverForm.password !== recoverForm.passwordConfirmation) {
			dispatch(showNotification('Password confirmation does not match your password. Please check again!', 'error'));
			return;
		}
		if (recoverForm.password.length < 8) {
			dispatch(showNotification('Password should consists of minimum 8 characters!', 'error'));
			return;
		}
		try {
			dispatch(showLoading());
			const response: any = await recover(
				recoverForm.emailAddress,
				recoverForm.token,
				recoverForm.password,
				recoverForm.passwordConfirmation
			);
			dispatch(showNotification(response.message, 'success'));
			props.onSignOut(event);
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
					Recover Password
				</Typography>
				<form className={classes.form} noValidate>
					<Grid container spacing={2}>
						<Grid item xs={12}>
							<TextField
								variant="outlined"
								required
								fullWidth
								id="emailAddress"
								label="Email Address"
								name="emailAddress"
								autoComplete="email"
								disabled={true}
								value={recoverForm.emailAddress}
							/>
						</Grid>
						<Grid item xs={12}>
							<Typography component="p">
								Please set your new password here.
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
							onClick={doRecover}
						>
							Change Password
						</Button>
						{isLoading && <CircularProgress size={24} className={classes.buttonProgress} />}
					</div>
				</form>
			</div>
			<Box mt={5}>
				<Copyright />
			</Box>
		</Container>
	);
};

Recover.propTypes = {
	className: PropTypes.string
};

export default Recover;
