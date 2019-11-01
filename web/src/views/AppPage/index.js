
import React from 'react';
import { Switch, Route, Redirect, withRouter } from 'react-router-dom';
import PropTypes from 'prop-types';
import clsx from 'clsx';
import { makeStyles } from '@material-ui/core/styles';
import CssBaseline from '@material-ui/core/CssBaseline';
import Drawer from '@material-ui/core/Drawer';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import List from '@material-ui/core/List';
import Typography from '@material-ui/core/Typography';
import Divider from '@material-ui/core/Divider';
import IconButton from '@material-ui/core/IconButton';
import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import MenuIcon from '@material-ui/icons/Menu';
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft';
import ExitToAppIcon from '@material-ui/icons/ExitToApp';
import ListItem from "@material-ui/core/ListItem";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import ShoppingCartIcon from '@material-ui/icons/ShoppingCart';
import CategoryIcon from '@material-ui/icons/Category';
import FastfoodIcon from '@material-ui/icons/Fastfood';
import AssignmentIcon from '@material-ui/icons/Assignment';
import ListItemText from "@material-ui/core/ListItemText";
import ListSubheader from "@material-ui/core/ListSubheader";
import Chart from './Chart';
import Deposits from './Deposits';
import Orders from './Orders';
import Copyright from "../../components/Copyright";
import Transaction from './Transaction';
import ManageCategories from './ManageCategories';
import ManageProducts from './ManageProducts';
import RevenueReport from './RevenueReport';

const drawerWidth = 240;

const useStyles = makeStyles(theme => ({
	root: {
		display: 'flex',
	},
	toolbar: {
		paddingRight: 24, // keep right padding when drawer closed
	},
	toolbarIcon: {
		display: 'flex',
		alignItems: 'center',
		justifyContent: 'flex-end',
		padding: '0 8px',
		...theme.mixins.toolbar,
	},
	appBar: {
		zIndex: theme.zIndex.drawer + 1,
		transition: theme.transitions.create(['width', 'margin'], {
			easing: theme.transitions.easing.sharp,
			duration: theme.transitions.duration.leavingScreen,
		}),
	},
	appBarShift: {
		marginLeft: drawerWidth,
		width: `calc(100% - ${drawerWidth}px)`,
		transition: theme.transitions.create(['width', 'margin'], {
			easing: theme.transitions.easing.sharp,
			duration: theme.transitions.duration.enteringScreen,
		}),
	},
	menuButton: {
		marginRight: 36,
	},
	menuButtonHidden: {
		display: 'none',
	},
	title: {
		flexGrow: 1,
	},
	drawerPaper: {
		position: 'relative',
		whiteSpace: 'nowrap',
		width: drawerWidth,
		transition: theme.transitions.create('width', {
			easing: theme.transitions.easing.sharp,
			duration: theme.transitions.duration.enteringScreen,
		}),
	},
	drawerPaperClose: {
		overflowX: 'hidden',
		transition: theme.transitions.create('width', {
			easing: theme.transitions.easing.sharp,
			duration: theme.transitions.duration.leavingScreen,
		}),
		width: theme.spacing(7),
		[theme.breakpoints.up('sm')]: {
			width: theme.spacing(9),
		},
	},
	appBarSpacer: theme.mixins.toolbar,
	content: {
		flexGrow: 1,
		height: '100vh',
		overflow: 'auto',
	},
	container: {
		paddingTop: theme.spacing(4),
		paddingBottom: theme.spacing(4),
	},
	paper: {
		padding: theme.spacing(2),
		display: 'flex',
		overflow: 'auto',
		flexDirection: 'column',
	},
	fixedHeight: {
		height: 240,
	},
}));

function AppPage(props) {
	const classes = useStyles();
	const [open, setOpen] = React.useState(false);
	const handleDrawerOpen = () => {
		setOpen(true);
	};
	const handleDrawerClose = () => {
		setOpen(false);
	};
	const fixedHeightPaper = clsx(classes.paper, classes.fixedHeight);

	return (
		<div className={classes.root}>
			<CssBaseline />
			<AppBar position="absolute" className={clsx(classes.appBar, open && classes.appBarShift)}>
				<Toolbar className={classes.toolbar}>
					<IconButton
						edge="start"
						color="inherit"
						aria-label="open drawer"
						onClick={handleDrawerOpen}
						className={clsx(classes.menuButton, open && classes.menuButtonHidden)}
					>
						<MenuIcon />
					</IconButton>
					<Typography component="h1" variant="h6" color="inherit" noWrap className={classes.title}>
						MyCashier
					</Typography>
					<Button
						onClick={() => {props.onSignOut()}} color="inherit"
						startIcon={<ExitToAppIcon />}
					>
						Sign Out
					</Button>
				</Toolbar>
			</AppBar>
			<Drawer
				variant="permanent"
				classes={{
					paper: clsx(classes.drawerPaper, !open && classes.drawerPaperClose),
				}}
				open={open}
			>
				<div className={classes.toolbarIcon}>
					<IconButton onClick={handleDrawerClose}>
						<ChevronLeftIcon />
					</IconButton>
				</div>
				<Divider />
				<List>
					<ListItem button onClick={() => { props.history.push('/app/transaction') }}>
						<ListItemIcon>
							<ShoppingCartIcon />
						</ListItemIcon>
						<ListItemText primary="Transaction" />
					</ListItem>
					<ListItem button onClick={() => { props.history.push('/app/categories') }}>
						<ListItemIcon>
							<CategoryIcon />
						</ListItemIcon>
						<ListItemText primary="Manage Categories" />
					</ListItem>
					<ListItem button onClick={() => { props.history.push('/app/products') }}>
						<ListItemIcon>
							<FastfoodIcon />
						</ListItemIcon>
						<ListItemText primary="Manage Products" />
					</ListItem>
				</List>
				<Divider />
				<List>
					<ListSubheader inset>Reporting System</ListSubheader>
					<ListItem button onClick={() => { props.history.push('/app/report') }}>
						<ListItemIcon>
							<AssignmentIcon />
						</ListItemIcon>
						<ListItemText primary="Revenue Report" />
					</ListItem>
				</List>
			</Drawer>
			<main className={classes.content}>
				<div className={classes.appBarSpacer} />
				<Switch>
					<Route exact path={'/app'}>
						<Redirect to={'/app/transaction'} />
					</Route>
					<Route path={'/app/transaction'}>
						<Transaction
							showNotification={props.showNotification}
							loading={props.loading}
							setLoading={props.setLoading}
							onSignOut={props.onSignOut}
							token={props.token}
						/>
					</Route>
					<Route path={'/app/categories'}>
						<ManageCategories
							showNotification={props.showNotification}
							loading={props.loading}
							setLoading={props.setLoading}
							token={props.token}
						/>
					</Route>
					<Route path={'/app/products'}>
						<ManageProducts
							showNotification={props.showNotification}
							loading={props.loading}
							setLoading={props.setLoading}
							token={props.token}
						/>
					</Route>
					<Route path={'/app/report'}>
						<RevenueReport
							showNotification={props.showNotification}
							loading={props.loading}
							setLoading={props.setLoading}
							token={props.token}
						/>
					</Route>
					<Route path={'/app/old'}>
						<Grid container spacing={3}>
							{/* Chart */}
							<Grid item xs={12} md={8} lg={9}>
								<Paper className={fixedHeightPaper}>
									<Chart />
								</Paper>
							</Grid>
							{/* Recent Deposits */}
							<Grid item xs={12} md={4} lg={3}>
								<Paper className={fixedHeightPaper}>
									<Deposits />
								</Paper>
							</Grid>
							{/* Recent Orders */}
							<Grid item xs={12}>
								<Paper className={classes.paper}>
									<Orders />
								</Paper>
							</Grid>
						</Grid>
					</Route>
					<Route path={'/app/*'}>
						<Redirect to={'/app'} />
					</Route>
				</Switch>
				<Copyright />
			</main>
		</div>
	)

}

AppPage.propTypes = {
	className: PropTypes.string,
	showNotification: PropTypes.func.isRequired,
	loading: PropTypes.bool.isRequired,
	setLoading: PropTypes.func.isRequired,
	onSignOut: PropTypes.func.isRequired,
	token: PropTypes.string.isRequired
};

export default withRouter(AppPage);
