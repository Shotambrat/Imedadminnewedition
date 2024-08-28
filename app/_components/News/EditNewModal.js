import React, { useState, useEffect } from "react";
import Image from "next/image";
import axios from "axios";
import { DNA } from "react-loader-spinner";

export default function NewsInfo({ slug, onClose }) {
  const [activeItem, setActiveItem] = useState(null);
  const [activeLang, setActiveLang] = useState("uz");
  const [loading, setLoading] = useState(false);
  const [headModal, setHeadModal] = useState(false);
  const [optionModal, setOptionModal] = useState(false);

  const languages = ["uz", "ru", "en"];

  useEffect(() => {
    setLoading(true);
    axios
      .get(`http://213.230.91.55:8130/v1/new/get/${slug}`, {
        headers: {
          "Accept-Language": "",
        },
      })
      .then((response) => {
        setActiveItem(response.data.data);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching news data", error);
        setLoading(false);
      });
  }, [slug]);

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    const images = files.map((file) => file);

    setActiveItem((prevItem) => ({
      ...prevItem,
      head: {
        ...prevItem.head,
        photo: {
          ...prevItem.head.photo,
          url: images[0],
        },
      },
    }));
  };

  const handleDeleteImage = () => {
    setActiveItem((prevItem) => ({
      ...prevItem,
      head: {
        ...prevItem.head,
        photo: {
          ...prevItem.head.photo,
          url: null,
        },
      },
    }));
  };

  const handleOptionChange = (index, field, value) => {
    setActiveItem((prevItem) => ({
      ...prevItem,
      newOptions: prevItem.newOptions.map((option, i) =>
        i === index
          ? {
              ...option,
              [field]: {
                ...option[field],
                [activeLang]: value,
              },
            }
          : option
      ),
    }));
  };

  const handleOptionImageChange = (index, e) => {
    const files = Array.from(e.target.files);
    const images = files.map((file) => file);

    setActiveItem((prevItem) => ({
      ...prevItem,
      newOptions: prevItem.newOptions.map((option, i) =>
        i === index
          ? {
              ...option,
              photo: {
                ...option.photo || [],
                url: option.photo?.url || images[0],
              },
            }
          : option
      ),
    }));
  };

  const handleDeleteOptionImage = (optionIndex) => {
    setActiveItem((prevItem) => ({
      ...prevItem,
      newOptions: prevItem.newOptions.map((option, i) =>
        i === optionIndex
          ? {
              ...option,
              photo: null,
            }
          : option
      ),
    }));
  };

  const handleDeleteOption = (index) => {
    setActiveItem((prevItem) => ({
      ...prevItem,
      newOptions: prevItem.newOptions.filter((_, i) => i !== index),
    }));
  };

  const handleAddOption = () => {
    const newOption = {
      heading: {
        uz: "",
        ru: "",
        en: "",
      },
      text: {
        uz: "",
        ru: "",
        en: "",
      },
      photo: {url: null},
      orderNum: activeItem.newOptions.length + 1,
    };

    setActiveItem((prevItem) => ({
      ...prevItem,
      newOptions: [...prevItem.newOptions, newOption],
    }));
  };

  console.log("ACtiveNews", activeItem);

  const handleSave = async () => {
    setLoading(true);
    const authFormData = new FormData();
    authFormData.append("username", "nasiniemsin");
    authFormData.append("password", "2x2=xx");
    const authResponse = await axios.post(
      "http://213.230.91.55:8130/v1/auth/login",
      authFormData
    );

    try {
      
    } catch (error) {
      
    }

    const token = authResponse.data.data.token;
  }

  if (loading || !activeItem) {
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
  }

  return (
    <div className="w-full flex items-center justify-center gap-12 fixed inset-0 h-screen bg-modalBg z-[9999]">
      <div className="w-[80%] h-[95%] bg-white overflow-y-scroll p-24 rounded-3xl">
        {headModal && (
          <div className="fixed bg-modalBg inset-0 flex justify-center items-center">
            <div className="max-w-[800px] w-full relative bg-white rounded-lg shadow-lg p-6">
              <button
                onClick={() => setHeadModal(false)}
                className="top-10 right-10 absolute text-2xl font-bold"
              >
                X
              </button>
              <div className="bg-snowy py-4 px-4 mb-4 text-2xl font-semibold">
                Редактировать блок
              </div>
              <div className="flex gap-4 mb-4">
                {languages.map((lang, index) => (
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
              <div className="w-full py-4">
                <div className="mb-4">
                  <label className="block text-sm font-medium mb-2">
                    Заголовок
                  </label>
                  <input
                    type="text"
                    value={activeItem.head.heading[activeLang]}
                    onChange={(e) =>
                      setActiveItem((prevItem) => ({
                        ...prevItem,
                        head: {
                          ...prevItem.head,
                          heading: {
                            ...prevItem.head.heading,
                            [activeLang]: e.target.value,
                          },
                        },
                      }))
                    }
                    className="w-full p-2 border border-gray-300 rounded"
                  />
                </div>
                <div className="mb-4">
                  <label className="block text-sm font-medium mb-2">
                    Текст
                  </label>
                  <textarea
                    value={activeItem.head.text[activeLang]}
                    onChange={(e) =>
                      setActiveItem((prevItem) => ({
                        ...prevItem,
                        head: {
                          ...prevItem.head,
                          text: {
                            ...prevItem.head.text,
                            [activeLang]: e.target.value,
                          },
                        },
                      }))
                    }
                    className="w-full p-2 border border-gray-300 rounded"
                    rows="4"
                  />
                </div>
                <div className="mb-4">
                  <label className="block text-sm font-medium mb-2">
                    Фото (необязательно)
                  </label>
                  <div className="flex gap-2">
                    {activeItem.head.photo.url != null ? (
                      <div className="relative">
                        <Image
                          src={
                            activeItem.head.photo.url instanceof File
                              ? URL.createObjectURL(activeItem.head.photo.url)
                              : activeItem.head.photo.url
                          }
                          alt={`Фото`}
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
                    ) : (
                      <label className="cursor-pointer flex items-center justify-center w-20 h-20 border border-dashed border-gray-300 rounded">
                        <span className="text-xl">+</span>
                        <input
                          type="file"
                          className="hidden"
                          onChange={handleImageChange}
                        />
                      </label>
                    )}
                  </div>
                </div>
                <div className="flex justify-end gap-4 mt-6">
                  <button
                    onClick={() => setHeadModal(false)}
                    className="py-2 px-4 bg-gray-300 text-black rounded"
                  >
                    Отмена
                  </button>
                  <button
                    onClick={handleSave}
                    className="py-2 px-4 bg-blue-500 text-white rounded"
                  >
                    Сохранить
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {optionModal && (
          <div className="fixed bg-modalBg inset-0 flex justify-center items-center">
            <div className="max-w-[800px] w-full h-[90%] overflow-y-scroll no-scrollbar relative bg-white rounded-lg shadow-lg p-6">
              <button
                onClick={() => setOptionModal(false)}
                className="top-4 right-4 absolute text-2xl font-bold"
              >
                X
              </button>
              <div className="bg-snowy py-4 px-4 text-2xl font-semibold">
                Редактировать блок опций
              </div>
              <div className="flex gap-4 mb-4 mt-4">
                {languages.map((lang, index) => (
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
              {activeItem.newOptions.map((option, index) => (
                <div key={index} className="w-full py-4">
                  <div className="mb-4">
                    <label className="block text-sm font-medium mb-2">
                      Заголовок опции
                    </label>
                    <input
                      type="text"
                      value={option.heading[activeLang]}
                      onChange={(e) =>
                        handleOptionChange(index, "heading", e.target.value)
                      }
                      className="w-full p-2 border border-gray-300 rounded"
                    />
                  </div>
                  <div className="mb-4">
                    <label className="block text-sm font-medium mb-2">
                      Текст опции
                    </label>
                    <textarea
                      value={option.text[activeLang]}
                      onChange={(e) =>
                        handleOptionChange(index, "text", e.target.value)
                      }
                      className="w-full p-2 border border-gray-300 rounded"
                      rows="4"
                    />
                  </div>
                  <div className="mb-4">
                    <label className="block text-sm font-medium mb-2">
                      Фото опции (необязательно)
                    </label>
                    <div className="flex gap-2">
                      {option.photo?.url ? (
                        <div className="relative">
                          <Image
                            src={option.photo.url instanceof File ? URL.createObjectURL(option.photo.url) : option.photo.url}
                            alt={`Фото опции ${index}`}
                            width={80}
                            height={80}
                          />
                          <button
                            onClick={() => handleDeleteOptionImage(index)}
                            className="absolute top-0 right-0 bg-red-500 text-white rounded-full p-1"
                          >
                            X
                          </button>
                        </div>
                      ) : (
                        <label className="cursor-pointer flex items-center justify-center w-20 h-20 border border-dashed border-gray-300 rounded">
                          <span className="text-xl">+</span>
                          <input
                            type="file"
                            className="hidden"
                            multiple
                            onChange={(e) => handleOptionImageChange(index, e)}
                          />
                        </label>
                      )}
                    </div>
                  </div>
                  <hr className="border-4 border-red-400" />
                </div>
              ))}
              <div className="flex justify-end gap-4 mt-6">
                <button
                  onClick={() => setOptionModal(false)}
                  className="py-2 px-4 bg-gray-300 text-black rounded"
                >
                  Отмена
                </button>
                <button
                  onClick={handleSave}
                  className="py-2 px-4 bg-blue-500 text-white rounded"
                >
                  Сохранить
                </button>
              </div>
            </div>
          </div>
        )}

        <div className="flex w-full justify-between">
          <div className="flex gap-4">
            {languages.map((lang, index) => (
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
            className="text-redMain text-2xl"
            onClick={() => onClose(false)}
          >
            Закрыть
          </button>
        </div>
        <div className="max-w-[800px] w-full mx-auto flex flex-col gap-8">
          <div className="w-full flex flex-col gap-2 items-start">
            <h1 className="text-4xl font-semibold">
              {activeItem.head.heading[activeLang]}
            </h1>
            <p className="whitespace-pre-line">
              {activeItem.head.text[activeLang]}
            </p>
            {activeItem.head.photo.url && (
              <div className="w-full flex gap-2">
                <Image
                  src={
                    activeItem.head.photo.url instanceof File
                      ? URL.createObjectURL(activeItem.head.photo.url)
                      : activeItem.head.photo.url
                  }
                  alt={`Фото`}
                  width={1000}
                  height={1000}
                  className="w-full mt-8"
                />
              </div>
            )}
            <button
              onClick={() => setHeadModal(true)}
              className="px-12 py-3 text-white bg-rose-500 rounded"
            >
              Редактировать
            </button>
          </div>

          {activeItem.newOptions.map((option, index) => (
            <div
              key={index}
              className="w-full flex flex-col gap-2 mb-8 items-start"
            >
              <h2 className="text-xl font-semibold mb-2">
                {option.heading[activeLang]}
              </h2>
              <p className="whitespace-pre-line">{option.text[activeLang]}</p>
              {option.photo?.url && (
                <div className="w-full flex gap-2">
                  <Image
                    src={option.photo.url instanceof File ? URL.createObjectURL(option.photo.url): option.photo.url}
                    alt={`Фото опции ${index}`}
                    width={1000}
                    height={1000}
                    className="w-full rounded-3xl"
                  />
                </div>
              )}
              <button
                onClick={() => handleDeleteOption(index)}
                className="bg-red-500 text-white px-4 py-2 rounded"
              >
                Удалить
              </button>
            </div>
          ))}
          <div className="flex gap-4">
            <button
              onClick={() => setOptionModal(true)}
              className="px-12 py-3 text-white bg-rose-500 rounded"
            >
              Редактировать опции
            </button>

            <button
              onClick={handleAddOption}
              className="px-12 py-3 text-redMain border border-redMain rounded"
            >
              Добавить опцию
            </button>
          </div>
        </div>
        <div className="mt-12 flex gap-5">
          <button
            // onClick={handleSave}
            className="py-3 text-lg px-4 bg-green-400 font-semibold text-white shadow-xl rounded"
          >
            Сохранить
          </button>
          <button
            onClick={() => onClose(false)}
            className="px-8 py-3 border border-redMain text-lg text-redMain font-semibold"
          >
            Отмена
          </button>
        </div>
      </div>
    </div>
  );
}
