"use client";
import { useState } from "react";
import Image from "next/image";
import axios from "axios";
import closeIcon from "@/public/svg/close.svg";
import addIcon from "@/public/svg/add-icon.svg";
import arrowred from "@/public/svg/Delete.svg";

export default function SliderModal({onClose}) {
    const [slides, setSlides] = useState([
        { name: { uz: "", ru: "", en: "" }, photo: null }
    ]);
    const [showError, setShowError] = useState(false);
    const [showSuccess, setShowSuccess] = useState(false);
    const [language, setLanguage] = useState("uz"); // Default language is Uzbek

    
    const handleCreate = async () => {
        const authFormData = new FormData();
        authFormData.append("username", "nasiniemsin");
        authFormData.append("password", "2x2=xx");

        try {
            const authResponse = await axios.post(
                "http://213.230.91.55:8130/v1/auth/login",
                authFormData
            );

            const token = authResponse.data.data.token;

            for (const slide of slides) {
                const formData = new FormData();

                const jsonData = {
                    name: slide.name,
                    active: true,
                    orderNum: -1,
                };

                formData.append("json", JSON.stringify(jsonData));

                if (slide.photo) {
                    formData.append("photo", slide.photo);
                }

                const response = await axios.post(
                    `https://imed.uz/api/v1/complex-e`,
                    formData,
                    {
                        headers: {
                            Authorization: `Bearer ${token}`,
                            "Content-Type": "multipart/form-data",
                            "Accept-Language": language,
                        },
                    }
                );

                if (response.status !== 200) {
                    setShowError(true);
                    return;
                }
            }

            setShowSuccess(true);
            setTimeout(() => {
                setShowSuccess(false);
                closeModal();
            }, 3000);

        } catch (error) {
            console.error("Error creating items:", error);
            setShowError(true);
        }
    };

    const [showModal, setShowModal] = useState(true);

    const addSlide = () => {
        setSlides([...slides, { name: { uz: "", ru: "", en: "" }, photo: null }]);
    };

    const handleNameChange = (index, value) => {
        const newSlides = [...slides];
        newSlides[index].name[language] = value; // Set the value based on the selected language
        setSlides(newSlides);
    };

    const handlePhotoChange = (index, photo) => {
        const newSlides = [...slides];
        newSlides[index].photo = photo;
        setSlides(newSlides);
    };

    const removeSlide = (index) => {
        const newSlides = slides.filter((_, i) => i !== index);
        setSlides(newSlides);
    };

    const closeModal = () => {
        setShowModal(false);
    };

    if (!showModal) {
        return null;
    }

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-[999]">
            <div
                className="bg-white w-full max-w-[75%] h-[90%] rounded-lg p-8 relative overflow-y-auto"
                style={{
                    scrollbarWidth: "none", // Firefox
                    msOverflowStyle: "none", // IE 10+
                }}
            >
                <button
                    className="absolute top-4 right-4 text-gray-500 hover:text-red-500"
                    onClick={onClose}
                >
                    <Image src={closeIcon} alt="Close" width={25} height={25} />
                </button>
                <h2 className="text-2xl font-semibold mb-6">Слайдер - добавить</h2>
                <div className="mb-6 flex space-x-4">
                    <button
                        onClick={() => setLanguage('uz')}
                        className={`px-3 py-2 rounded-md ${language === 'uz' ? 'bg-red-500 text-white' : 'bg-gray-300 text-black'}`}
                    >
                        UZ
                    </button>
                    <button
                        onClick={() => setLanguage('ru')}
                        className={`px-3 py-2 rounded-md ${language === 'ru' ? 'bg-red-500 text-white' : 'bg-gray-300 text-black'}`}
                    >
                        RU
                    </button>
                    <button
                        onClick={() => setLanguage('en')}
                        className={`px-3 py-2 rounded-md ${language === 'en' ? 'bg-red-500 text-white' : 'bg-gray-300 text-black'}`}
                    >
                        EN
                    </button>
                </div>
                {slides.map((slide, index) => (
                    <div key={index} className="relative border-b border-gray-300 pb-6 mb-6">
                        <button
                            className="absolute top-2 right-2 text-gray-500 hover:text-red-500"
                            onClick={() => removeSlide(index)}
                        >
                            <Image src={closeIcon} alt="Close" width={20} height={20} />
                        </button>
                        <label className="block mb-2">
                            Название кейса/клиента ({language.toUpperCase()})
                            <input
                                type="text"
                                value={slide.name[language]}
                                onChange={(e) => handleNameChange(index, e.target.value)}
                                className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
                            />
                        </label>
                        <label className="block mb-2">
                            Фото
                            <input
                                type="file"
                                onChange={(e) => handlePhotoChange(index, e.target.files[0])}
                                className="mt-1 block w-full"
                            />
                            {slide.photo && (
                                <div className="relative mt-2 w-full max-w-sm">
                                    <Image
                                        src={URL.createObjectURL(slide.photo)}
                                        alt="Фото"
                                        width={300}
                                        height={200}
                                        className="rounded-md"
                                    />
                                    <button
                                        className="absolute top-1 right-[90px] "
                                        onClick={() => handlePhotoChange(index, null)}
                                    >
                                        <Image src={arrowred} alt="remove" quality={100} width={25} height={25} />
                                    </button>
                                </div>
                            )}
                        </label>
                    </div>
                ))}
                <button onClick={addSlide} className="flex items-center text-red-500 mb-6">
                    <Image src={addIcon} alt="Add" width={20} height={20} />
                    <span className="ml-2">Добавить слайдер</span>
                </button>
                <div className='flex justify-end'>
                    <button onClick={handleCreate} className="w-full bg-red-500 text-white py-3 max-w-[223px]">Готово</button>
                </div>
                {showError && <p className="text-red-500">Произошла ошибка при создании</p>}
                {showSuccess && <p className="text-green-500">Слайдер успешно создан</p>}
            </div>
        </div>
    );
}
