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
import PropTypes from 'prop-types';
import NumberFormat from 'react-number-format';
import Container from "@material-ui/core/Container";
import {makeStyles} from "@material-ui/core";
import Button from "@material-ui/core/Button";
import IconButton from "@material-ui/core/IconButton";
import Grid from "@material-ui/core/Grid";
import TextField from "@material-ui/core/TextField";
import Card from "@material-ui/core/Card";
import CardActionArea from "@material-ui/core/CardActionArea";
import CardMedia from "@material-ui/core/CardMedia";
import CardContent from "@material-ui/core/CardContent";
import Typography from "@material-ui/core/Typography";
import Divider from "@material-ui/core/Divider";
import AddCircleOutlineIcon from "@material-ui/icons/AddCircleOutline";
import RemoveCircleOutlineIcon from "@material-ui/icons/RemoveCircleOutline";
import {getProducts, GetProductsParams} from "../../../services/ProductAPI";
import {useDispatch, useSelector} from "react-redux";
import {State} from "../../../reducers";
import {showNotification} from "../../../actions";
import {setProducts, updateProduct} from "../ManageProducts/action";
import {
	addProductQuantity,
	createTransaction,
	getTransaction,
	reduceProductQuantity
} from "../../../services/TransactionAPI";
import {resetTransaction, setShoppingCart} from "./action";
import {getCategories} from "../../../services/CategoryAPI";
import {setCategories} from "../ManageCategories/action";

const useStyles = makeStyles(theme => ({
	container: {
		paddingTop: theme.spacing(4),
		paddingBottom: theme.spacing(4),
	},
	itemCard: {
		height: 350,
	},
	itemCardActionArea: {
		height: '100%',
	},
	media: {
		minHeight: 150,
		maxHeight: 150
	},
	checkoutCard: {
		width: '100%',
		padding: 10
	},
	checkoutActions: {
		// float: 'right',
		padding: 10
	},
	checkoutItemList: {
		padding: 10
	},
	checkoutTotal: {
		padding: 10
	},
	button: {
		margin: theme.spacing(1),
	},
	iconButton: {
		padding: 0,
	},
	menu: {}
}));

const Transaction: React.FC = () => {
	const classes = useStyles();

	const [currentQuery, setCurrentQuery] = React.useState('');
	const [currentSortBy, setCurrentSortBy] = React.useState('name');
	const [currentSortMethod, setCurrentSortMethod] = React.useState(1);
	const categories = useSelector((state: State) => state.category.categories);
	const products = useSelector((state: State) => state.product.products);
	const transaction = useSelector((state: State) => state.transaction.transaction);
	const shoppingCart = useSelector((state: State) => state.transaction.shoppingCart);
	const total = useSelector((state: State) => {
		let price = 0;
		if (typeof state.transaction.shoppingCart !== 'undefined') {
			for (const product of state.transaction.shoppingCart) {
				price = price + (product.price * product.quantity);
			}
		}
		return price;
	});
	const dispatch = useDispatch();

	const doGetProducts = async (params?: GetProductsParams) => {
		try {
			const [categoriesResponse, productsResponse] = await Promise.all([
				getCategories(), getProducts(params)
			]);
			dispatch(setCategories((categoriesResponse as any).data));
			dispatch(setProducts((productsResponse as any).data, (categoriesResponse as any).data));
		} catch (error) {
			dispatch(showNotification(error.message, 'error'));
		}
	};

	const doResetTransaction = async (isCheckout: boolean = false) => {
		try {
			const response: any = await createTransaction();
			dispatch(resetTransaction(response.data));
			if (isCheckout) {
				dispatch(showNotification('Your transaction has been checked out successfully!', 'success'));
			}
		} catch (error) {
			dispatch(showNotification(error.message, 'error'));
		}
	};

	React.useEffect(() => {
		const promises = [];
		promises.push(doGetProducts({
			sort_by: currentSortBy as 'name' | 'category_id' | 'updated_at',
			sort_method: currentSortMethod as 0 | 1
		}));
		if (typeof transaction._id === 'undefined') {
			promises.push(doResetTransaction());
		}
		Promise.all(promises).then(() => {
			return getTransaction(transaction._id);
		}).then((response: any) => {
			dispatch(setShoppingCart(response.data.products.filter((p: any) => p.quantity > 0)));
		}).catch((error: any) => {
			dispatch(showNotification(error.message, 'error'));
		});
	}, []);

	React.useEffect(() => {
		doGetProducts({
			query: currentQuery,
			sort_by: currentSortBy as 'name' | 'category_id' | 'updated_at',
			sort_method: currentSortMethod as 0 | 1
		});
	}, [currentQuery, currentSortBy, currentSortMethod]);

	const handleAddProductToShoppingCart = async (index: number) => {
		try {
			const product = products[index];
			const response: any = await addProductQuantity(
				transaction._id,
				product._id,
				1
			);
			if (!response.message.startsWith('Success')) {
				dispatch(showNotification(response.message, 'warning'));
			}
			product.stock = product.stock - 1;
			dispatch(updateProduct(product, categories.slice(0)));
			dispatch(setShoppingCart(response.data.products.filter((p: any) => p.quantity > 0)));
		} catch (error) {
			dispatch(showNotification(error.message, 'error'));
		}
	};

	const handleAddProductQuantity = async (index: number) => {
		try {
			const product = shoppingCart[index];
			const response: any = await addProductQuantity(
				transaction._id,
				product._id,
				1
			);
			if (!response.message.startsWith('Success')) {
				dispatch(showNotification(response.message, 'warning'));
			}
			product.stock = product.stock - 1;
			dispatch(updateProduct(product, categories.slice(0)));
			dispatch(setShoppingCart(response.data.products.filter((p: any) => p.quantity > 0)));
		} catch (error) {
			dispatch(showNotification(error.message, 'error'));
		}
	};

	const handleReduceProductQuantity = async (index: number) => {
		try {
			const product = shoppingCart[index];
			const response: any = await reduceProductQuantity(
				transaction._id,
				product._id,
				1
			);
			product.stock = product.stock + 1;
			dispatch(updateProduct(product, categories.slice(0)));
			dispatch(setShoppingCart(response.data.products.filter((p: any) => p.quantity > 0)));
		} catch (error) {
			dispatch(showNotification(error.message, 'error'));
		}
	};

	const handleSearchChange: React.ChangeEventHandler = (event) => {
		if ((event.target as any).value.length > 3) {
			setCurrentQuery((event.target as any).value);
		} else {
			setCurrentQuery('');
		}
	};

	const handleSortByChange: React.ChangeEventHandler = (event) => {
		setCurrentSortBy((event.target as any).value);
	};

	const handleSortMethodChange: React.ChangeEventHandler = (event) => {
		setCurrentSortMethod(parseInt((event.target as any).value));
	};

	const handleCheckout: React.MouseEventHandler = (event) => {
		doResetTransaction(true);
	};

	const handleNewTransaction: React.MouseEventHandler = (event) => {
		doResetTransaction(false);
	};

	const getNoProductMessage = () => (
		currentQuery !== ''
			? 'There is no product match with "' + currentQuery + '".'
			: 'There is no product at the moment.'
	);

	return (
		<Container maxWidth="lg" className={classes.container}>
			<Grid container spacing={3}>
				<Grid item xs={12}>
					<TextField
						fullWidth
						id="query"
						label="Search something"
						name="query"
						onChange={handleSearchChange}
					/>
				</Grid>
			</Grid>
			<Grid container spacing={3}>
				<Grid item xs={12} md={8}>
					<Grid container spacing={2}>
						<Grid item xs={12}>
							<TextField
								variant="outlined"
								required
								select
								id="sort_by"
								label="Sort by"
								name="sort_by"
								defaultValue={currentSortBy}
								onChange={handleSortByChange}
							>
								<option value="name">Product Name</option>
								<option value="category_id">Category</option>
								<option value="updated_at">Date Updated</option>
							</TextField>&nbsp;
							<TextField
								variant="outlined"
								required
								select
								id="sort_method"
								label="Sort method"
								name="sort_method"
								defaultValue={currentSortMethod}
								onChange={handleSortMethodChange}
							>
								<option value={1}>Ascending</option>
								<option value={0}>Descending</option>
							</TextField>
						</Grid>
					</Grid>
					<Grid container spacing={2}>
						{
							products.length > 0 ? products.map((product: any, index: number) => (
								<Grid key={index} item xs={12} sm={6} md={4} lg={3} xl={1}>
									<Card className={classes.itemCard}>
										<CardActionArea className={classes.itemCardActionArea} onClick={() => {
											handleAddProductToShoppingCart(index);
										}}>
											<CardMedia
												className={classes.media}
												image={product.image}
												title={product.name}
											/>
											<CardContent>
												<Typography variant="body2" color="textSecondary" component="p">
													<strong>{product.category.toUpperCase()}</strong>
												</Typography>
												<Typography gutterBottom variant="h6" component="h5">
													{product.name}
												</Typography>
												<Typography variant="body2" color="textSecondary" component="p">
													{product.description}<br />
													<strong>
														<NumberFormat
															value={product.price}
															displayType={'text'}
															thousandSeparator={true}
															prefix={'Rp '}
														/>
													</strong>
												</Typography>
												{product.stock > 0 ? (product.stock <= 50 ? (
													<Typography style={{ color: 'orange' }} variant="body2" component="p">
														Limited ({product.stock} available)
													</Typography>
												) : (
													<Typography style={{ color: 'green' }} variant="body2" component="p">
														Available
													</Typography>
												)) : (
													<Typography style={{ color: 'red' }} variant="body2" component="p">
														Out of stock
													</Typography>
												)}
											</CardContent>
										</CardActionArea>
									</Card>
								</Grid>
							)) : <Grid item>{ getNoProductMessage() }</Grid>
						}
					</Grid>
				</Grid>
				<Grid item xs={12} md={4}>
					<Card className={classes.checkoutCard}>
						<Typography gutterBottom variant="h5" component="h3">
							Shopping Cart
						</Typography>
						<Divider/>
						<div className={classes.checkoutActions}>
							<Button
								size="small"
								variant="contained"
								color="primary"
								onClick={handleCheckout}
								disabled={shoppingCart.length === 0}
							>Checkout</Button>&nbsp;
							<Button
								size="small"
								variant="contained"
								onClick={handleNewTransaction}
								disabled={shoppingCart.length === 0}
							>New Transaction</Button>
						</div>
						<Divider/>
						<div className={classes.checkoutItemList}>
							{ shoppingCart.length > 0 ? shoppingCart.map((product: any, index: number) => (
								<Grid item key={index}>
									<IconButton style={{ color: 'green' }} className={classes.iconButton} onClick={() => {
										handleAddProductQuantity(index);
									}}>
										<AddCircleOutlineIcon />
									</IconButton>&nbsp;<IconButton color="secondary" className={classes.iconButton} onClick={() => {
										handleReduceProductQuantity(index);
									}}>
										<RemoveCircleOutlineIcon />
									</IconButton>&nbsp;<strong>{product.name}</strong>&nbsp;
									{ product.quantity > 1
										? `[${product.quantity} pcs]`
										: '' }
								</Grid>
							)) : 'Your shopping cart is empty' }
						</div>
						<Divider/>
						<div className={classes.checkoutTotal}>
							{`Total: `}
							<NumberFormat
								value={total}
								displayType={'text'}
								thousandSeparator={true}
								prefix={'Rp '}
							/>
						</div>
					</Card>
				</Grid>
			</Grid>
		</Container>
	);
}

Transaction.propTypes = {
	className: PropTypes.string
};

export default Transaction;
