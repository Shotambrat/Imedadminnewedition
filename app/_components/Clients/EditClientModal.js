"use client";
import React, { useEffect, useState } from "react";
import LocationDropdown from "@/app/_components/AdminModal/Clients/LocationDropdown";
import LogoUploader from "@/app/_components/AdminModal/Clients/LogoUploader";
import GalleryUploader from "@/app/_components/AdminModal/Clients/GalleryUploader";
import axios from "axios";

const ClientsInfo = ({ slug, onClose }) => {
  const [client, setClient] = useState([]);
  const [activeLang, setActiveLang] = useState('uz');
  useEffect(() => {
    try {
      axios
        .get(`https://imed.uz/api/v1/client/${slug}`, {
          headers: {
            'Accept-Language': '',
          },
        })
        .then((response) => {
          setClient(response.data.data);
        })
        .catch((error) => {
          console.error("Error to fetch clients", error);
        });
    } catch (error) {
      throw Error("Error to fetch clients", error);
    }
  }, []);

  const languages = ['uz', 'ru', 'en']

  const handleInputChange = (field, value) => {
    const updatedItem = { ...client, [field]: value };
    setClient(updatedItem);
  };

  const handleDescriptionChange = (lang, value) => {
    const updatedDescription = {
      ...client.description,
      [lang]: value,
    };
    const updatedItem = {
      ...client,
      description: updatedDescription,
    };
    setClient(updatedItem);
  };

  const setSelectedLocation = (location) => {
    const updatedItem = {
      ...client,
      location,
    };
    setClient(updatedItem);
  };

  const setLogo = (logoFile) => {
    const updatedItem = {
      ...client,
      logo: logoFile,
    };
    setClient(updatedItem);
  };

  const setGallery = (galleryFiles) => {
    const updatedItem = {
      ...client,
      gallery: galleryFiles,
    };
    setClient(updatedItem);
  };

  return (
    <div className="w-full h-screen fixed inset-0 bg-modalBg flex justify-center items-center z-[9999]">
      <div className="w-[70%] h-[95%] overflow-y-scroll bg-white ">
        <div className="w-full max-w-4xl mx-auto">
          <div className="mb-6">
            <h2 className="text-2xl font-semibold mb-4">
              Информация о клиенте
            </h2>
            <div className="mb-4">
              <label className="block mb-2 text-sm font-medium text-gray-700">
                Название клиента
              </label>
              <input
                type="text"
                value={client.name}
                onChange={(e) => handleInputChange("name", e.target.value)}
                className="w-full border border-gray-300 rounded px-4 py-2"
                placeholder="Введите название клиента"
              />
            </div>
            <div className="mb-4">
              <div className="flex mb-2">
                {languages.map((lang) => (
                  <button
                    key={lang}
                    onClick={() => setActiveLang(lang)}
                    className={`px-3 py-1 mr-2 rounded ${
                      activeLang === lang
                        ? "bg-blue-500 text-white"
                        : "bg-gray-200"
                    }`}
                  >
                    {lang.toUpperCase()}
                  </button>
                ))}
              </div>
              <label className="block mb-2 text-sm font-medium text-gray-700">
                Описание
              </label>
              <textarea
                value={client.description[activeLang]}
                onChange={(e) =>
                  handleDescriptionChange(activeLang, e.target.value)
                }
                className="w-full border border-gray-300 rounded px-4 py-2 h-32"
                placeholder="Введите описание клиента"
              />
            </div>
            <div className="mb-4">
              <LocationDropdown
                locations={locations}
                setLocations={fetchLocations}
                selectedLocation={client.location}
                setSelectedLocation={setSelectedLocation}
              />
            </div>
            <div className="mb-4">
              <LogoUploader logo={client.logo} setLogo={setLogo} />
            </div>
            <div className="mb-4">
              <GalleryUploader
                gallery={client.gallery}
                setGallery={setGallery}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ClientsInfo;
