import axios from 'axios'

// GET ALL PRODUCTS
export const getAllProducts = async () => {
	try {
		const response = await axios.get('http://213.230.91.55:8130/v1/product', {
			headers: {
				'Accept-Language': 'ru',
			},
		})
		return response.data
	} catch (error) {
		throw new Error('Failed::::getAllProducts')
	}
}

//  GET COTEGORIES ALL
export const getAllCotegories = async () => {
	try {
		const response = await axios.get('http://213.230.91.55:8130/v1/category', {
			headers: {
				'Accept-Language': 'ru',
			},
		})
		return response.data
	} catch (error) {
		console.log('Failed::: getAllCotegories')
	}
}

// GET COTEGORIES WITH SLUG
export const getCotegoriesWithSlug = async ({ slug }) => {
	try {
		const response = await axios.get(
			`http://213.230.91.55:8130/v1/category/${slug}`
		)
		return response.data
	} catch (error) {
		throw new Error('Failed::: getCotegoriesWithSlug')
	}
}

// GET CATALOGS DATA WITH ID
export const getProductWithCatalogID = async id => {
	try {
		const response = await axios.get(
			`http://213.230.91.55:8130/v1/product?catalog-id=${id}`,
			{
				headers: {
					'Accept-Language': 'ru',
				},
			}
		)

		return response.data
	} catch (error) {
		console.log('Failed::: getProductWithCatalogID')
	}
}

// GET PRODUCT WITH CATEGORY ID
export const getProductCategoryID = async id => {
	try {
		const response = await axios.get(
			`http://213.230.91.55:8130/v1/product?category-id=${id}`,
			{
				headers: {
					'Accept-Language': 'ru',
				},
			}
		)

		return response.data
	} catch (error) {
		console.log('Failed::: GetProduct withCategoryID')
	}
}
