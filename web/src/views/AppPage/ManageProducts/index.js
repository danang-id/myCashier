
import React from 'react';
import PropTypes from 'prop-types';
import clsx from "clsx";
import NumberFormat from 'react-number-format';
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
import {getCategories} from "../../../services/CategoryAPI";
import {getProducts,createProduct,modifyProduct,deleteProduct} from "../../../services/ProductAPI";
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
				Products
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

function ManageProducts(props) {
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
	const [products, setProducts] = React.useState([]);
	const [selectedProduct, setSelectedProduct] = React.useState({});
	const headCells = [
		{ id: 'name', numeric: false, disablePadding: false, label: 'Name' },
		{ id: 'description', numeric: false, disablePadding: false, label: 'Description' },
		{ id: 'image', numeric: true, disablePadding: false, label: 'Image' },
		{ id: 'price', numeric: true, disablePadding: false, label: 'Price' },
		{ id: 'category', numeric: false, disablePadding: false, label: 'Category' },
		{ id: 'action', numeric: false, disablePadding: false, label: 'Action' },
	];
	const doGetProducts = async () => {
		try {
			const categoriesResponse = await getCategories(props.token);
			const productsResponse = await getProducts(props.token);
			setCategories(categoriesResponse.data);
			setProducts(productsResponse.data.map(p => {
				const category = categoriesResponse.data.find(c => c._id === p.category_id);
				p.category = category.name;
				return p;
			}));
		} catch (error) {
			props.showNotification(error.message, 'error');
		}
	};
	React.useEffect(() => {
		doGetProducts().then();
	}, [props.token, props]);
	const handleFormChange = ({ target }) => {
		const { name, value } = target;
		const form = selectedProduct;
		form[name] = value;
		setSelectedProduct(form);
	};
	const handleCreate = (event) => {
		setSelectedProduct({
			_id: null,
			name: '',
			description: '',
			image: '',
			price: 0,
			category_id: 0
		});
		setCreateModalOpen(true);
	};
	const handleModify = (event, index) => {
		setSelectedProduct(products[index]);
		setModifyModalOpen(true);
	};
	const handleDelete = (event, index) => {
		setSelectedProduct(products[index]);
		setDeleteModalOpen(true);
	};
	const closeCreateModal = () => {
		setCreateModalOpen(false);
		setSelectedProduct({});
	};
	const closeModifyModal = () => {
		setModifyModalOpen(false);
		setSelectedProduct({});
	};
	const closeDeleteModal = () => {
		setDeleteModalOpen(false);
		setSelectedProduct({});
	};

	const doCreateProduct = async (event) => {
		event.preventDefault();
		if (selectedProduct.name === '') {
			props.showNotification('Product name cannot be empty!', 'error');
			return;
		}
		if (selectedProduct.description === '') {
			props.showNotification('Product description cannot be empty!', 'error');
			return;
		}
		if (selectedProduct.image === '') {
			props.showNotification('Product image URL cannot be empty!', 'error');
			return;
		}
		if (parseInt(selectedProduct.price) <= 0) {
			props.showNotification('Product price cannot be zero or negative!', 'error');
			return;
		}
		if (selectedProduct.category_id === 0) {
			props.showNotification('Please select a category!', 'error');
			return;
		}

		try {
			props.setLoading(true);
			await createProduct(
				props.token,
				selectedProduct.name,
				selectedProduct.description,
				selectedProduct.image,
				parseInt(selectedProduct.price) ,
				selectedProduct.category_id
			);
			await doGetProducts();
			closeCreateModal();
		} catch (error) {
			props.showNotification(error.message, 'error');
		} finally {
			props.setLoading(false);
		}
	};
	const doModifyProduct = async (event) => {
		event.preventDefault();
		if (!selectedProduct._id) {
			props.showNotification('Product identifier is not set!', 'error');
			return;
		}
		if (selectedProduct.name === '') {
			props.showNotification('Product name cannot be empty!', 'error');
			return;
		}
		if (selectedProduct.description === '') {
			props.showNotification('Product description cannot be empty!', 'error');
			return;
		}
		if (selectedProduct.image === '') {
			props.showNotification('Product image URL cannot be empty!', 'error');
			return;
		}
		if (parseInt(selectedProduct.price)  <= 0) {
			props.showNotification('Product price cannot be zero or negative!', 'error');
			return;
		}
		if (selectedProduct.category_id === 0) {
			props.showNotification('Please select a category!', 'error');
			return;
		}

		try {
			props.setLoading(true);
			await modifyProduct(
				props.token,
				selectedProduct._id,
				selectedProduct.name,
				selectedProduct.description,
				selectedProduct.image,
				parseInt(selectedProduct.price),
				selectedProduct.category_id
			);
			await doGetProducts();
			closeModifyModal();
		} catch (error) {
			props.showNotification(error.message, 'error');
		} finally {
			props.setLoading(false);
		}
	};
	const doDeleteProduct = async (event) => {
		event.preventDefault();
		if (!selectedProduct._id) {
			props.showNotification('Product identifier is not set!', 'error');
			return;
		}

		try {
			props.setLoading(true);
			await deleteProduct(props.token, selectedProduct._id);
			await doGetProducts();
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
						Create Product
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
								aria-labelledby="productsTable"
								size="medium"
								aria-label="Table Products"
							>
								<EnhancedTableHead
									classes={classes}
									order={order}
									orderBy={orderBy}
									onRequestSort={handleRequestSort}
									headCells={headCells}
								/>
								<TableBody>
									{stableSort(products, getSorting(order, orderBy))
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
													<TableCell>
														<img alt={row.name} src={row.image} height={'50px'} width={'50px'} />
													</TableCell>
													<TableCell>
														<NumberFormat
															value={row.price}
															displayType={'text'}
															thousandSeparator={true}
															prefix={'Rp '}
														/>
													</TableCell>
													<TableCell>
														{ row.category }
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
									{products.length > 0 ? null : (
										<TableRow>
											<TableCell colSpan={6}>There is no product data at the moment.</TableCell>
										</TableRow>
									)}
								</TableBody>
							</Table>
						</div>
						<TablePagination
							rowsPerPageOptions={[5, 10, 25]}
							component="div"
							count={products.length}
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
								Create Product
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
											defaultValue={selectedProduct.name}
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
											defaultValue={selectedProduct.description}
											disabled={props.loading}
											onChange={handleFormChange}
										/>
									</Grid>
									<Grid item xs={12}>
										<TextField
											variant="outlined"
											required
											fullWidth
											id="image"
											label="Image URL"
											name="image"
											defaultValue={selectedProduct.image}
											disabled={props.loading}
											onChange={handleFormChange}
										/>
									</Grid>
									<Grid item xs={12}>
										<TextField
											type="number"
											variant="outlined"
											required
											fullWidth
											id="price"
											label="Price"
											name="price"
											disabled={props.loading}
											defaultValue={selectedProduct.price}
											onChange={handleFormChange}
										/>
									</Grid>
									<Grid item xs={12}>
										<TextField
											variant="outlined"
											required
											fullWidth
											select
											id="category_id"
											label="Category"
											name="category_id"
											SelectProps={{
												native: true,
												MenuProps: {
													className: classes.menu,
												},
											}}
											disabled={props.loading}
											defaultValue={selectedProduct.category_id}
											onChange={handleFormChange}
										>

											{ categories.length === 0 ?
												<option value={0} disabled>No category available</option> :
												<option value={0} disabled />
											}
											{categories.map(category => (
												<option
													key={category._id}
													value={category._id}
												>
													{category.name}
												</option>
											))}
										</TextField>
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
								Modify Product
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
											defaultValue={selectedProduct.name}
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
											defaultValue={selectedProduct.description}
											disabled={props.loading}
											onChange={handleFormChange}
										/>
									</Grid>
									<Grid item xs={12}>
										<TextField
											variant="outlined"
											required
											fullWidth
											id="image"
											label="Image URL"
											name="image"
											defaultValue={selectedProduct.image}
											disabled={props.loading}
											onChange={handleFormChange}
										/>
									</Grid>
									<Grid item xs={12}>
										<TextField
											type="number"
											variant="outlined"
											required
											fullWidth
											id="price"
											label="Price"
											name="price"
											disabled={props.loading}
											defaultValue={selectedProduct.price}
											onChange={handleFormChange}
										/>
									</Grid>
									<Grid item xs={12}>
										<TextField
											variant="outlined"
											required
											fullWidth
											select
											id="category_id"
											label="Category"
											name="category_id"
											SelectProps={{
												native: true,
												MenuProps: {
													className: classes.menu,
												},
											}}
											disabled={props.loading}
											defaultValue={selectedProduct.category_id}
											onChange={handleFormChange}
										>

											{ categories.length === 0 ?
												<option value={0} disabled>No category available</option> :
												<option value={0} disabled />
											}
											{categories.map(category => (
												<option
													key={category._id}
													value={category._id}
												>
													{category.name}
												</option>
											))}
										</TextField>
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
								Delete Product
							</Typography>
							<Typography variant="body2" color="textSecondary" component="p">
								Are you sure you would like to delete product { selectedProduct.name }?
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

ManageProducts.propTypes = {
	className: PropTypes.string,
	showNotification: PropTypes.func.isRequired,
	loading: PropTypes.bool.isRequired,
	setLoading: PropTypes.func.isRequired,
	token: PropTypes.string.isRequired
};

export default ManageProducts;
