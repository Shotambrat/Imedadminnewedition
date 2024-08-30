
import React, { useMemo } from 'react';
import ProductInfo from './ProductInfo';

export default function EditProductModal({ slug, onClose }) {
  const modalContent = useMemo(() => {
    return (
      <div className='fixed w-full h-screen inset-0 bg-modalBg z-[9999] flex items-center justify-center'>
        <div className='w-[70%] h-[95%] overflow-y-scroll no-scrollbar bg-white p-12 rounded-3xl'>
          <ProductInfo slug={slug} onClose={onClose} />
        </div>
      </div>
    );
  }, [slug, onClose]);

  return modalContent;
}