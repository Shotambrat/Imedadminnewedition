"use client";
import { useEffect, useState, useCallback, useMemo } from "react";
import axios from "axios";
import { DNA } from "react-loader-spinner";
import ProductPreview from "./ProductPreview";
import ProductCharacteristics from "./ProductCharacteristics";

export default function ProductInfo({ slug, onClose }) {
  const [activeLang, setActiveLang] = useState("uz");
  const [activeItem, setActiveItem] = useState(null);
  const [loading, setLoading] = useState(false);

  const languages = useMemo(() => ["uz", "ru", "en"], []);

  useEffect(() => {
    setLoading(true);
    axios
      .get(`http://213.230.91.55:8130/v1/product/${slug}`, {
        headers: {
          "Accept-Language": "",
        },
      })
      .then((response) => {
        setActiveItem(response.data.data);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching product data", error);
        setLoading(false);
      });
  }, []);

  console.log("ACTIVE ITEM", activeItem);

  const handleLangChange = useCallback((lang) => {
    setActiveLang(lang);
  }, []);

  const renderLoader = useMemo(() => {
    if (!loading) return null;
    return (
      <div className="fixed h-screen w-full inset-0 flex justify-center items-center bg-subModal z-[9999]">
        <DNA
          visible={true}
          height="120"
          width="120"
          ariaLabel="dna-loading"
          wrapperStyle={{}}
          wrapperClass="dna-wrapper"
        />
      </div>
    );
  }, [activeItem]);

  const handleSave = async () => {
    setLoading(true);
    const authFormData = new FormData();
    authFormData.append("username", "nasiniemsin");
    authFormData.append("password", "2x2=xx");
  
    const authResponse = await axios.post(
      "http://213.230.91.55:8130/v1/auth/login",
      authFormData
    );
  
    const token = authResponse.data.data.token;
  
    // Убедитесь, что мы не дублируем descriptions и characteristics
    const { gallery, slug, reviews, catalog, category, brand, clients, descriptions, characteristics, ...items } = activeItem;

    try {
      const updatedGallery = await Promise.all(
        gallery.map(async (photo) => {
          if (photo.url instanceof File) {
            const formData = new FormData();
            formData.append("photo", photo.url);
  
            const response = await axios.post(
              "http://213.230.91.55:8130/photo",
              formData,
              {
                headers: {
                  Authorization: `Bearer ${token}`,
                  "Content-Type": "multipart/form-data",
                },
              }
            );
            return { url: response.data.data[0].url };
          } else if (photo.url == null) {
            await axios.delete(`http://213.230.91.55:8130/photo/${photo.id}`, {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            });
            return null;
          } else {
            return photo;
          }
        })
      );

      console.log(descriptions)

      const updatedDescriptions = descriptions.map((description) => (
        description.createId ? description.createId && description.title !== null ? {title: description.title, value: description.value } : null : description.id && description.title !== null ? description : {id: description.id}
      )).filter(( item ) => item !== null);

      const updatedChracteristics = characteristics.map((description) => (
        description.createId ? description.createId && description.title !== null ? {title: description.title, value: description.value } : null : description.id && description.title !== null ? description : {id: description.id}
      )).filter(( item ) => item !== null);
  
      const updatedClients = clients.map(client => ({ id: client.id }));
  
      const updatedData = {
        ...items,
        gallery: updatedGallery.filter(Boolean),
        descriptions: updatedDescriptions,
        characteristics: updatedChracteristics,
        brand: { id: brand.id },
        clients: updatedClients,
      };

      console.log("UpdatedData",updatedData)
  
      await axios.put(`http://213.230.91.55:8130/v1/product`, updatedData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
  
      setLoading(false);
      onClose();
    } catch (error) {
      console.log("Error while creating photos", error);
    }
  };

  if (activeItem == null) {
    return <div>Loading ....</div>;
  }

  return (
    <div className="w-full max-w-[1440px] mx-auto flex flex-col gap-16 px-2">
      {renderLoader}
      <div className="flex gap-4 mb-4">
        {languages.map((lang) => (
          <button
            key={lang}
            onClick={() => handleLangChange(lang)}
            className={`px-4 py-2 text-sm font-semibold ${
              activeLang === lang ? "bg-redMain text-white" : "bg-white"
            }`}
          >
            {lang.toUpperCase()}
          </button>
        ))}
      </div>
      <ProductPreview
        setActiveLang={setActiveLang}
        activeItem={activeItem}
        setActiveItem={setActiveItem}
        languages={languages}
        activeLang={activeLang}
      />
      <ProductCharacteristics
        setActiveLang={setActiveLang}
        activeItem={activeItem}
        setActiveItem={setActiveItem}
        languages={languages}
        activeLang={activeLang}
      />
      <div className="flex items-start w-full gap-4">
        <button
          onClick={handleSave}
          className="py-3 px-8 text-white bg-blue-400 rounded-xl"
        >
          Сохранить
        </button>
        <button
          onClick={onClose}
          className="py-3 px-8 text-white bg-red-700 rounded-xl"
        >
          Отмена
        </button>
      </div>
    </div>
  );
}
