import { useState, useEffect } from "react";
import axios from "axios";

export default function ProductPreviewEditModal({
  setCreatedList,
  activeItem,
  setActiveItem,
  languages,
  activeLang,
  setActiveLang,
  onClose,
}) {
  const [localData, setLocalData] = useState({ ...activeItem });
  const [brands, setBrands] = useState([]);
  const [categories, setCategories] = useState([]);
  const [catalogs, setCatalogs] = useState([]);

  // Fetch brands from API
  useEffect(() => {
    axios
      .get("http://213.230.91.55:8130/v1/partner/all", {
        headers: { "Accept-Language": "uz" },
      })
      .then((response) => {
        setBrands(response.data.data);
      })
      .catch((error) => console.error("Error fetching brands:", error));
  }, []);

  // Fetch categories from API
  useEffect(() => {
    axios
      .get("http://213.230.91.55:8130/v1/category", {
        headers: { "Accept-Language": "uz" },
      })
      .then((response) => {
        setCategories(response.data.data);
      })
      .catch((error) => console.error("Error fetching categories:", error));
  }, []);

  // Update catalogs when category changes
  useEffect(() => {
    const selectedCategory = categories.find(
      (cat) => cat.id == localData.category.id
    );
    if (selectedCategory && selectedCategory.catalogs.length > 0) {
      console.log("Updated catalogs:", selectedCategory.catalogs);
      setCatalogs(selectedCategory.catalogs);
      setLocalData((prevData) => ({
        ...prevData,
        catalog: { id: selectedCategory.catalogs[0].id }, // Set the first catalog by default
      }));
    } else {
      console.log("No catalogs available for this category", selectedCategory?.catalogs);
      setCatalogs([]);
      setLocalData((prevData) => ({
        ...prevData,
        catalog: { id: null }, // Reset catalog if none available
      }));
    }
  }, [localData.category.id, categories]);

  const handleLanguageChange = (lang) => {
    setActiveLang(lang);
  };

  const handleChange = (e) => {
    const { name, value, type } = e.target;
    const newValue = type === "checkbox" ? e.target.checked : value;
    setLocalData((prevData) => ({
      ...prevData,
      [name]: newValue,
    }));
  };

  const handleLocalizedChange = (e) => {
    const { name, value } = e.target;

    const updatedLocalData = {
      ...localData,
      [name]: {
        ...localData[name],
        [activeLang]: value,
      },
    };
    setLocalData(updatedLocalData);

    const updatedActiveItem = {
      ...activeItem,
      [name]: updatedLocalData[name],
    };
    setActiveItem(updatedActiveItem);

    setCreatedList((prevList) =>
      prevList.map((item) =>
        item.id === updatedActiveItem.id ? updatedActiveItem : item
      )
    );
  };

  // Calculate final price
  const finalPrice =
    localData.sale && localData.discount > 0
      ? Math.round(localData.originalPrice * (1 - localData.discount / 100))
      : localData.originalPrice || 0;

  const handleSave = () => {
    const updatedItem = {
      ...activeItem,
      name: localData.name,
      shortDescription: localData.shortDescription,
      conditions: localData.conditions,
      originalPrice: localData.originalPrice,
      discount: localData.discount,
      sale: localData.sale,
      new: localData.new,
      technical: localData.technical,
      active: localData.active,
      popular: localData.popular,
      brand: { id: localData.brand.id },
      category: localData.category.id || null,
      catalog: catalogs.length > 0 ? localData.catalog.id : null,
      gallery: localData.gallery,
    };

    if (!updatedItem.category && !updatedItem.catalog) {
      alert("Ошибка: Категория или Каталог должны быть выбраны.");
      return;
    }

    setCreatedList((prevList) =>
      prevList.map((item) =>
        item.id === updatedItem.id ? updatedItem : item
      )
    );

    setActiveItem(updatedItem);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-8 rounded-lg w-full max-w-md h-[90%] overflow-y-scroll">
        <div className="flex gap-4 mb-4">
          {languages.map((lang) => (
            <button
              key={lang}
              onClick={() => handleLanguageChange(lang)}
              className={`px-4 py-2 text-sm font-semibold ${
                activeLang === lang ? "bg-redMain text-white" : "bg-white"
              } border ${
                activeLang === lang ? "border-redMain" : "border-gray-300"
              } rounded`}
            >
              {lang.toUpperCase()}
            </button>
          ))}
        </div>

        {/* Name */}
        <div className="mb-4">
          <label className="block text-sm font-medium mb-2">Название</label>
          <input
            type="text"
            name="name"
            value={localData.name[activeLang]}
            onChange={handleLocalizedChange}
            className="w-full p-2 border border-gray-300 rounded"
          />
        </div>

        {/* Short Description */}
        <div className="mb-4">
          <label className="block text-sm font-medium mb-2">
            Краткое описание
          </label>
          <textarea
            name="shortDescription"
            value={localData.shortDescription[activeLang]}
            onChange={handleLocalizedChange}
            className="w-full p-2 border border-gray-300 rounded"
          />
        </div>

        {/* Price Details */}
        <div className="mb-4">
          <label className="block text-sm font-medium mb-2">Цена</label>
          <input
            type="number"
            name="originalPrice"
            value={localData.originalPrice}
            onChange={handleChange}
            className="w-full p-2 border border-gray-300 rounded"
          />
        </div>

        {/* Discount (shown only if sale is active) */}
        {localData.sale && (
          <>
            <div className="mb-4">
              <label className="block text-sm font-medium mb-2">Скидка (%)</label>
              <input
                type="number"
                name="discount"
                value={localData.discount}
                onChange={handleChange}
                className="w-full p-2 border border-gray-300 rounded"
              />
            </div>

            {/* Final Price */}
            <div className="mb-4">
              <label className="block text-sm font-medium mb-2">Цена со скидкой</label>
              <input
                type="number"
                value={finalPrice}
                disabled
                className="w-full p-2 border border-gray-300 rounded bg-gray-100"
              />
            </div>
          </>
        )}

        {/* Conditions */}
        <div className="mb-4">
          <label className="block text-sm font-medium mb-2">Условия</label>
          <textarea
            name="conditions"
            value={localData.conditions[activeLang]}
            onChange={handleLocalizedChange}
            className="w-full p-2 border border-gray-300 rounded"
          />
        </div>

        {/* Toggles for New, Sale, Technical, Active, Popular */}
        <div className="mb-4">
          <label className="block text-sm font-medium mb-2">Настройки</label>
          <div className="flex flex-wrap gap-4">
            <button
              onClick={() =>
                setLocalData((prevData) => ({
                  ...prevData,
                  new: !prevData.new,
                }))
              }
              className={`px-4 py-2 text-sm font-semibold rounded ${
                localData.new ? "bg-green-500 text-white" : "bg-gray-200"
              }`}
            >
              Новинка
            </button>
            <button
              onClick={() =>
                setLocalData((prevData) => ({
                  ...prevData,
                  sale: !prevData.sale,
                }))
              }
              className={`px-4 py-2 text-sm font-semibold rounded ${
                localData.sale ? "bg-green-500 text-white" : "bg-gray-200"
              }`}
            >
              Распродажа
            </button>
            <button
              onClick={() =>
                setLocalData((prevData) => ({
                  ...prevData,
                  technical: !prevData.technical,
                }))
              }
              className={`px-4 py-2 text-sm font-semibold rounded ${
                localData.technical ? "bg-green-500 text-white" : "bg-gray-200"
              }`}
            >
              Технический
            </button>
            <button
              onClick={() =>
                setLocalData((prevData) => ({
                  ...prevData,
                  active: !prevData.active,
                }))
              }
              className={`px-4 py-2 text-sm font-semibold rounded ${
                localData.active ? "bg-green-500 text-white" : "bg-gray-200"
              }`}
            >
              Активен
            </button>
            <button
              onClick={() =>
                setLocalData((prevData) => ({
                  ...prevData,
                  popular: !prevData.popular,
                }))
              }
              className={`px-4 py-2 text-sm font-semibold rounded ${
                localData.popular ? "bg-green-500 text-white" : "bg-gray-200"
              }`}
            >
              Популярный
            </button>
          </div>
        </div>

        {/* Brand */}
        <div className="mb-4">
          <label className="block text-sm font-medium mb-2">Бренд</label>
          <select
            name="brand"
            value={localData.brand.id}
            onChange={(e) =>
              setLocalData((prevData) => ({
                ...prevData,
                brand: { id: e.target.value },
              }))
            }
            className="w-full p-2 border border-gray-300 rounded"
          >
            {brands.map((brand) => (
              <option key={brand.id} value={brand.id}>
                {brand.name}
              </option>
            ))}
          </select>
        </div>

        {/* Category */}
        <div className="mb-4">
          <label className="block text-sm font-medium mb-2">Категория</label>
          <select
            name="category"
            value={localData.category.id}
            onChange={(e) =>
              setLocalData((prevData) => ({
                ...prevData,
                category: { id: e.target.value },
              }))
            }
            className="w-full p-2 border border-gray-300 rounded"
          >
            {categories.map((category) => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
          </select>
        </div>

        {/* Catalog */}
        <div className="mb-4">
          <label className="block text-sm font-medium mb-2">Каталог</label>
          {catalogs.length > 0 ? (
            <select
              name="catalog"
              value={localData.catalog.id}
              onChange={(e) =>
                setLocalData((prevData) => ({
                  ...prevData,
                  catalog: { id: e.target.value },
                }))
              }
              className="w-full p-2 border border-gray-300 rounded"
            >
              {catalogs.map((catalog) => (
                <option key={catalog.id} value={catalog.id}>
                  {catalog.name}
                </option>
              ))}
            </select>
          ) : (
            <div className="text-gray-500">Нет каталогов</div>
          )}
        </div>

        {/* Save/Cancel Buttons */}
        <div className="flex justify-end gap-4">
          <button
            onClick={handleSave}
            className="py-2 px-4 bg-blue-500 text-white rounded"
          >
            Сохранить
          </button>
          <button
            onClick={onClose}
            className="py-2 px-4 bg-gray-300 text-black rounded"
          >
            Отмена
          </button>
        </div>
      </div>
    </div>
  );
}
