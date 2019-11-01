import Typography from "@material-ui/core/Typography";
import Link from "@material-ui/core/Link";
import React from "react";

export default function Copyright() {
	return (
		<Typography style={{ marginTop: '10px', marginBottom: '30px' }} variant="body2" color="textSecondary" align="center">
			{'© ' + new Date().getFullYear() + ' '}
			<Link color="inherit" href="https:/github.com/danang-id">
				Danang Galuh Tegar Prasetyo
			</Link>{'.'}
		</Typography>
	);
}
