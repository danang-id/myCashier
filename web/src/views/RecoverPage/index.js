
// component library
import React from 'react';
import { withRouter } from "react-router-dom";
import * as QueryString from 'query-string';
import Avatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';
import CssBaseline from '@material-ui/core/CssBaseline';
import TextField from '@material-ui/core/TextField';
import Grid from '@material-ui/core/Grid';
import Box from '@material-ui/core/Box';
import LockOutlinedIcon from '@material-ui/icons/LockOutlined';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';
// internal components
import Copyright from "../../components/Copyright";
import PropTypes from "prop-types";
import {recover} from "../../services/AuthenticationAPI";
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

function RecoverPage(props) {
	const classes = useStyles();
	const query = QueryString.parse(window.location.search);
	const [recoverForm, setRecoverForm] = React.useState({
		emailAddress: query.email_address,
		token: query.token,
		password: '',
		passwordConfirmation: '',
	});

	function onRecoverFormChange({ target }) {
		const { name, value } = target;
		const form = recoverForm;
		form[name] = value;
		setRecoverForm(form);
	}

	async function doRecover(event) {
		event.preventDefault();
		if (recoverForm.password === '') {
			props.showNotification('Password cannot be empty!', 'error');
			return;
		}
		if (recoverForm.passwordConfirmation === '') {
			props.showNotification('Password confirmation cannot be empty!', 'error');
			return;
		}
		if (recoverForm.password !== recoverForm.passwordConfirmation) {
			props.showNotification('Password confirmation does not match your password. Please check again!', 'error');
			return;
		}
		try {
			props.setLoading(true);
			const response = await recover(
				recoverForm.emailAddress,
				recoverForm.token,
				recoverForm.password,
				recoverForm.passwordConfirmation
			);
			props.showNotification(response.message, 'success');
			props.onSignOut(true);
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
								disabled={props.loading}
								onChange={onRecoverFormChange}
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
								onChange={onRecoverFormChange}
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
							onClick={doRecover}
						>
							Change Password
						</Button>
						{props.loading && <CircularProgress size={24} className={classes.buttonProgress} />}
					</div>
				</form>
			</div>
			<Box mt={5}>
				<Copyright />
			</Box>
		</Container>
	);
}

RecoverPage.propTypes = {
	className: PropTypes.string,
	showNotification: PropTypes.func.isRequired,
	loading: PropTypes.bool.isRequired,
	setLoading: PropTypes.func.isRequired,
	onSignOut: PropTypes.func.isRequired,
};

export default withRouter(RecoverPage)
