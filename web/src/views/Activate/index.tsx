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
import { useHistory } from 'react-router';
import {useDispatch, useSelector} from 'react-redux';
import * as QueryString from 'query-string';
import { CircularProgress } from '@material-ui/core';
import { green } from '@material-ui/core/colors';
import Button from '@material-ui/core/Button';
import CssBaseline from '@material-ui/core/CssBaseline';
import TextField from '@material-ui/core/TextField';
import Grid from '@material-ui/core/Grid';
import Box from '@material-ui/core/Box';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';
// internal components
import Copyright from '../../components/Copyright';
import PropTypes from 'prop-types';
import { activate } from '../../services/AuthenticationAPI';
import {hideLoading, showLoading, showNotification} from "../../actions";
import {State} from "../../reducers";
import Logo from '../../assets/myCashier.png'

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

const Activate: React.FC = (props: any) => {
	const classes = useStyles();
	const query = QueryString.parse(window.location.search);
	const [ activateForm ] = React.useState({
		emailAddress: (query.email_address as string) || '',
		token: (query.token as string) || ''
	});
	const isLoading = useSelector((state: State) => state.root.isLoading);
	const dispatch = useDispatch();
	const history = useHistory();

	const doActivate: React.MouseEventHandler = async (event) => {
		event.preventDefault();
		try {
			dispatch(showLoading());
			const response: any = await activate(
				activateForm.emailAddress,
				activateForm.token
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
					Activate Account
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
								value={activateForm.emailAddress}
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
							onClick={doActivate}
						>
							Activate
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

Activate.propTypes = {
	className: PropTypes.string
};

export default Activate;
