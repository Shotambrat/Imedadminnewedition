"use client";
import { useState, useEffect } from "react";
import Image from "next/image";
import closeIcon from "@/public/svg/close.svg";
import addIcon from "@/public/svg/add-icon.svg";
import arrowred from "@/public/svg/Delete.svg";
import axios from "axios";

export default function SliderModal({ onClose }) {
  const [slides, setSlides] = useState([]);
  const [deletedSlides, setDeletedSlides] = useState([]);
  const [language, setLanguage] = useState("ru"); // Default language is Russian
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Fetch existing slides based on the selected language
  useEffect(() => {
    const fetchSlides = async () => {
      try {
        const response = await axios.get("http://213.230.91.55:8130/v1/complex-e", {
          headers: {
            "Accept-Language": "",
          },
        });

        console.log("Response data:", response.data.data); // Выводим данные для проверки

        setSlides(
          response.data.data.map((item) => {
            if (!item.name || !item.name.uz || !item.name.ru || !item.name.en) {
              console.warn("Missing name fields:", item);
            }
            return {
              id: item.id || null,
              name: {
                uz: item.name.uz || "",
                ru: item.name.ru || "",
                en: item.name.en || "",
              },
              photo: item.photo?.url || "",
              photoId: item.photo?.id || null, // Store the photo id for updating
            };
          })
        );

      } catch (error) {
        console.error("Error fetching slides:", error);
      }
    };

    fetchSlides();
  }, []);

  const addSlide = () => {
    setSlides([...slides, { id: null, name: { uz: "", ru: "", en: "" }, photo: "", photoId: null }]);
  };

  const handleChange = (index, key, value) => {
    const newSlides = [...slides];
    newSlides[index].name = {
      ...newSlides[index].name,
      [language]: value,
    };
    setSlides(newSlides);
  };

  const handleFileChange = (index, file) => {
    const newSlides = [...slides];

    if (file instanceof File) {
      const photoUrl = URL.createObjectURL(file);
      newSlides[index].photo = photoUrl;  // Set the image preview
      newSlides[index].file = file;       // Store the actual file for the update request
    } else {
      console.error('Invalid file type. Expected a File instance.');
    }

    setSlides(newSlides);
  };


  const updatePhoto = async (slide) => {
    const authFormData = new FormData();
    authFormData.append("username", "nasiniemsin");
    authFormData.append("password", "2x2=xx");

    try {
      const authResponse = await axios.post("http://213.230.91.55:8130/v1/auth/login", authFormData);
      const token = authResponse.data.data.token;

      if (slide.file) {
        const formData = new FormData();
        formData.append("new-photo", slide.file); // Add the new photo file

        await axios.put(`http://213.230.91.55:8130/photo/${slide.photoId}`, formData, {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        });

        console.log(`Photo ${slide.photoId} updated successfully`);
      }
    } catch (error) {
      console.error("Error updating photo:", error);
    }
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);

    try {
      const authFormData = new FormData();
      authFormData.append("username", "nasiniemsin");
      authFormData.append("password", "2x2=xx");

      const authResponse = await axios.post("http://213.230.91.55:8130/v1/auth/login", authFormData);
      const token = authResponse.data.data.token;

      for (const slide of slides) {
        if (slide.file) {
          await updatePhoto(slide); // Update the photo if it was changed
        }

        const slideData = {
          id: slide.id,
          name: {
            uz: slide.name.uz,
            ru: slide.name.ru,
            en: slide.name.en,
          },
          photo: slide.photo ? { id: slide.photoId, url: slide.photo } : null,
        };

        await axios.put("http://213.230.91.55:8130/v1/complex-e", slideData, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        console.log(`Slide ${slide.id || "new"} updated/created successfully`);
      }
    } catch (error) {
      console.error("Error in handleSubmit:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const removeImage = (index) => {
    const newSlides = [...slides];
    newSlides[index].photo = ""; // Remove the image preview
    newSlides[index].file = null; // Remove the file if it exists
    setSlides(newSlides);
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-[999]">
      <div
        className="bg-white w-full max-w-[75%] h-[90%] rounded-lg p-8 relative overflow-y-auto"
        style={{
          scrollbarWidth: "none",
          msOverflowStyle: "none",
        }}
      >
        <div className="absolute top-4 left-[40%] flex space-x-4">
          <button
            onClick={() => setLanguage("uz")}
            className={`px-3 py-2 rounded-md ${language === "uz" ? "bg-red-500 text-white" : "bg-gray-300 text-black"}`}
          >
            UZ
          </button>
          <button
            onClick={() => setLanguage("ru")}
            className={`px-3 py-2 rounded-md ${language === "ru" ? "bg-red-500 text-white" : "bg-gray-300 text-black"}`}
          >
            RU
          </button>
          <button
            onClick={() => setLanguage("en")}
            className={`px-3 py-2 rounded-md ${language === "en" ? "bg-red-500 text-white" : "bg-gray-300 text-black"}`}
          >
            EN
          </button>
        </div>

        <button
          className="absolute top-4 right-4 text-gray-500 hover:text-red-500"
          onClick={onClose}
        >
          <Image src={closeIcon} alt="Close" width={25} height={25} />
        </button>
        <h2 className="text-2xl font-semibold mb-6">Слайдер - редактировать</h2>
        {slides.map((slide, index) => (
          <div key={index} className="relative border-b border-gray-300 pb-7 mb-[60px]">
            <button
              className="absolute top-[-20px] right-2 text-gray-500 hover:text-red-500"
              onClick={() => removeSlide(index)}
            >
              <Image src={closeIcon} alt="Close" width={22} height={22} />
            </button>
            <div className="w-full">
              <label className="mb-2 flex flex-row justify-between items-center text-[18px]">
                Название кейса/клиента
                <input
                  type="text"
                  value={slide.name[language] || ""}
                  onChange={(e) => handleChange(index, "name", e.target.value)}
                  className="mt-1 block w-[70%] p-3 border border-gray-300 rounded-xl"
                />
              </label>
            </div>
            <div className="w-full">
              <label className="flex flex-row gap-[26.5%] mb-2 text-[18px]">
                Фото
                {!slide.photo && (
                  <input
                    type="file"
                    onChange={(e) => handleFileChange(index, e.target.files[0])}
                    className="mt-1 block w-full"
                  />
                )}
                {slide.photo && (
                  <div className="relative mt-2 w-full max-w-sm">
                    <Image
                      src={slide.photo}
                      alt="Фото"
                      width={300}
                      height={200}
                      className="rounded-md"
                    />
                    <button
                      className="absolute top-2 right-[95px]"
                      onClick={() => removeImage(index)}
                    >
                      <Image src={arrowred} alt="remove" width={25} height={25} />
                    </button>
                  </div>
                )}
              </label>
            </div>
          </div>
        ))}
        <div className="flex justify-end">
          <button
            onClick={handleSubmit}
            disabled={isSubmitting}
            className={`w-full py-3 max-w-[223px] ${isSubmitting ? "bg-gray-400" : "bg-red-500"} text-white`}
          >
            {isSubmitting ? "Обновление..." : "Готово"}
          </button>
        </div>
      </div>
    </div>
  );
}
