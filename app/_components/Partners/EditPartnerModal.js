"use client";
import { useState, useEffect } from "react";
import globus from "@/public/images/aboutUs/partners/globus.svg";
import Image from "next/image";
import { DNA } from "react-loader-spinner";
import axios from "axios";

export default function PartnersInfo({ slug, onClose }) {
  const [activeItem, setActiveItem] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeLang, setActiveLang] = useState("uz");
  const [modalOpen, setModalOpen] = useState(false);

  useEffect(() => {
    setLoading(true);
    axios
      .get(`http://213.230.91.55:8130/v1/partner/${slug}`, {
        headers: {
          "Accept-Language": "",
        },
      })
      .then((response) => {
        setActiveItem(response.data.data);
      })
      .catch((error) => {
        console.error("Error fetching partner data", error);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [slug]);

  const handleInputChange = (field, value) => {
    setActiveItem((prevItem) => ({
      ...prevItem,
      [field]: value,
    }));
  };

  const handleNoteChange = (lang, value) => {
    setActiveItem((prevItem) => ({
      ...prevItem,
      note: {
        ...prevItem.note,
        [lang]: value,
      },
    }));
  };

  const handleAboutChange = (lang, value) => {
    setActiveItem((prevItem) => ({
      ...prevItem,
      about: {
        ...prevItem.about,
        [lang]: value,
      },
    }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setActiveItem((prevItem) => ({
        ...prevItem,
        logo: {
          ...prevItem.logo,
          url: file,
        },
      }));
    }
  };

  const handleDeleteImage = () => {
    setActiveItem((prevItem) => ({
      ...prevItem,
      logo: {
        ...prevItem.logo,
        url: "",
      },
    }));
  };

  const formattedWebsite = activeItem?.website?.replace(
    /^https?:\/\/([^\/]+).*/,
    "$1"
  );

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

    if (activeItem.logo.url instanceof File) {
      const formData = new FormData();
      formData.append("new-photo", activeItem.logo.url);
      await axios
        .put(
          `http://213.230.91.55:8130/photo/${activeItem.logo.id}`,
          formData,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "multipart/form-data",
            },
          }
        )
        .then((response) => {
          setActiveItem((prevItem) => {
            return {
              ...prevItem,
              logo: {
                ...prevItem.logo,
                url: response.data.data.url,
              },
            };
          });
        })
        .catch((error) => console.error("Error uploading logo", error));
    }

    
  };

  console.log(activeItem);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!activeItem) {
    return <div>Error loading partner data</div>;
  }

  return (
    <div className="fixed inset-0 h-screen w-full bg-modalBg z-[9999] flex justify-center items-center">
      {loading && (
        <div className="fixed h-screen w-full inset-0 flex justify-center items-center bg-subModal z-[9999]">
          <DNA
            visible={true}
            height="120"
            width="120"
            ariaLabel="dna-loading"
          />
        </div>
      )}
      <div className="w-full max-w-[1000px] h-[95%] overflow-y-scroll bg-white px-4 py-12 rounded-3xl no-scrollbar flex flex-col gap-12">
        <div className="w-full flex justify-between">
          <div className="flex gap-4">
            {["uz", "ru", "en"].map((lang, index) => (
              <button
                key={index}
                className={`font-medium border px-4 py-2 rounded-lg text-xl border-red-300 ${
                  lang === activeLang ? "bg-redMain text-white" : ""
                }`}
                onClick={() => setActiveLang(lang)}
              >
                {lang.toUpperCase()}
              </button>
            ))}
          </div>
          <button
            onClick={() => onClose(true)}
            className="text-2xl font-semibold text-redMain"
          >
            Закрыть
          </button>
        </div>

        <div className="mx-full px-4">
          <div className="border-b pb-[25px]">
            <h1 className="text-[25px] mdx:text-[30px] mdl:text-[35px] xl:text-[50px] font-semibold mb-2">
              {activeItem.name}
            </h1>

            <h2 className="text-[12px] max-w-[820px] mdx:text-[16px] text-[#808080] font-semibold mb-4">
              {activeItem.note[activeLang]}
            </h2>
            <p className="whitespace-pre-line mt-[20px] xl:mt-[40px] text-[15px] mdx:text-[18px] mdl:text-[18px]">
              {activeItem.about[activeLang]}
            </p>
          </div>
          <div className="flex flex-row justify-between items-center h-auto mt-[20px]">
            <a
              href={activeItem.website}
              className="bg-[#FCE8E9] py-[15px] px-[20px] mdx:py-[20px] xl:px-[20px] h-full rounded-md flex items-center text-[14px] mdx:text-[16px] mdl:text-[18px] xl:text-[20px] text-[#E31E24]"
            >
              <Image
                src={globus}
                alt="Icon"
                width={24}
                height={24}
                className="mr-2"
              />
              {formattedWebsite}
            </a>
            <div className="w-auto h-auto relative max-w-[110px] mdx:max-w-[224px]">
              {activeItem.logo.url && (
                <Image
                  src={
                    activeItem.logo.url instanceof File
                      ? URL.createObjectURL(activeItem.logo.url)
                      : activeItem.logo.url
                  }
                  alt={activeItem.name}
                  width={224}
                  height={224}
                  objectFit="contain"
                />
              )}
            </div>
          </div>
          <button
            onClick={() => setModalOpen(true)}
            className="px-12 py-3 text-white bg-red-500 mt-8"
          >
            Редактировать
          </button>
        </div>

        {modalOpen && (
          <div className="fixed inset-0 h-screen w-full bg-modalBg flex justify-center items-center">
            <div className="w-full max-w-[500px] relative flex flex-col gap-8 px-4 bg-white py-8">
              <button
                onClick={() => setModalOpen(false)}
                className="absolute top-2 right-2 text-2xl font-bold"
              >
                X
              </button>
              <div className="flex gap-4">
                {["uz", "ru", "en"].map((lang, index) => (
                  <button
                    key={index}
                    className={`font-medium border px-4 pt-1 pb-2 rounded-lg text-xl border-red-300 ${
                      lang === activeLang ? "bg-redMain text-white" : ""
                    }`}
                    onClick={() => setActiveLang(lang)}
                  >
                    {lang.toUpperCase()}
                  </button>
                ))}
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">
                  Название
                </label>
                <input
                  type="text"
                  value={activeItem.name}
                  onChange={(e) => handleInputChange("name", e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">
                  Заметка
                </label>
                <textarea
                  value={activeItem.note[activeLang]}
                  onChange={(e) => handleNoteChange(activeLang, e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">
                  О партнёре
                </label>
                <textarea
                  value={activeItem.about[activeLang]}
                  onChange={(e) =>
                    handleAboutChange(activeLang, e.target.value)
                  }
                  className="w-full p-2 border border-gray-300 rounded"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">
                  Вебсайт
                </label>
                <input
                  type="text"
                  value={activeItem.website}
                  onChange={(e) => handleInputChange("website", e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded"
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium mb-2">Фото</label>
                <div className="flex gap-2">
                  {activeItem.logo.url && (
                    <div className="relative">
                      <Image
                        src={
                          activeItem.logo.url instanceof File
                            ? URL.createObjectURL(activeItem.logo.url)
                            : activeItem.logo.url
                        }
                        alt="Фото партнёра"
                        width={80}
                        height={80}
                      />
                      <button
                        onClick={handleDeleteImage}
                        className="absolute top-0 right-0 bg-red-500 text-white rounded-full p-1"
                      >
                        X
                      </button>
                    </div>
                  )}
                  <label className="cursor-pointer flex items-center justify-center w-20 h-20 border border-dashed border-gray-300 rounded">
                    <span className="text-xl">+</span>
                    <input
                      type="file"
                      className="hidden"
                      onChange={handleImageChange}
                    />
                  </label>
                </div>
              </div>
              <div>
                <button
                  className="px-12 py-3 border border-redMain text-redMain"
                  onClick={handleSave}
                >
                  Сохранить
                </button>
                <button
                  className="px-12 py-3 bg-redMain ml-4 text-white"
                  onClick={() => setModalOpen(false)}
                >
                  Отмена
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
