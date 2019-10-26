
// component library
import React from 'react';
import { withRouter } from "react-router-dom";
import Avatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';
import CssBaseline from '@material-ui/core/CssBaseline';
import TextField from '@material-ui/core/TextField';
import Link from '@material-ui/core/Link';
import Grid from '@material-ui/core/Grid';
import Box from '@material-ui/core/Box';
import LockOutlinedIcon from '@material-ui/icons/LockOutlined';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';
// internal components
import Copyright from "../../components/Copyright";
import PropTypes from "prop-types";
import {register} from "../../services/AuthenticationAPI";
import {CircularProgress} from "@material-ui/core";
import {green} from "@material-ui/core/colors";

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
		margin: theme.spacing(1),
		backgroundColor: theme.palette.secondary.main,
	},
	form: {
		width: '100%', // Fix IE 11 issue.
		marginTop: theme.spacing(3),
	},
}));

function RegisterPage(props) {
	const classes = useStyles();

	const [registrationForm, setRegistrationForm] = React.useState({
		givenName: '',
		maidenName: '',
		emailAddress: '',
		password: '',
		passwordConfirmation: '',
	});

	function onRegistrationFormChange({ target }) {
		const { name, value } = target;
		const form = registrationForm;
		form[name] = value;
		setRegistrationForm(form);
	}

	async function doRegister(event) {
		event.preventDefault();
		if (registrationForm.givenName === '') {
			props.showNotification('Given name cannot be empty!', 'error');
			return;
		}
		if (registrationForm.maidenName === '') {
			props.showNotification('Maiden name cannot be empty!', 'error');
			return;
		}
		if (registrationForm.emailAddress === '') {
			props.showNotification('Email address cannot be empty!', 'error');
			return;
		}
		if (registrationForm.password === '') {
			props.showNotification('Password cannot be empty!', 'error');
			return;
		}
		if (registrationForm.passwordConfirmation === '') {
			props.showNotification('Password confirmation cannot be empty!', 'error');
			return;
		}
		const emailRegExp = new RegExp(
			/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
		);
		if (!emailRegExp.test(registrationForm.emailAddress)) {
			props.showNotification(registrationForm.emailAddress + ' is not a valid email address!', 'error');
			return;
		}
		if (registrationForm.password !== registrationForm.passwordConfirmation) {
			props.showNotification('Password confirmation does not match your password. Please check again!', 'error');
			return;
		}
		try {
			props.setLoading(true);
			const response = await register(
				registrationForm.givenName,
				registrationForm.maidenName,
				registrationForm.emailAddress,
				registrationForm.password,
				registrationForm.passwordConfirmation
			);
			props.showNotification(response.message, 'success');
			props.history.push('/');
		} catch (error) {
			props.showNotification(error.message, 'error');
		} finally {
			props.setLoading(false);
		}
	}

	return (
		<Container component="main" maxWidth="xs">
			<CssBaseline />
			<div className={classes.paper}>
				<Avatar className={classes.avatar}>
					<LockOutlinedIcon />
				</Avatar>
				<Typography component="h1" variant="h5">
					Register MyCashier
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
								disabled={props.loading}
								onChange={onRegistrationFormChange}
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
								disabled={props.loading}
								onChange={onRegistrationFormChange}
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
								disabled={props.loading}
								onChange={onRegistrationFormChange}
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
								disabled={props.loading}
								onChange={onRegistrationFormChange}
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
								disabled={props.loading}
								onChange={onRegistrationFormChange}
							/>
						</Grid>
					</Grid>
					<div className={classes.wrapper}>
						<Button
							fullWidth
							variant="contained"
							color="primary"
							className={classes.submit}
							disabled={props.loading}
							onClick={doRegister}
						>
							Register
						</Button>
						{props.loading && <CircularProgress size={24} className={classes.buttonProgress} />}
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
}

RegisterPage.propTypes = {
	className: PropTypes.string,
	showNotification: PropTypes.func.isRequired,
	loading: PropTypes.bool.isRequired,
	setLoading: PropTypes.func.isRequired
};

export default withRouter(RegisterPage)
