
// component library
import React from 'react';
import { withRouter } from 'react-router-dom';
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
import {green} from "@material-ui/core/colors";
import {CircularProgress} from "@material-ui/core";
import {forgetPassword} from "../../services/AuthenticationAPI";

const useStyles = makeStyles(theme => ({
	'@global': {
		body: {
			backgroundColor: theme.palette.common.white,
		},
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
}));

function ForgetPasswordPage(props) {
	const classes = useStyles();

	const [forgetPasswordForm, setForgetPasswordForm] = React.useState({
		emailAddress: ''
	});

	function onForgetPasswordFormChange({target}) {
		const { name, value } = target;
		const form = forgetPasswordForm;
		form[name] = value;
		setForgetPasswordForm(form);
	}

	async function doRecoverPassword(event) {
		event.preventDefault();
		if (forgetPasswordForm.emailAddress === '') {
			props.showNotification('Email address cannot be empty!', 'error');
			return;
		}
		const emailRegExp = new RegExp(
			/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
		);
		if (!emailRegExp.test(forgetPasswordForm.emailAddress)) {
			props.showNotification(forgetPasswordForm.emailAddress + ' is not a valid email address!', 'error');
			return;
		}
		try {
			props.setLoading(true);
			const response = await forgetPassword(forgetPasswordForm.emailAddress);
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
								disabled={props.loading}
								onChange={onForgetPasswordFormChange}
							/>
						</Grid>
					</Grid>
					<div className={classes.wrapper}>
						<Button
							type="submit"
							fullWidth
							variant="contained"
							color="primary"
							className={classes.submit}
							disabled={props.loading}
							onClick={doRecoverPassword}
						>
							Recover Password
						</Button>
						{props.loading && <CircularProgress size={24} className={classes.buttonProgress} />}
					</div>
					<Grid container justify="flex-end">
						<Grid item>
							{'Already remember your password? '}
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

ForgetPasswordPage.propTypes = {
	className: PropTypes.string,
	showNotification: PropTypes.func.isRequired,
	loading: PropTypes.bool.isRequired,
	setLoading: PropTypes.func.isRequired,
};

export default withRouter(ForgetPasswordPage);
