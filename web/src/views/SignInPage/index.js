
// component library
import React from 'react';
import Avatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';
import CssBaseline from '@material-ui/core/CssBaseline';
import TextField from '@material-ui/core/TextField';
import Link from '@material-ui/core/Link';
import Paper from '@material-ui/core/Paper';
import Box from '@material-ui/core/Box';
import Grid from '@material-ui/core/Grid';
import LockOutlinedIcon from '@material-ui/icons/LockOutlined';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
// internal components
import Copyright from "../../components/Copyright";
import PropTypes from "prop-types";
import {signIn} from "../../services/AuthenticationAPI";
import {CircularProgress} from "@material-ui/core";
import {green} from "@material-ui/core/colors";

const useStyles = makeStyles(theme => ({
	root: {
		height: '100vh',
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
	image: {
		backgroundImage: 'url(https://source.unsplash.com/random)',
		backgroundRepeat: 'no-repeat',
		backgroundSize: 'cover',
		backgroundPosition: 'center',
	},
	paper: {
		margin: theme.spacing(8, 4),
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
		marginTop: theme.spacing(1),
	},
}));

function SignInPage(props) {
	const classes = useStyles();

	const [signInForm, setSignInForm] = React.useState({
		emailAddress: '',
		password: '',
	});

	function onSignInFormChange({ target }) {
		const { name, value } = target;
		const form = signInForm;
		form[name] = value;
		setSignInForm(form);
	}

	async function doSignIn(event) {
		event.preventDefault();
		if (signInForm.emailAddress === '') {
			props.showNotification('Email address cannot be empty!', 'error');
			return;
		}
		if (signInForm.password === '') {
			props.showNotification('Password cannot be empty!', 'error');
			return;
		}
		try {
			props.setLoading(true);
			const response = await signIn(signInForm.emailAddress, signInForm.password);
			await props.validateAuth(response);
		} catch (error) {
			props.showNotification(error.message, 'error');
		} finally {
			props.setLoading(false);
		}
	}

	return (
		<Grid container component="main" className={classes.root}>
			<CssBaseline />
			<Grid item xs={false} sm={4} md={7} className={classes.image} />
			<Grid item xs={12} sm={8} md={5} component={Paper} elevation={6} square>
				<div className={classes.paper}>
					<Avatar className={classes.avatar}>
						<LockOutlinedIcon />
					</Avatar>
					<Typography component="h1" variant="h5">
						MyCashier
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
							disabled={props.loading}
							onChange={onSignInFormChange}
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
							disabled={props.loading}
							onChange={onSignInFormChange}
						/>
						<div className={classes.wrapper}>
							<Button
								type="submit"
								fullWidth
								variant="contained"
								color="primary"
								className={classes.submit}
								disabled={props.loading}
								onClick={doSignIn}
							>
								Sign In
							</Button>
							{props.loading && <CircularProgress size={24} className={classes.buttonProgress} />}
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
			</Grid>
		</Grid>
	);
}

SignInPage.propTypes = {
	className: PropTypes.string,
	showNotification: PropTypes.func.isRequired,
	loading: PropTypes.bool.isRequired,
	setLoading: PropTypes.func.isRequired,
	validateAuth: PropTypes.func.isRequired,
};

export default SignInPage;
