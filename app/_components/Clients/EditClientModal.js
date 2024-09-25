"use client";
import React, { useEffect, useState } from "react";
import LocationDropdown from "@/app/_components/AdminModal/Clients/LocationDropdown";
import LogoUploader from "./LogoUploader";
import GalleryUploader from "./GalleryUploader";
import axios from "axios";
import { DNA } from "react-loader-spinner";

const ClientsInfo = ({ slug, onClose }) => {
  const [client, setClient] = useState(null);
  const [activeLang, setActiveLang] = useState("uz");
  const [locations, setLocations] = useState(null);
  const [loading, setLoading] = useState(false);
  const [galleryDeleteList, setGalleryDeleteList] = useState([]);

  useEffect(() => {
    fetchLocations();
  }, []);

  const fetchLocations = async () => {
    try {
      setLoading(true);
      const response = await axios.get(
        "http://213.230.91.55:8130/v1/location",
        {
          headers: {
            "Accept-Language": activeLang,
          },
        }
      );
      setLocations(response.data.data);
    } catch (error) {
      console.error("Error fetching locations:", error);
    } finally {
      setLoading(false);
    }
  };

  const createImageInServer = async (a) => {
    console.log(a);
    const filteredArr = [];
    for (let b of a) {
      console.log(b);
      b instanceof File ? filteredArr.push(b) : null;
    }

    console.log(filteredArr);

    const authFormData = new FormData();
    authFormData.append("username", "nasiniemsin");
    authFormData.append("password", "2x2=xx");
    const authResponse = await axios.post(
      "http://213.230.91.55:8130/v1/auth/login",
      authFormData
    );

    const token = authResponse.data.data.token;

    const createdImages = [];
    try {
      for (let i of filteredArr) {
        const formData = new FormData();
        formData.append("photo", i);
        await axios
          .post("http://213.230.91.55:8130/photo", formData, {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "multipart/form-data",
            },
          })
          .then((response) =>{ createdImages.push(response.data.data[0].url)});
      }
    } catch (e) {
      console.error("Error to create image in server", e);
    } finally {
      console.log("Finnaly created imaage", createdImages);
    }
    return createdImages;
  };

  useEffect(() => {
    axios
      .get(`http://213.230.91.55:8130/v1/client/${slug}`, {
        headers: {
          "Accept-Language": "",
        },
      })
      .then((response) => {
        setClient(response.data.data);
      })
      .catch((error) => {
        console.error("Error to fetch clients", error);
      });
  }, [slug]);

  const languages = ["uz", "ru", "en"];

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
      logo: {
        ...client.logo,
        url: logoFile,
      },
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
  console.log("Client", client);

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

    const updatePhoto = async (a, id) => {
      const createdImages = [];
      try {
        const formData = new FormData();
        formData.append("new-photo", a);
        await axios
          .put(`http://213.230.91.55:8130/photo/${id}`, formData, {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "multipart/form-data",
            },
          })
          .then((response) => createdImages.push(response.data.data.url));
      } catch (e) {
        console.error("Error to UPDATE image in server", e);
        alert("Произошла ошибка при обновлении логотипа");
      } finally {
        console.log("Finnaly created imaage", createdImages);
      }
      console.log("UpdatedlOGO", createdImages)
      return createdImages;
    };

    const processClientLogo = async () => {
      if (client.logo instanceof File) {
        try {
          const clientLogo = await updatePhoto(client.logo.url, client.logo.id);
          console.log("ClientLOGGGo", clientLogo);
          client.logo = { url: clientLogo[0] };
        } catch (error) {
          console.error("Ошибка при обработке логотипа клиента:", error);
        }
      }
    };

    const processClientGallery = async () => {
      const galleryFiles = client.gallery.filter(
        (file) => file instanceof File
      );
      const existingGalleryItems = client.gallery.filter(
        (item) => !(item instanceof File)
      );

      if (galleryFiles.length > 0) {
        try {
          const uploadedUrls = await Promise.all(
            galleryFiles.map(async (file) => {
              const clientGallery = await createImageInServer([file]);
              return { url: clientGallery[0] };
            })
          );

          const updatedGallery = [
            ...existingGalleryItems,
            ...uploadedUrls,
          ].filter((item) => item.url); // Исключаем пустые объекты

          client.gallery = updatedGallery;
          console.log("Обновленная галерея:", client.gallery);
        } catch (error) {
          console.error("Ошибка при обработке галереи клиента:", error);
        }
      }
    };

    await processClientLogo();
    await processClientGallery();

    const json = JSON.stringify({
      ...client,
      location: client.location.id,
    });

    console.log("JSON", json);

    try {
      await axios.put("http://213.230.91.55:8130/v1/client", json, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (galleryDeleteList.length > 0) {
        for (const a of galleryDeleteList) {
          await axios.delete(`http://213.230.91.55:8130/photo/${a}`, {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          });
        }
      }

      setLoading(false);
      onClose(true);
    } catch (error) {
      console.error("Ошибка при сохранении клиента", error);
      alert(
        "Проблема в удалении фотографии, попробуйте еще раз или обратитесь к разработчику"
      );
      setLoading(false);
    }
  };

  if (!client) {
    return <div>Loading...</div>;
  }

  return (
    <div className="w-full h-screen fixed inset-0 bg-modalBg flex justify-center items-center z-[9999]">
      {loading && (
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
      )}
      <div className="w-[70%] h-[95%] overflow-y-scroll bg-white pt-8">
        <div className="w-full max-w-4xl mx-auto">
          <div className="mb-6">
            <div className="w-full flex justify-between items-center">
              <h2 className="text-2xl font-semibold mb-4">
                Информация о клиенте
              </h2>

              <button
                onClick={() => onClose(false)}
                className="text-redMain font-bold"
              >
                Закрыть
              </button>
            </div>
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
                value={client.description[activeLang] || ""} // Устанавливаем значение по умолчанию как пустую строку
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
              <LogoUploader logo={client.logo?.url} setLogo={setLogo} />
            </div>
            <div className="mb-4">
              <GalleryUploader
                setGalleryDeleteList={setGalleryDeleteList}
                gallery={client.gallery}
                setGallery={setGallery}
              />
            </div>
          </div>
          <button
            onClick={handleSave}
            className="px-8 py-3 text-lg border border-redMain font-bold text-redMain hover:bg-redMain hover:text-white transition-all"
          >
            Сохранить
          </button>
          <button
            onClick={() => onClose(false)}
            className="px-8 py-3 text-lg border ml-8 border-redMain font-bold hover:bg-white hover:text-redMain bg-redMain text-white transition-all"
          >
            Отмена
          </button>
        </div>
      </div>
    </div>
  );
};

export default ClientsInfo;
