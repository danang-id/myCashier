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
import { useDispatch, useSelector } from 'react-redux';
import PropTypes from 'prop-types';
import clsx from 'clsx';
import CheckCircleIcon from '@material-ui/icons/CheckCircle';
import ErrorIcon from '@material-ui/icons/Error';
import InfoIcon from '@material-ui/icons/Info';
import CloseIcon from '@material-ui/icons/Close';
import { amber, green } from '@material-ui/core/colors';
import IconButton from '@material-ui/core/IconButton';
import MaterialSnackBar from '@material-ui/core/Snackbar';
import SnackbarContent from '@material-ui/core/SnackbarContent';
import WarningIcon from '@material-ui/icons/Warning';
import { makeStyles } from '@material-ui/core/styles';
import { hideNotification } from '../../actions';
import {State} from "../../reducers";

const variantIcon = {
	success: CheckCircleIcon,
	warning: WarningIcon,
	error: ErrorIcon,
	info: InfoIcon,
};

const useStyle = makeStyles(theme => ({
	success: {
		backgroundColor: green[600],
	},
	error: {
		backgroundColor: theme.palette.error.dark,
	},
	info: {
		backgroundColor: theme.palette.primary.main,
	},
	warning: {
		backgroundColor: amber[700],
	},
	icon: {
		fontSize: 20,
	},
	iconVariant: {
		opacity: 0.9,
		marginRight: theme.spacing(1),
	},
	message: {
		display: 'flex',
		alignItems: 'center',
	},
}));

const Snackbar: React.FC = (props: any) => {
	const classes: any = useStyle();
	const { className, autoHideDuration, ...other } = props;
	const dispatch = useDispatch();
	const open = useSelector((state: State) => state.root.notification !== null);
	const message = useSelector((state: State) => open ? state.root.notification.message : '');
	const variant = useSelector((state: State) => open ? state.root.notification.type : 'info');
	const Icon = (variantIcon as any)[variant];

	const handleClose = (event: any) => {
		event.preventDefault();
		dispatch(hideNotification());
	};

	return (
		<MaterialSnackBar
			className={className}
			anchorOrigin={{
				vertical: 'top',
				horizontal: 'right',
			}}
			open={open}
			autoHideDuration={autoHideDuration}
			onClose={handleClose}
			{...other}
		>
			<SnackbarContent
				className={clsx(classes[variant])}
				aria-describedby="client-snackbar"
				message={
					<span id="client-snackbar" className={classes.message}>
                        <Icon className={clsx(classes.icon, classes.iconVariant)} />
						{message}
                    </span>
				}
				action={[
					<IconButton key="close" aria-label="close" color="inherit" onClick={handleClose}>
						<CloseIcon className={classes.icon} />
					</IconButton>,
				]}
			/>
		</MaterialSnackBar>
	);
};

Snackbar.propTypes = {
	className: PropTypes.string,
	autoHideDuration: PropTypes.number
};

export default Snackbar;
