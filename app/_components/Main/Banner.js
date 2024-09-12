"use client";
import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import Slider from "react-slick";
import axios from "axios";
import left from "@/public/svg/arrowleftbanners.svg";
import right from "@/public/svg/arrowrightbanners.svg";
import BannerCreationModal from "./BannerCreationModal"; // Import the new component
import BannerUpdateModal from "./BannerUpdateModal";

export default function BannerCarousel() {
  const [editModal, setEditModal] = useState(null);
  const [createModal, setCreateModal] = useState(false);
  const [banners, setBanners] = useState([]);
  const [loading, setLoading] = useState(true); // State to handle loading
  const sliderRef = useRef(null);

  useEffect(() => {
    // Fetch banners from the API
    const fetchBanners = async () => {
      try {
        const response = await axios.get("http://213.230.91.55:8130/v1/banner");
        const { data } = response.data;
        setBanners(data.sliders);
      } catch (error) {
        console.error("Error fetching banners:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchBanners();
  }, []);

  // Function to delete a banner by ID
  const deleteBanner = async (id) => {
    try {
      // Log in to get the authentication token
      const authFormData = new FormData();
      authFormData.append("username", "nasiniemsin");
      authFormData.append("password", "2x2=xx");
      
      const authResponse = await axios.post(
        "http://213.230.91.55:8130/v1/auth/login",
        authFormData
      );

      const token = authResponse.data.data.token;

      // Make the DELETE request with authorization
      const response = await axios.delete(
        `http://213.230.91.55:8130/v1/banner/slider/${id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`, // Include the token in the headers
          },
        }
      );

      if (response.status === 200) {
        // Filter out the deleted banner from the state
        setBanners((prevBanners) => prevBanners.filter((banner) => banner.id !== id));
        console.log("Banner deleted successfully");
      }
    } catch (error) {
      console.error("Error deleting banner:", error);
    }
  };

  const settings = {
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 7000,
    dots: false,
    arrows: false,
    beforeChange: (oldIndex, newIndex) => setCurrentSlide(newIndex),
  };

  const [currentSlide, setCurrentSlide] = useState(0);

  const nextSlide = () => {
    sliderRef.current.slickNext();
  };

  const prevSlide = () => {
    sliderRef.current.slickPrev();
  };

  const goToSlide = (index) => {
    sliderRef.current.slickGoTo(index);
  };

  return (
    <div className="relative w-full max-w-[1440px] mx-auto overflow-hidden px-2 lg:px-12 group">
      <div className="absolute right-0 text-4xl font-bold text-redMain mix-blend-difference top-0 opacity-0 group-hover:opacity-100 z-[999] bg-green-600 px-3 py-2">
        <button onClick={() => setCreateModal(true)}>+</button>
      </div>

      {loading ? (
        <div className="flex justify-center items-center min-h-[500px]">
          <span>Loading...</span>
        </div>
      ) : (
        <Slider ref={sliderRef} {...settings}>
          {banners.map((banner, index) => (
            <div
              key={index}
              className="min-w-full flex justify-center px-2 max-h-[600px] min-h-[500px] relative"
              style={{ backgroundColor: banner.backgroundColour || "#FFFFFF" }} // Используем стиль для установки фона
            >
              <Image
                src={banner.photo.url}
                height={1000}
                width={1000}
                alt={`Image ${index}`}
                className="w-full object-contain"
              />
              <div className="absolute left-0 bottom-0 flex space-x-2 p-2">
                <button onClick={() => setEditModal(banner)}>Изменить</button>
                <button onClick={() => deleteBanner(banner.id)}>Удалить</button>
              </div>
            </div>
          ))}
        </Slider>
      )}

      <button
        onClick={prevSlide}
        className="absolute top-1/2 -left-0 transform -translate-y-1/2 p-2 opacity-70 hover:opacity-100 z-10 hidden lg:block"
      >
        <Image src={left} width={50} height={50} className="w-full h-auto" />
      </button>
      <button
        onClick={nextSlide}
        className="absolute top-1/2 -right-0 transform -translate-y-1/2 p-2 opacity-70 hover:opacity-100 z-10 hidden lg:block"
      >
        <Image src={right} width={50} height={50} className="w-full h-auto" />
      </button>
      <div className="flex justify-center mt-4">
        {banners.map((_, index) => (
          <button
            key={index}
            onClick={() => goToSlide(index)}
            className={`w-2 h-2 rounded-full ${
              currentSlide === index ? "bg-red-500" : "bg-gray-300"
            } mx-1`}
          ></button>
        ))}
      </div>
      <BannerCreationModal
        visible={createModal}
        onClose={() => setCreateModal(false)}
      />

      {editModal && (
        <BannerUpdateModal
          visible={!!editModal}
          onClose={() => setEditModal(null)}
          bannerData={editModal}
        />
      )}
    </div>
  );
}
