
import React from 'react';
import PropTypes from 'prop-types';
import Container from "@material-ui/core/Container";
import {makeStyles} from "@material-ui/core";

const useStyles = makeStyles(theme => ({
	container: {
		paddingTop: theme.spacing(4),
		paddingBottom: theme.spacing(4),
	}
}));

function RevenueReport(props) {
	const classes = useStyles();
	return (
		<Container maxWidth="lg" className={classes.container}>
			Revenue Report is not available at the moment.
		</Container>
	);
}

RevenueReport.propTypes = {
	className: PropTypes.string,
	showNotification: PropTypes.func.isRequired,
	loading: PropTypes.bool.isRequired,
	setLoading: PropTypes.func.isRequired,
	token: PropTypes.string.isRequired
};

export default RevenueReport;
