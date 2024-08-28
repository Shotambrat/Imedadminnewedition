import axios from 'axios'

export const fetchCatalog = async () => {
	try {
		const response = await axios.get('/api/catalog')
		return response.data
	} catch (error) {
		throw new Error('Failed::: fetchCatalog')
	}
}

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

// GET PRODUCT SLUG

// export const getProductSlug = async ({ slug }) => {
// 	try {
// 		const response = await axios.get(
// 			`http://213.230.91.55:8130/v1/product/${slug}`
// 		)
// 		return response.data
// 	} catch (error) {
// 		throw new Error('Failed to fetch all products')
// 	}
// }



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
// http://213.230.91.55:8130/v1/product?catalog-id=5

export const getProductWithCatalogID = async (id) => {
	try {
		const response = await axios.get(
			`http://213.230.91.55:8130/v1/product?catalog-id=${id}` , {headers: {
				'Accept-Language': 'ru',
			},}
		)
		console.log(response)

		return response.data
	} catch (error) {
		console.log('Failed::: getProductWithCatalogID')
	}
}