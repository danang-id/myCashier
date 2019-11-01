
// core libraries
import React from 'react';
import {
	BrowserRouter,
	Switch,
	Redirect,
	Route
} from "react-router-dom";
import { useCookies } from 'react-cookie';
import Button from '@material-ui/core/Button';
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import Modal from '@material-ui/core/Modal';
import Fade from "@material-ui/core/Fade";
import Typography from "@material-ui/core/Typography";
import makeStyles from "@material-ui/core/styles/makeStyles";
// internal components
import SnackBar from "./components/Snackbar";
import SignInPage from "./views/SignInPage";
import RegisterPage from "./views/RegisterPage";
import ForgetPasswordPage from "./views/ForgetPasswordPage";
import './App.css';
import RecoverPage from "./views/RecoverPage";
import ActivatePage from "./views/ActivatePage";
import AppPage from "./views/AppPage";
import {getCategories} from "./services/CategoryAPI";

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

function App(props) {
	const classes = useStyles();
	const [cookies, setCookie, removeCookie] = useCookies(['token','authenticated']);
	const [notification, setNotification] = React.useState({
		open: false,
		message: '',
		variant: 'info'
	});
	const [loading, setLoading] = React.useState(false);
	const [signOutModalOpen, setSignOutModalOpen] = React.useState(false);

	function isAuthenticated() {
		return cookies.authenticated === 'true';
	}

	function showNotification(message, variant = 'info') {
		setNotification({ open: true, message, variant });
	}

	function hideNotification(message, variant = 'info') {
		setNotification({ open: false, message: '', variant:     'info' });
	}

	function hideSignOutModal() {
		setSignOutModalOpen(false);
	}

	function onSignOut(force) {
		if (force === void 0) {
			force = false;
		}
		if (force) {
			doSignOut();
		} else if (isAuthenticated()) {
			setSignOutModalOpen(true);
		}
	}

	function doSignOut() {
		hideSignOutModal();
		removeCookie('authenticated',{ path: '/' });
		removeCookie('token',{ path: '/' });
	}

	async function validateAuth(response) {
		try {
			setCookie('token', response.token, { path: '/' });
			await getCategories(response.token);
			setCookie('authenticated', 'true', { path: '/' });
			showNotification(response.message, 'success');
		} catch (error) {
			if (error.response) {
				const { response } = error;
				if (response.code === 401 || response.code === 403) {
					doSignOut();
				}
			}
			showNotification(error.message, 'error');
		}
	}

	return (
		<BrowserRouter>
			<Switch>
				<Route exact path="/">
					{  isAuthenticated() ? <Redirect to={'/app'} /> : <Redirect to={'/sign-in'} /> }
				</Route>
				<Route path="/sign-in">
					{ isAuthenticated() ? <Redirect to={'/app'} /> : null }
					<SignInPage
						showNotification={showNotification.bind(this)}
						loading={loading}
						setLoading={setLoading}
						validateAuth={validateAuth.bind(this)}
					/>
				</Route>
				<Route path="/register">
					{ isAuthenticated() ? <Redirect to={'/app'} /> : null }
					<RegisterPage
						showNotification={showNotification.bind(this)}
						loading={loading}
						setLoading={setLoading}
					/>
				</Route>
				<Route path="/activate">
					<ActivatePage
						showNotification={showNotification.bind(this)}
						loading={loading}
						setLoading={setLoading}
						onSignOut={onSignOut}
					/>
				</Route>
				<Route path="/forget-password">
					<ForgetPasswordPage
						showNotification={showNotification.bind(this)}
						loading={loading}
						setLoading={setLoading}
					/>
				</Route>
				<Route path="/recover">
					<RecoverPage
						showNotification={showNotification.bind(this)}
						loading={loading}
						setLoading={setLoading}
						onSignOut={onSignOut.bind(this)}
					/>
				</Route>
				<Route path="/app">
					{ isAuthenticated() ? null : <Redirect to={'/sign-in'} /> }
					<AppPage
						showNotification={showNotification.bind(this)}
						loading={loading}
						setLoading={setLoading}
						onSignOut={onSignOut.bind(this)}
						token={cookies.token ? cookies.token : ''}
					/>
				</Route>
				<Route path="*">
					<Redirect to={'/'} />
				</Route>
			</Switch>
			<SnackBar
				message={notification.message}
				variant={notification.variant}
				open={notification.open}
				onClose={hideNotification}
			/>
			<Modal
				aria-labelledby="modal-sign-out"
				aria-describedby="modal-sign-out"
				className={classes.modal}
				open={signOutModalOpen}
				onClose={hideSignOutModal}
				closeAfterTransition
				BackdropProps={{
					timeout: 500,
				}}
			>
				<Fade in={signOutModalOpen}>
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
								onClick={hideSignOutModal}
							>
								Cancel
							</Button>
							<Button
								variant="contained"
								color="secondary"
								className={classes.button}
								onClick={doSignOut}
							>
								Sign Out
							</Button>
						</CardActions>
					</Card>
				</Fade>
			</Modal>
		</BrowserRouter>
	);
}

export default App;
