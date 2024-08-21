"use client";
import { useState } from "react";
import CatalogList from "./CatalogBar";
import CatalogItem from "./CatalogItem";
import Dropdown from "./DropDown";
import Category from "../Modal/Category";

export default function List({ category, products, setProducts }) {
  const [categoryModal, setCategoryModal] = useState(false);
  const [displayAll, setDisplayAll] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState("all");

  const handleFilter = (filter) => {
    setSelectedCategory(filter);
    setDisplayAll(false); // Reset display state when changing filter

    let filteredProducts = [...products];
    if (filter === "new") {
      filteredProducts = filteredProducts.filter((product) => product.new);
    } else if (filter === "promotions") {
      filteredProducts = filteredProducts.filter((product) => product.sale);
    }

    setProducts(filteredProducts);
  };

  const handleCatalogSelect = (catalogId) => {
    axios.get(`http://213.230.91.55:8130/v1/product?catalog-id=${catalogId}`)
      .then((response) => {
        setProducts(response.data.data);
      })
      .catch((error) => {
        console.error("Error fetching products by catalog:", error);
      });
  };

  const handleCategorySelect = (categoryId) => {
    axios.get(`http://213.230.91.55:8130/v1/product?category-id=${categoryId}`)
      .then((response) => {
        setProducts(response.data.data);
      })
      .catch((error) => {
        console.error("Error fetching products by category:", error);
      });
  };

  const handleLoadMore = () => {
    setDisplayAll(true);
  };

  const filteredProducts = displayAll ? products : products.slice(0, 10);

  return (
    <div className="w-full max-w-[1440px] mx-auto flex flex-col lg:gap-20 gap-5 px-2 py-24">
      {categoryModal && <Category handleClose={() => setCategoryModal(false)} />}
      <div className="w-full flex flex-col lg:flex-row lg:justify-between gap-5">
        <h1 className="text-3xl max-mdx:text2xl font-semibold">{category.name}</h1>
        <Dropdown handleFilter={handleFilter} />
      </div>

      <div className="w-full flex gap-10">
        <div className="w-full max-w-[350px] max-2xl:max-w-[280px] max-lg:hidden">
          <CatalogList 
            categories={[category]}
            onCatalogSelect={handleCatalogSelect}
            onCategorySelect={handleCategorySelect}
            openSection={category.id}
          />
        </div>
        <div className="w-full grid grid-cols-1 mdl:grid-cols-2 3xl:grid-cols-3 gap-4">
          {filteredProducts.map((product, index) => (
            <CatalogItem
              key={index}
              product={product}
              onDelete={() => handleDeleteProduct(product.id)}
              onUpdate={(updatedProduct) => handleUpdateProduct(updatedProduct)}
            />
          ))}
          {!displayAll && (
            <button
              className="border-redMain border-dashed border-4 flex justify-center items-center text-8xl text-redMain font-bold"
              onClick={handleLoadMore}
            >
              +
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
