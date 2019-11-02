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

/* Import Dependencies */
import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter, Redirect, Route, Switch } from 'react-router-dom';
import {Provider, useDispatch, useSelector} from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import Button from '@material-ui/core/Button';
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import Modal from '@material-ui/core/Modal';
import Fade from "@material-ui/core/Fade";
import Typography from "@material-ui/core/Typography";
import makeStyles from "@material-ui/core/styles/makeStyles";
/* Import Internal Module */
import { persistor, store } from './store';
import { State } from './reducers';
import * as serviceWorker from './serviceWorker';
/* Import Components and Assets */
import SignIn from './views/SignIn';
import App from "./views/App";
import ForgetPassword from "./views/ForgetPassword";
import Register from "./views/Register";
import Activate from "./views/Activate";
import Recover from "./views/Recover";
import Snackbar from './components/Snackbar';
import './index.scss';
import {deAuthenticate, hideLoading, hideSignOutModal, showLoading, showNotification} from "./actions";
import { signOut} from "./services/AuthenticationAPI";

const useStyles = makeStyles(theme => ({
	modal: {
		display: 'flex',
		alignItems: 'center',
		justifyContent: 'center',
	},
	card: {
		width: '60vw',
	},
	cardActions: {
		float: 'right',
	},
	button: {
		margin: theme.spacing(1),
	},
}));

const RootComponent: React.FC = () => {
	const classes = useStyles();

	const isAuthenticated = useSelector((state: State) => state.root.isAuthenticated);
	const isSigningOut = useSelector((state: State) => state.root.isSigningOut);
	const dispatch = useDispatch();

	const doSignOut: React.MouseEventHandler = async (event) => {
		event.preventDefault();
		try {
			dispatch(hideSignOutModal());
			dispatch(showLoading());
			const response: any = await signOut();
			dispatch(showNotification(response.message));
			dispatch(deAuthenticate());
		} catch (error) {
			dispatch(showNotification(error.message, 'error'));
		} finally {
			dispatch(hideLoading());
		}
	};

	return (
		<div className="root">
			<BrowserRouter>
				<Switch>
					<Route exact path="/">
						<Redirect to="/app" />
					</Route>
					<Route path="/app">
						{
							isAuthenticated
								? <App />
								: <Redirect to="/sign-in" />
						}
					</Route>
					<Route path="/forget-password">
						{
							isAuthenticated
								? <Redirect to="/app" />
								: <ForgetPassword />
						}
					</Route>
					<Route path="/register">
						{
							isAuthenticated
								? <Redirect to="/app" />
								: <Register />
						}
					</Route>
					<Route path="/sign-in">
						{
							isAuthenticated
								? <Redirect to="/app" />
								: <SignIn />
						}
					</Route>
					<Route path="/activate">
						{/*
						  // @ts-ignore */}
						<Activate onSignOut={doSignOut} />
					</Route>
					<Route path="/recover">
						{/*
						  // @ts-ignore */}
						<Recover onSignOut={doSignOut} />
					</Route>
					<Route path="*">
						<Redirect to="/" />
					</Route>
				</Switch>
			</BrowserRouter>
			<Snackbar />
			<Modal
				aria-labelledby="modal-sign-out"
				aria-describedby="modal-sign-out"
				className={classes.modal}
				open={isSigningOut}
				onClose={() => {
					dispatch(hideSignOutModal());
				}}
				closeAfterTransition
				BackdropProps={{
					timeout: 500,
				}}
			>
				<Fade in={isSigningOut}>
					<Card className={classes.card}>
						<CardContent>
							<Typography gutterBottom variant="h5" component="h2">
								Sign Out
							</Typography>
							<Typography variant="body2" color="textSecondary" component="p">
								Are you sure you would like to sign out?
							</Typography>
						</CardContent>
						<CardActions className={classes.cardActions}>
							<Button
								className={classes.button}
								onClick={() => {
									dispatch(hideSignOutModal());
								}}
							>
								Cancel
							</Button>
							<Button
								variant="contained"
								color="primary"
								className={classes.button}
								onClick={doSignOut}
							>
								Sign Out
							</Button>
						</CardActions>
					</Card>
				</Fade>
			</Modal>
		</div>
	);
};

ReactDOM.render(
	<Provider store={ store }>
		<PersistGate persistor={ persistor }>
			<RootComponent />
		</PersistGate>
	</Provider>,
	document.getElementById('root')
);

serviceWorker.register();
