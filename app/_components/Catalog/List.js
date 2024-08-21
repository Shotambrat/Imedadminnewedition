"use client";
import { useState, useEffect } from "react";
import CatalogItem from "./CatalogItem";
import CatalogList from "./CatalogBar";
import axios from "axios";
import Dropdown from "./DropDown";
import Category from "../Modal/Category";

export default function List({ category, products, setProducts }) {
  const [categoryModal, setCategoryModal] = useState(false);
  const [displayAll, setDisplayAll] = useState(false);
  const [selectedCatalogId, setSelectedCatalogId] = useState(null);
  const [filteredProducts, setFilteredProducts] = useState(products);

  useEffect(() => {
    setFilteredProducts(products);
  }, [products]);

  const handleCatalogSelect = (catalogId) => {
    setSelectedCatalogId(catalogId);

    if (catalogId) {
      axios.get(`http://213.230.91.55:8130/v1/product?catalog-id=${catalogId}`)
        .then((response) => {
          setFilteredProducts(response.data.data);
        })
        .catch((error) => {
          console.error("Error fetching products by catalog:", error);
        });
    } else {
      setFilteredProducts(products);
    }
  };

  const handleFilter = (filter) => {
    let filtered = [...products];
    if (filter === "new") {
      filtered = filtered.filter((product) => product.new);
    } else if (filter === "promotions") {
      filtered = filtered.filter((product) => product.sale);
    }
    setFilteredProducts(filtered);
  };

  const handleLoadMore = () => {
    setDisplayAll(true);
  };

  return (
    <div className="w-full max-w-[1440px] mx-auto flex flex-col lg:gap-20 gap-5 px-2 py-24">
      {categoryModal && <Category handleClose={() => setCategoryModal(false)} />}
      <div className="w-full flex flex-col lg:flex-row lg:justify-between gap-5">
        <h1 className="text-3xl max-mdx:text2xl font-semibold">КАТАЛОГ</h1>
        <Dropdown handleFilter={handleFilter} />
      </div>

      <div className="w-full flex gap-10">
        <div className="w-full max-w-[350px] max-2xl:max-w-[280px] max-lg:hidden">
          <CatalogList
            categories={[category]}
            onCatalogSelect={handleCatalogSelect}
            openSection={category.id}
          />
        </div>
        <div className="w-full grid grid-cols-1 mdl:grid-cols-2 3xl:grid-cols-3 gap-4">
          {filteredProducts.map((product, index) => (
            <CatalogItem
              key={index}
              product={product}
              onDelete={(productId) => setProducts(products.filter(p => p.id !== productId))}
              onUpdate={(updatedProduct) => setProducts(products.map(p => p.id === updatedProduct.id ? updatedProduct : p))}
            />
          ))}
          {!displayAll && (
            <div className="flex justify-center mt-[50px] mdx:mt-[70px]">
              <button
                className="border p-3 text-[14px] mdx:text-[16px] px-[50px] hover:bg-[#F9D2D3] font-bold"
                onClick={handleLoadMore}
              >
                Загрузить еще
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}