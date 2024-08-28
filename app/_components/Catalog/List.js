"use client";
import { useState, useEffect } from "react";
import CatalogList from "./CatalogBar";
import CatalogItem from "./Catalogitem";
import Dropdown from "./DropDown";
import Category from "../Modal/Category";
import { ChevronDownIcon } from "@heroicons/react/20/solid";
import ProductMain from '../AdminModal/Products/ProductMain';

const List = ({ data, allCotegories, productWithCatalogID }) => {
  const [categoryModal, setCategoryModal] = useState(false);
  const [displayAll, setDisplayAll] = useState(false);
  const [adminModal, setAdminModal] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState("Все товары");
  const [filteredData, setFilteredData] = useState([]);

  useEffect(() => {
    // Set initial filtered data based on productWithCatalogID
    setFilteredData(productWithCatalogID?.data || []);
  }, [productWithCatalogID]);

  const handleFilter = (category) => {
    setSelectedCategory(category);
    const items = productWithCatalogID?.data || [];
    switch (category) {
      case "Новинки":
        setFilteredData(items.filter((item) => item.new));
        break;
      case "Акции":
        setFilteredData(items.filter((item) => item.sale));
        break;
      case "Все товары":
      default:
        setFilteredData(items);
        break;
    }
    setDisplayAll(false);
  };

  const handleClose = () => setCategoryModal(false);
  const handleLoadMore = () => setDisplayAll(true);

  const getFilteredData = () => {
    const dataToDisplay = displayAll ? filteredData : filteredData.slice(0, 10);
    return dataToDisplay;
  };

  return (
    <div className="w-full max-w-[1440px] mx-auto flex flex-col lg:gap-20 gap-5 px-2 py-24">
      {adminModal && <ProductMain closeModal={setAdminModal} />}
      {categoryModal && <Category handleClose={handleClose} />}
      
      <div className="w-full flex flex-col lg:flex-row lg:justify-between gap-5">
        <h1 className="text-3xl max-mdx:text2xl font-semibold">КАТАЛОГ</h1>
        <div className="z-[999] flex items-center justify-between">
          <button
            onClick={() => setCategoryModal(true)}
            className="px-4 py-3 justify-center backdrop-opacity-10 flex items-center lg:hidden w-1/2 border border-gray-300"
          >
            Категории
            <ChevronDownIcon className="w-5 h-5 ml-2 -mr-1" aria-hidden="true" />
          </button>
          <Dropdown handleFilter={handleFilter} />
          <div className="w-full flex-col gap-2 hidden lg:flex">
            <div className="hidden lg:flex flex-col relative items-end">
              <div className="overflow-x-scroll gap-4 lg:gap-6 scrollbar-hide touch-auto hidden lg:flex">
                {["Все товары", "Новинки", "Акции"].map((category) => (
                  <button
                    onClick={() => handleFilter(category)}
                    key={category}
                    className={`z-10 w-auto text-lg transition-text font-semibold ${
                      selectedCategory === category
                        ? "text-redMain border-b-2 border-b-redMain"
                        : "text-neutral-400"
                    }`}
                  >
                    <h3 className="my-2 whitespace-nowrap">{category}</h3>
                  </button>
                ))}
              </div>
              <hr className="w-full border-t-2 absolute bottom-0 border-slate-300" />
            </div>
          </div>
        </div>
      </div>

      <div className="w-full flex gap-10">
        <div className="w-full max-w-[350px] max-2xl:max-w-[280px] max-lg:hidden">
          <CatalogList data={data} allCotegories={allCotegories} />
        </div>
        <div>
          <div className="w-full grid grid-cols-1 mdl:grid-cols-2 3xl:grid-cols-3 gap-4">
            {getFilteredData().length > 0 ? (
              getFilteredData().map((item, index) => (
                <div key={item.id || index}>
                  <CatalogItem
                    new={item.new}
                    sale={item.sale}
                    image={item.gallery[0]?.url}
                    title={item.name}
                    description={item.shortDescription}
                    price={item.originalPrice}
                    slug={item.slug}
                    discount={item.discount}
                  />
                </div>
              ))
            ) : (
              null
            )}
            <button
              onClick={() => setAdminModal(true)}
              className="text-6xl font-bold text-redMain flex justify-center items-center border-4 border-redMain border-dashed"
            >
              +
            </button>
          </div>
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
};

export default List;
