
import React from 'react';
import PropTypes from 'prop-types';
import clsx from "clsx";
import {CircularProgress, makeStyles} from "@material-ui/core";
import {lighten} from "@material-ui/core/styles";
import Container from "@material-ui/core/Container";
import Grid from "@material-ui/core/Grid";
import Paper from "@material-ui/core/Paper";
import Table from "@material-ui/core/Table";
import TablePagination from "@material-ui/core/TablePagination";
import TableHead from "@material-ui/core/TableHead";
import TableBody from "@material-ui/core/TableBody";
import TableRow from "@material-ui/core/TableRow";
import TableCell from "@material-ui/core/TableCell";
import TableSortLabel from "@material-ui/core/TableSortLabel";
import Toolbar from "@material-ui/core/Toolbar";
import Typography from "@material-ui/core/Typography";
import IconButton from "@material-ui/core/IconButton";
import Modal from "@material-ui/core/Modal";
import Fade from "@material-ui/core/Fade";
import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import CardActions from "@material-ui/core/CardActions";
import Button from "@material-ui/core/Button";
import AddCircleOutlineIcon from "@material-ui/icons/AddCircleOutline";
import EditIcon from "@material-ui/icons/Edit";
import DeleteIcon from "@material-ui/icons/Delete";
import {getCategories,createCategory,modifyCategory,deleteCategory} from "../../../services/CategoryAPI";
import TextField from "@material-ui/core/TextField";
import {green} from "@material-ui/core/colors";

function desc(a, b, orderBy) {
	if (b[orderBy] < a[orderBy]) {
		return -1;
	}
	if (b[orderBy] > a[orderBy]) {
		return 1;
	}
	return 0;
}

function stableSort(array, cmp) {
	const stabilizedThis = array.map((el, index) => [el, index]);
	stabilizedThis.sort((a, b) => {
		const order = cmp(a[0], b[0]);
		if (order !== 0) return order;
		return a[1] - b[1];
	});
	return stabilizedThis.map(el => el[0]);
}

function getSorting(order, orderBy) {
	return order === 'desc' ? (a, b) => desc(a, b, orderBy) : (a, b) => -desc(a, b, orderBy);
}

function EnhancedTableHead(props) {
	const { classes, order, orderBy, onRequestSort, headCells } = props;
	const createSortHandler = property => event => {
		onRequestSort(event, property);
	};

	return (
		<TableHead>
			<TableRow>
				{headCells.map(headCell => (
					<TableCell
						key={headCell.id}
						align={headCell.numeric ? 'right' : 'left'}
						padding={headCell.disablePadding ? 'none' : 'default'}
						sortDirection={orderBy === headCell.id ? order : false}
					>
						<TableSortLabel
							active={orderBy === headCell.id}
							direction={order}
							onClick={createSortHandler(headCell.id)}
						>
							{headCell.label}
							{orderBy === headCell.id ? (
								<span className={classes.visuallyHidden}>
                  {order === 'desc' ? 'sorted descending' : 'sorted ascending'}
                </span>
							) : null}
						</TableSortLabel>
					</TableCell>
				))}
			</TableRow>
		</TableHead>
	);
}

EnhancedTableHead.propTypes = {
	classes: PropTypes.object.isRequired,
	order: PropTypes.oneOf(['asc', 'desc']).isRequired,
	orderBy: PropTypes.string.isRequired,
	headCells: PropTypes.array.isRequired
};

const useToolbarStyles = makeStyles(theme => ({
	root: {
		paddingLeft: theme.spacing(2),
		paddingRight: theme.spacing(1),
	},
	highlight:
		theme.palette.type === 'light'
			? {
				color: theme.palette.secondary.main,
				backgroundColor: lighten(theme.palette.secondary.light, 0.85),
			}
			: {
				color: theme.palette.text.primary,
				backgroundColor: theme.palette.secondary.dark,
			},
	title: {
		flex: '1 1 100%',
	},
}));

const EnhancedTableToolbar = props => {
	const classes = useToolbarStyles();
	return (
		<Toolbar
			className={clsx(classes.root)}
		>
			<Typography className={classes.title} variant="h6" id="tableTitle">
				Category
			</Typography>
		</Toolbar>
	);
};

const useStyles = makeStyles(theme => ({
	root: {
		width: '100%',
		marginTop: theme.spacing(3),
	},
	table: {
		minWidth: 400,
	},
	tableWrapper: {
		overflowX: 'auto',
	},
	visuallyHidden: {
		border: 0,
		clip: 'rect(0 0 0 0)',
		height: 1,
		margin: -1,
		overflow: 'hidden',
		padding: 0,
		position: 'absolute',
		top: 20,
		width: 1,
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
		width: '100%',
		marginBottom: theme.spacing(2),
	},
	modal: {
		display: 'flex',
		alignItems: 'center',
		justifyContent: 'center',
	},
	card: {
		width: '60vw',
		padding: '15px'
	},
	cardActions: {
		float: 'right',
	},
	form: {
		width: '100%', // Fix IE 11 issue.
		marginTop: theme.spacing(1),
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

function ManageCategories(props) {
	const classes = useStyles();
	const [order, setOrder] = React.useState('asc');
	const [orderBy, setOrderBy] = React.useState('calories');
	const [selectedIndex, setSelectedIndex] = React.useState(null);
	const [page, setPage] = React.useState(0);
	const [rowsPerPage, setRowsPerPage] = React.useState(5);

	const [createModalOpen, setCreateModalOpen] = React.useState(false);
	const [modifyModalOpen, setModifyModalOpen] = React.useState(false);
	const [deleteModalOpen, setDeleteModalOpen] = React.useState(false);
	const [categories, setCategories] = React.useState([]);
	const [selectedCategory, setSelectedCategory] = React.useState({});
	const headCells = [
		{ id: 'name', numeric: false, disablePadding: false, label: 'Name' },
		{ id: 'description', numeric: false, disablePadding: false, label: 'Description' },
		{ id: 'action', numeric: false, disablePadding: false, label: 'Action' },
	];
	const doGetCategories = async () => {
		try {
			const response = await getCategories(props.token);
			setCategories(response.data);
		} catch (error) {
			props.showNotification(error.message, 'error');
		}
	};
	React.useEffect(() => {
		doGetCategories().then();
	});
	const handleFormChange = ({ target }) => {
		const { name, value } = target;
		const form = selectedCategory;
		form[name] = value;
		setSelectedCategory(form);
	};
	const handleCreate = (event) => {
		setSelectedCategory({
			_id: null,
			name: '',
			description: '',
		});
		setCreateModalOpen(true);
	};
	const handleModify = (event, index) => {
		setSelectedCategory(categories[index]);
		setModifyModalOpen(true);
	};
	const handleDelete = (event, index) => {
		setSelectedCategory(categories[index]);
		setDeleteModalOpen(true);
	};
	const closeCreateModal = () => {
		setCreateModalOpen(false);
		setSelectedCategory({});
	};
	const closeModifyModal = () => {
		setModifyModalOpen(false);
		setSelectedCategory({});
	};
	const closeDeleteModal = () => {
		setDeleteModalOpen(false);
		setSelectedCategory({});
	};

	const doCreateProduct = async (event) => {
		event.preventDefault();
		if (selectedCategory.name === '') {
			props.showNotification('Category name cannot be empty!', 'error');
			return;
		}
		if (selectedCategory.description === '') {
			props.showNotification('Category description cannot be empty!', 'error');
			return;
		}
		try {
			props.setLoading(true);
			await createCategory(
				props.token,
				selectedCategory.name,
				selectedCategory.description
			);
			await doGetCategories();
			closeCreateModal();
		} catch (error) {
			props.showNotification(error.message, 'error');
		} finally {
			props.setLoading(false);
		}
	};
	const doModifyProduct = async (event) => {
		event.preventDefault();
		if (!selectedCategory._id) {
			props.showNotification('Category identifier is not set!', 'error');
			return;
		}
		if (selectedCategory.name === '') {
			props.showNotification('Category name cannot be empty!', 'error');
			return;
		}
		if (selectedCategory.description === '') {
			props.showNotification('Category description cannot be empty!', 'error');
			return;
		}
		try {
			props.setLoading(true);
			await modifyCategory(
				props.token,
				selectedCategory._id,
				selectedCategory.name,
				selectedCategory.description
			);
			await doGetCategories();
			closeModifyModal();
		} catch (error) {
			props.showNotification(error.message, 'error');
		} finally {
			props.setLoading(false);
		}
	};
	const doDeleteProduct = async (event) => {
		event.preventDefault();
		if (!selectedCategory._id) {
			props.showNotification('Category identifier is not set!', 'error');
			return;
		}
		try {
			props.setLoading(true);
			await deleteCategory(props.token, selectedCategory._id);
			await doGetCategories();
			closeDeleteModal();
		} catch (error) {
			props.showNotification(error.message, 'error');
		} finally {
			props.setLoading(false);
		}
	};

	const handleRequestSort = (event, property) => {
		const isDesc = orderBy === property && order === 'desc';
		setOrder(isDesc ? 'asc' : 'desc');
		setOrderBy(property);
	};
	const handleClick = (event, index) => {
		setSelectedIndex(index);
	};
	const handlePageChange = (event, newPage) => {
		setPage(newPage);
	};
	const handleRowsPerPageChange = event => {
		setRowsPerPage(parseInt(event.target.value, 10));
		setPage(0);
	};
	const isSelected = index => selectedIndex === index;
	return (
		<Container maxWidth="lg" className={classes.container}>
			<Grid container spacing={3}>
				<Grid item>
					<Button
						variant="outlined"
						onClick={handleCreate}
						color="primary"
						startIcon={<AddCircleOutlineIcon />}
					>
						Create Category
					</Button>
				</Grid>
			</Grid>
			<Grid container spacing={3}>
				<Grid item xs={12}>
					<Paper className={classes.paper}>
						<EnhancedTableToolbar />
						<div className={classes.tableWrapper}>
							<Table
								className={classes.table}
								aria-labelledby="categoriesTable"
								size="medium"
								aria-label="Table Categories"
							>
								<EnhancedTableHead
									classes={classes}
									order={order}
									orderBy={orderBy}
									onRequestSort={handleRequestSort}
									headCells={headCells}
								/>
								<TableBody>
									{stableSort(categories, getSorting(order, orderBy))
										.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
										.map((row, index) => {
											const isItemSelected = isSelected(index);
											return (
												<TableRow
													hover
													onClick={event => handleClick(event, index)}
													aria-checked={isItemSelected}
													tabIndex={-1}
													key={index}
													selected={isItemSelected}
												>
													<TableCell>
														{row.name}
													</TableCell>
													<TableCell>
														{row.description}
													</TableCell>
													<TableCell align="center">
														<IconButton onClick={(event) => { handleModify(event, index) }}>
															<EditIcon />
														</IconButton>
														<IconButton onClick={(event) => { handleDelete(event, index) }}>
															<DeleteIcon />
														</IconButton>
													</TableCell>
												</TableRow>
											);
										})}
									{categories.length > 0 ? null : (
										<TableRow>
											<TableCell colSpan={6}>There is no category data at the moment.</TableCell>
										</TableRow>
									)}
								</TableBody>
							</Table>
						</div>
						<TablePagination
							rowsPerPageOptions={[5, 10, 25]}
							component="div"
							count={categories.length}
							rowsPerPage={rowsPerPage}
							page={page}
							backIconButtonProps={{
								'aria-label': 'previous page',
							}}
							nextIconButtonProps={{
								'aria-label': 'next page',
							}}
							onChangePage={handlePageChange}
							onChangeRowsPerPage={handleRowsPerPageChange}
						/>
					</Paper>
				</Grid>
			</Grid>
			<Modal
				aria-labelledby="modal-create"
				aria-describedby="modal-create"
				className={classes.modal}
				open={createModalOpen}
				onClose={closeCreateModal}
				closeAfterTransition
				BackdropProps={{
					timeout: 500,
				}}
			>
				<Fade in={createModalOpen}>
					<Card className={classes.card}>
						<CardContent>
							<Typography gutterBottom variant="h5" component="h2">
								Create Category
							</Typography>
							<form className={classes.form} noValidate>
								<Grid container spacing={2}>
									<Grid item xs={12}>
										<TextField
											variant="outlined"
											required
											fullWidth
											id="name"
											label="Name"
											name="name"
											defaultValue={selectedCategory.name}
											disabled={props.loading}
											onChange={handleFormChange}
										/>
									</Grid>
									<Grid item xs={12}>
										<TextField
											variant="outlined"
											required
											fullWidth
											multiline
											rows="2"
											rowsMax="4"
											id="description"
											label="Description"
											name="description"
											defaultValue={selectedCategory.description}
											disabled={props.loading}
											onChange={handleFormChange}
										/>
									</Grid>
								</Grid>
							</form>
						</CardContent>
						<CardActions className={classes.cardActions}>
							<div className={classes.wrapper}>
								<Button
									className={classes.button}
									onClick={closeCreateModal}
								>
									Cancel
								</Button>&nbsp;
								<Button
									variant="contained"
									color="secondary"
									className={classes.button}
									onClick={doCreateProduct}
								>
									Create
								</Button>
								{props.loading && <CircularProgress size={24} className={classes.buttonProgress} />}
							</div>
						</CardActions>
					</Card>
				</Fade>
			</Modal>
			<Modal
				aria-labelledby="modal-modify"
				aria-describedby="modal-modify"
				className={classes.modal}
				open={modifyModalOpen}
				onClose={closeModifyModal}
				closeAfterTransition
				BackdropProps={{
					timeout: 500,
				}}
			>
				<Fade in={modifyModalOpen}>
					<Card className={classes.card}>
						<CardContent>
							<Typography gutterBottom variant="h5" component="h2">
								Modify Category
							</Typography>
							<form className={classes.form} noValidate>
								<Grid container spacing={2}>
									<Grid item xs={12}>
										<TextField
											variant="outlined"
											required
											fullWidth
											id="name"
											label="Name"
											name="name"
											defaultValue={selectedCategory.name}
											disabled={props.loading}
											onChange={handleFormChange}
										/>
									</Grid>
									<Grid item xs={12}>
										<TextField
											variant="outlined"
											required
											fullWidth
											multiline
											rows="2"
											rowsMax="4"
											id="description"
											label="Description"
											name="description"
											defaultValue={selectedCategory.description}
											disabled={props.loading}
											onChange={handleFormChange}
										/>
									</Grid>
								</Grid>
							</form>
						</CardContent>
						<CardActions className={classes.cardActions}>
							<div className={classes.wrapper}>
								<Button
									className={classes.button}
									onClick={closeModifyModal}
								>
									Cancel
								</Button>&nbsp;
								<Button
									variant="contained"
									color="secondary"
									className={classes.button}
									onClick={doModifyProduct}
								>
									Save
								</Button>
								{props.loading && <CircularProgress size={24} className={classes.buttonProgress} />}
							</div>
						</CardActions>
					</Card>
				</Fade>
			</Modal>
			<Modal
				aria-labelledby="modal-delete"
				aria-describedby="modal-delete"
				className={classes.modal}
				open={deleteModalOpen}
				onClose={closeDeleteModal}
				closeAfterTransition
				BackdropProps={{
					timeout: 500,
				}}
			>
				<Fade in={deleteModalOpen}>
					<Card className={classes.card}>
						<CardContent>
							<Typography gutterBottom variant="h5" component="h2">
								Delete Category
							</Typography>
							<Typography variant="body2" color="textSecondary" component="p">
								Are you sure you would like to delete category { selectedCategory.name }?
							</Typography>
						</CardContent>
						<CardActions className={classes.cardActions}>
							<div className={classes.wrapper}>
								<Button
									className={classes.button}
									onClick={closeDeleteModal}
								>
									Cancel
								</Button>&nbsp;
								<Button
									variant="contained"
									color="secondary"
									className={classes.button}
									onClick={doDeleteProduct}
								>
									Delete
								</Button>
								{props.loading && <CircularProgress size={24} className={classes.buttonProgress} />}
							</div>
						</CardActions>
					</Card>
				</Fade>
			</Modal>
		</Container>
	);
}

ManageCategories.propTypes = {
	className: PropTypes.string,
	showNotification: PropTypes.func.isRequired,
	loading: PropTypes.bool.isRequired,
	setLoading: PropTypes.func.isRequired,
	token: PropTypes.string.isRequired
};

export default ManageCategories;
