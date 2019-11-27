import React, { useEffect, useState } from 'react';
import {
	FlatList,
	Image,
	Platform,
	SafeAreaView,
	ScrollView,
	Text,
	TouchableOpacity,
	View
} from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { FAB } from 'react-native-paper';

import {resetTransaction, setCategories, setPaginatedProducts, setShoppingCart} from './action';
import { style } from './style';
import { setLoading, showNotification } from '../../../actions';
import Button from '../../../components/Button';
import Item from '../../../components/Item';
import TextInput from '../../../components/TextInput';
import { theme } from '../../../core/theme';
import { catchNetworkError } from '../../../core/utils';
import { getPaginatedProducts, getProducts } from '../../../services/ProductAPI';
import {
	addProductQuantity,
	createTransaction,
	getTransaction,
	reduceProductQuantity
} from "../../../services/TransactionAPI";
import {getCategories} from "../../../services/CategoryAPI";

const ShoppingCart = ({ shoppingCart }) => (
	<View><Text>aaa</Text></View>
);

const TransactionScreen = ({ navigation }) => {

	const [ params, setParams ] = useState({ query: void 0, page_by: 10, page: void 0, sort_by: 'name' });
	const accessToken = useSelector(state => state.root.accessToken);
	const isLoading = useSelector(state => state.root.isLoading);
	const categories = useSelector(state => state.transaction.categories);
	const transaction = useSelector(state => state.transaction.transaction);
	const transactionIdentifier = useSelector(state => state.transaction.transaction._id);
	const paginatedProducts = useSelector(state => state.transaction.paginatedProducts);
	const shoppingCart = useSelector(state => state.transaction.shoppingCart);
	const totalPrice = useSelector(state => {
		let price = 0;
		if (typeof state.transaction.shoppingCart !== 'undefined') {
			for (const product of state.transaction.shoppingCart) {
				price = price + (product.price * product.quantity);
			}
		}
		return price;
	});
	const dispatch = useDispatch();

	const refreshCategories = async () => {
		try {
			dispatch(setLoading(true));
			const response = await getCategories(accessToken);
			dispatch(setCategories(response.data));
		} catch (error) {
			catchNetworkError(error, navigation, dispatch);
		} finally {
			dispatch(setLoading(false));
		}
	};

	const refreshPaginatedProducts = async () => {
		try {
			dispatch(setLoading(true));
			await refreshCategories();
			const response = await getProducts(accessToken, params);
			dispatch(setPaginatedProducts(response.data));
		} catch (error) {
			catchNetworkError(error, navigation, dispatch);
		} finally {
			dispatch(setLoading(false));
		}
	};

	const refreshShoppingCart = async () => {
		try {
			dispatch(setLoading(true));
			const response = await getTransaction(accessToken, transaction._id);
			dispatch(setShoppingCart(response.data.products.filter((p: any) => p.quantity > 0)));
		} catch (error) {
			catchNetworkError(error, navigation, dispatch);
		} finally {
			dispatch(setLoading(false));
		}
	};

	const checkout = async (reset: boolean = false) => {
		try {
			dispatch(setLoading(true));
			const response: any = await createTransaction(accessToken);
			dispatch(resetTransaction(response.data));
			if (!reset) {
				dispatch(showNotification({
					type: 'success',
					message: 'The transaction has been checked out successfully!',
					title: 'Payment Complete'
				}));
			}
		} catch (error) {
			catchNetworkError(error, navigation, dispatch);
		} finally {
			dispatch(setLoading(false));
		}
	};

	useEffect(() => {
		refreshPaginatedProducts().then(() => {
			if (typeof transactionIdentifier === 'undefined') {
				checkout(true).catch();
			}
		});
	}, []);

	useEffect(() => {
		refreshPaginatedProducts().catch();
	}, [ params ]);

	useEffect(() => {
		refreshShoppingCart().catch();
	}, [ transactionIdentifier ]);

	const handleShowShoppingCart = () => {
		dispatch(showNotification({
			title: 'Shopping Cart',
			component: shoppingCart.length > 0 && <ShoppingCart shoppingCart={shoppingCart} />,
			message: shoppingCart.length === 0 && 'Your shopping cart is empty. Please add an item.'
		}))
	};

	const handleAddQuantity = async (product) => {
		try {
			const response: any = await addProductQuantity(
				accessToken,
				transaction._id,
				product._id,
				1
			);
			await refreshShoppingCart();
			if (!response.message.startsWith('Success')) {
				dispatch(showNotification({
					type: 'warning',
					title: 'Warning!',
					message: response.message
				}));
			}
			product.stock = product.stock - 1;
			const products = paginatedProducts.slice(0);
			dispatch(setPaginatedProducts(products.filter(p => p._id === product._id ? product : p)));
		} catch (error) {
			catchNetworkError(error, navigation, dispatch);
		}
	};

	const handleReduceQuantity = async (product) => {
		if (getTotalInCart(product._id) <= 0) {
			return;
		}
		try {
			const response: any = await reduceProductQuantity(
				accessToken,
				transaction._id,
				product._id,
				1
			);
			await refreshShoppingCart();
			product.stock = product.stock + 1;
			const products = paginatedProducts.slice(0);
			dispatch(setPaginatedProducts(products.filter(p => p._id === product._id ? product : p)));
		} catch (error) {
			catchNetworkError(error, navigation, dispatch);
		}
	};

	const sorters = [
		{ name: 'Name', by: 'name' },
		{ name: 'Category', by: 'category_id' },
		{ name: 'Recent Update', by: 'updated_at' },
	];

	const getTotalInCart = (productIdentifier) => {
		const product = shoppingCart.find(p => p._id === productIdentifier);
		return !!product ? product.quantity : 0;
	};

	return (
		<View style={style.container}>
			<ScrollView
				style={style.container}
				contentContainerStyle={style.contentContainer}>

				<View style={style.searchContainer}>
					<TextInput
						style={{ marginVertical: 0}}
						label="Search products..."
						mode="contained"
						returnKeyType="done"
						value={params.query}
						onChangeText={text => setParams({ ...params, query: text })}
					/>
				</View>

				<ScrollView horizontal style={style.sortContainer}>{
					sorters.map((sorter, index) => (
						<Button
							key={index}
							style={style.sortButton}
							size={10}
							mode={params.sort_by === sorter.by ? "contained" : "outlined"}
							disabled={params.sort_by === sorter.by}
							onPress={() => setParams({ ...params, sort_by: sorter.by })}
							uppercase={false}
						>
							{ sorter.name }
						</Button>
					))
				}
				</ScrollView>

				<SafeAreaView style={style.listContainer}>
					<ScrollView>
						{
							paginatedProducts.map((item, index) => (
								<Item
									key={index}
									image={item.image}
									name={item.name}
									description={item.description}
									tag={item.category_id}
									style={{
										marginVertical: 5
									}}
								>
									{
										item.stock > 0 ? (
											<View>
												{ item.stock < 50
													? <Text style={style.warningText}>Limited ({item.stock} available)</Text>
													: <Text style={style.successText}>Available</Text>
												}
												<View style={style.actionsContent}>
													<Button
														style={style.action}
														compact
														icon="minus"
														mode="outlined"
														onPress={() => { handleReduceQuantity(item).catch() }}
													/>
													<Button style={style.action} compact disabled mode="outlined">
														{ getTotalInCart(item._id) }
													</Button>
													<Button
														style={style.action}
														compact
														icon="plus"
														mode="outlined"
														onPress={() => { handleAddQuantity(item).catch() }}
													/>
												</View>
											</View>
										) : (
											<View>
												<Text style={style.errorText}>Out of stock!</Text>
											</View>
										)
									}
								</Item>
							))
						}
					</ScrollView>
				</SafeAreaView>

			</ScrollView>

			<FAB
				color={theme.colors.alternate}
				style={style.shoppingCartButton}
				icon="cart-arrow-right"
				onPress={handleShowShoppingCart}
			>
				{ shoppingCart.length > 0 && `${shoppingCart.length} product(s)` }
			</FAB>

		</View>
	);
};

TransactionScreen.navigationOptions = {
	header: null,
};

export default TransactionScreen;