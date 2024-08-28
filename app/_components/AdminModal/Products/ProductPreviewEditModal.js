import { useState, useEffect } from "react";
import axios from "axios";
import { useForm } from "react-hook-form";

export default function ProductPreviewEditModal({
  setCreatedList,
  activeItem,
  setActiveItem,
  languages,
  activeLang,
  setActiveLang,
  onClose,
}) {
  const [brands, setBrands] = useState([]);
  const [categories, setCategories] = useState([]);
  const [catalogs, setCatalogs] = useState([]);

  // Локальное состояние для управления вводом по каждому языку
  const [localData, setLocalData] = useState({
    name: activeItem.name,
    shortDescription: activeItem.shortDescription,
    conditions: activeItem.conditions,
  });

  // react-hook-form setup
  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm({
    defaultValues: {
      brand: activeItem.brand?.id || '',
      category: activeItem.category?.id || '',
      catalog: activeItem.catalog?.id || '',
    },
  });

  const onSubmit = (data) => {
    const updatedItem = {
      ...activeItem,
      name: localData.name,
      shortDescription: localData.shortDescription,
      conditions: localData.conditions,
      originalPrice: data.originalPrice,
      discount: data.discount,
      sale: data.sale,
      new: data.new,
      technical: data.technical,
      active: data.active,
      popular: data.popular,
      brand: { id: data.brand },
      category: data.category ? { id: data.category } : null,
      catalog: data.catalog ? { id: data.catalog } : null,
      gallery: activeItem.gallery,
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
      (cat) => cat.id == watch("category")
    );
    if (selectedCategory && selectedCategory.catalogs.length > 0) {
      setCatalogs(selectedCategory.catalogs);
      setValue("catalog", selectedCategory.catalogs[0]?.id || null);
    } else {
      setCatalogs([]);
      setValue("catalog", null);
    }
  }, [watch("category"), categories]);

  const handleInputChange = (e, lang, field) => {
    const value = e.target.value;
    setLocalData((prevData) => ({
      ...prevData,
      [field]: {
        ...prevData[field],
        [lang]: value,
      },
    }));
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-8 rounded-lg w-full max-w-md h-[90%] overflow-y-scroll">
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="flex gap-4 mb-4">
            {languages.map((lang) => (
              <button
                key={lang}
                type="button"
                onClick={() => setActiveLang(lang)}
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
            <label className="block text-sm font-medium mb-2">
              Название ({activeLang.toUpperCase()})
            </label>
            <input
              value={localData.name[activeLang]}
              onChange={(e) => handleInputChange(e, activeLang, 'name')}
              className="w-full p-2 border border-gray-300 rounded"
            />
          </div>

          {/* Short Description */}
          <div className="mb-4">
            <label className="block text-sm font-medium mb-2">
              Краткое описание ({activeLang.toUpperCase()})
            </label>
            <textarea
              value={localData.shortDescription[activeLang]}
              onChange={(e) => handleInputChange(e, activeLang, 'shortDescription')}
              className="w-full p-2 border border-gray-300 rounded"
            />
          </div>

          {/* Conditions */}
          <div className="mb-4">
            <label className="block text-sm font-medium mb-2">
              Условия ({activeLang.toUpperCase()})
            </label>
            <textarea
              value={localData.conditions[activeLang]}
              onChange={(e) => handleInputChange(e, activeLang, 'conditions')}
              className="w-full p-2 border border-gray-300 rounded"
            />
          </div>

          {/* Price Details */}
          <div className="mb-4">
            <label className="block text-sm font-medium mb-2">Цена</label>
            <input
              type="number"
              {...register("originalPrice", { required: "Цена обязательна" })}
              className="w-full p-2 border border-gray-300 rounded"
            />
            {errors.originalPrice && (
              <span className="text-red-500">{errors.originalPrice.message}</span>
            )}
          </div>

          {/* Discount (shown only if sale is active) */}
          {watch("sale") && (
            <>
              <div className="mb-4">
                <label className="block text-sm font-medium mb-2">
                  Скидка (%)
                </label>
                <input
                  type="number"
                  {...register("discount")}
                  className="w-full p-2 border border-gray-300 rounded"
                />
              </div>

              {/* Final Price */}
              <div className="mb-4">
                <label className="block text-sm font-medium mb-2">
                  Цена со скидкой
                </label>
                <input
                  type="number"
                  value={watch("originalPrice") * (1 - watch("discount") / 100)}
                  disabled
                  className="w-full p-2 border border-gray-300 rounded bg-gray-100"
                />
              </div>
            </>
          )}

          {/* Toggles for New, Sale, Technical, Active, Popular */}
          <div className="mb-4">
            <label className="block text-sm font-medium mb-2">Настройки</label>
            <div className="flex flex-wrap gap-4">
              <button
                type="button"
                onClick={() =>
                  setValue("new", !watch("new"))
                }
                className={`px-4 py-2 text-sm font-semibold rounded ${
                  watch("new") ? "bg-green-500 text-white" : "bg-gray-200"
                }`}
              >
                Новинка
              </button>
              <button
                type="button"
                onClick={() =>
                  setValue("sale", !watch("sale"))
                }
                className={`px-4 py-2 text-sm font-semibold rounded ${
                  watch("sale") ? "bg-green-500 text-white" : "bg-gray-200"
                }`}
              >
                Распродажа
              </button>
              <button
                type="button"
                onClick={() =>
                  setValue("technical", !watch("technical"))
                }
                className={`px-4 py-2 text-sm font-semibold rounded ${
                  watch("technical")
                    ? "bg-green-500 text-white"
                    : "bg-gray-200"
                }`}
              >
                Технический
              </button>
              <button
                type="button"
                onClick={() =>
                  setValue("active", !watch("active"))
                }
                className={`px-4 py-2 text-sm font-semibold rounded ${
                  watch("active") ? "bg-green-500 text-white" : "bg-gray-200"
                }`}
              >
                Активен
              </button>
              <button
                type="button"
                onClick={() =>
                  setValue("popular", !watch("popular"))
                }
                className={`px-4 py-2 text-sm font-semibold rounded ${
                  watch("popular") ? "bg-green-500 text-white" : "bg-gray-200"
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
              {...register("brand", { required: "Выбор бренда обязателен" })}
              className="w-full p-2 border border-gray-300 rounded"
            >
              {brands.map((brand) => (
                <option key={brand.id} value={brand.id}>
                  {brand.name}
                </option>
              ))}
            </select>
            {errors.brand && (
              <span className="text-red-500">{errors.brand.message}</span>
            )}
          </div>

          {/* Category */}
          <div className="mb-4">
            <label className="block text-sm font-medium mb-2">Категория</label>
            <select
              {...register("category", { required: "Выбор категории обязателен" })}
              className="w-full p-2 border border-gray-300 rounded"
            >
              {categories.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </select>
            {errors.category && (
              <span className="text-red-500">{errors.category.message}</span>
            )}
          </div>

          {/* Catalog */}
          <div className="mb-4">
            <label className="block text-sm font-medium mb-2">Каталог</label>
            {catalogs.length > 0 ? (
              <select
                {...register("catalog")}
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
              type="submit"
              className="py-2 px-4 bg-blue-500 text-white rounded"
            >
              Сохранить
            </button>
            <button
              type="button"
              onClick={onClose}
              className="py-2 px-4 bg-gray-300 text-black rounded"
            >
              Отмена
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
