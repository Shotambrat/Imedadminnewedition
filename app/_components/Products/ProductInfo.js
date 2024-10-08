'use client'
import Application from '../Main/Application'
import ProductCharacteristics from './ProductCharacteristics'
import ProductPreview from './ProductPreview'

export default function ProductInfo({ productData }) {
	return (
		<div className='w-full max-w-[1440px] mx-auto flex flex-col gap-16 px-2'>
			<ProductPreview productData={productData} />
			<ProductCharacteristics data={productData} />
		</div>
	)
}
