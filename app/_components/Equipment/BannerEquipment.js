"use client";
import { useState, useRef, useEffect } from "react";
import Image from "next/image";
import Slider from "react-slick";
import axios from "axios";
import Left from "@/public/svg/arrowLeftWhite.svg";
import Right from "@/public/svg/arrowRightWhite.svg";
import EditBanner from "./EditBanner";
import AddBanner from "./AddBanner";
import AskaQuestion from "@/app/_components/Modal/AskaQuestion";

export default function BannerCarousel() {
    const sliderRef = useRef(null);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false); // Separate state for Edit Banner
    const [isAddModalOpen, setIsAddModalOpen] = useState(false); // Separate state for Add Banner
    const [equipment, setEquipment] = useState([]); // Store data from API

    // Handle modal open and close for editing banner
    const handleOpenEditModal = () => {
        setIsEditModalOpen(true);
    };
    const handleCloseEditModal = () => {
        setIsEditModalOpen(false);
    };

    // Handle modal open and close for adding banner
    const handleOpenAddModal = () => {
        setIsAddModalOpen(true);
    };
    const handleCloseAddModal = () => {
        setIsAddModalOpen(false);
    };

    // Fetch data from API
    useEffect(() => {
        axios("https://imed.uz/api/v1/complex-e", {
            headers: {
                "Accept-Language": "uz",
            },
        }).then((response) => {
            setEquipment(response.data.data); // Store response data
        });
    }, []);

    // Slider settings
    const settings = {
        infinite: true,
        speed: 500,
        slidesToShow: 1,
        slidesToScroll: 1,
        autoplay: true,
        autoplaySpeed: 7000,
        dots: true, // Enable dots navigation
        arrows: false, // Disable built-in arrows
        beforeChange: (oldIndex, newIndex) => setCurrentSlide(newIndex),
    };

    const [currentSlide, setCurrentSlide] = useState(0);

    const nextSlide = () => {
        sliderRef.current.slickNext();
    };

    const prevSlide = () => {
        sliderRef.current.slickPrev();
    };

    const [isAskaQuestionModalOpen, setIsAskaQuestionModalOpen] = useState(false);

    const openAskaQuestionModal = () => setIsAskaQuestionModalOpen(true);
    const closeAskaQuestionModal = () => setIsAskaQuestionModalOpen(false);

    return (
        <div className="relative w-full max-w-[1440px] mx-auto overflow-hidden">
            <div className="flex flex-col xl:flex-row bg-white overflow-hidden">
                <div className="xl:w-[50%] flex flex-col justify-center p-4 text-white">
                    <h1 className="text-[25px] mdx:text-[35px] mdl:text-[40px] font-semibold text-[#E31E24]">
                        КОМПЛЕКСНОЕ <br />
                        <span className="text-black">ОСНАЩЕНИЕ КЛИНИК</span>
                    </h1>
                    <p className="mt-2 text-[#808080] text-[15px] mdx:text-[20px]">
                        Полное решение для оснащения <br /> медицинских учреждений
                    </p>
                    <button
                        className="mt-4 bg-[#E94B50] text-[white] text-[14px] mdx:text-[16px] font-semibold py-[14px] mdx:py-[15.5px] px-4 w-[224px] mb-[25px]"
                        onClick={openAskaQuestionModal}
                    >
                        Заказать установку
                    </button>
                </div>
                <div className="xl:w-[50%] relative max-h-[812px]">
                    <Slider ref={sliderRef} {...settings}>
                        {equipment.map((item, index) => (
                            <div key={index} className="min-w-full flex justify-center relative">
                                <Image
                                    src={item.photo?.url}
                                    alt={item.name}
                                    width={2000}
                                    height={1000}
                                    className="w-full h-auto object-cover 3xl:h-[712px]"
                                />
                                {/* Add Edit and Add Banner buttons */}
                                <div className="absolute inset-0 flex justify-center items-center space-x-4">
                                    <button
                                        onClick={handleOpenAddModal}
                                        className="bg-green-500 text-white px-4 py-2 rounded"
                                    >
                                        Add Banner
                                    </button>
                                    <button
                                        onClick={handleOpenEditModal}
                                        className="bg-yellow-500 text-white px-4 py-2 rounded"
                                    >
                                        Edit Banner/
                                        Delete
                                    </button>
                                </div>
                            </div>
                        ))}
                    </Slider>
                    <div className="absolute bottom-0 flex flex-row items-center ml-[10px] mdx:ml-[30px] mb-[20px] xl:mb-[30px]">
                        <div className="text-[#fff] lh text-[20px] max-w-[160px] md:max-w-[200px] mdx:max-w-[250px] mdl:max-w-[320px] md:text-[25px] mdx:text-[30px] mdl:text-[35px] xl:text-[30px] xl:max-w-[230px] 2xl:max-w-[270px] 3xl:max-w-[340px] 3xl:text-[40px]">
                            {equipment[currentSlide]?.name || 'Оснащение Vitamed Medical'}
                        </div>
                    </div>

                    <div className="absolute inset-y-0 right-0 flex items-center justify-center space-x-2 pr-9 bottom-[-570px]">
                        <button
                            onClick={prevSlide}
                            className="transform p-1 opacity-70 hover:opacity-100 z-10 w-[45px] md:w-[50px] mdx:w-[60px] mdl:w-[70px] 3xl:w-[80px] bottom-10"
                        >
                            <Image
                                src={Left}
                                width={50}
                                height={50}
                                className="w-full h-auto"
                            />
                        </button>
                        <button
                            onClick={nextSlide}
                            className="transform p-1 opacity-70 hover:opacity-100 z-10 w-[45px] md:w-[50px] mdx:w-[60px] mdl:w-[70px] 3xl:w-[80px]"
                        >
                            <Image
                                src={Right}
                                width={50}
                                height={50}
                                className="w-full h-auto"
                            />
                        </button>
                    </div>
                </div>
            </div>
            {isAskaQuestionModalOpen && <AskaQuestion onClose={closeAskaQuestionModal} />}
            {isEditModalOpen && <EditBanner onClose={handleCloseEditModal} />}
            {isAddModalOpen && <AddBanner onClose={handleCloseAddModal} />}
        </div>

    );
}
