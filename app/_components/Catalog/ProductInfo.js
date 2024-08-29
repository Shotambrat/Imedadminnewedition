"use client";
import ProductPreview from "./ProductPreview";
import ProductCharacteristics from "./ProductCharacteristics";
import Reviews from "./Reviews";
import VideoReview from "./VideoReview";
import { useEffect, useState } from "react";
import axios from "axios";
import { DNA } from "react-loader-spinner";

export default function ProductInfo({ slug, onCose }) {
  const [activeLang, setActiveLang] = useState("uz");
  const [activeItem, setActiveItem] = useState(null);
  const [loading, setLoading] = useState(false);
  const [galleryDeleteList, setGalleryDeleteList] = useState([]);

  const languages = ["uz", "ru", "en"];

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
        console.error("Error fetching news data", error);
        setLoading(false);
      });
  }, [slug]);

  console.log("ACTIVE ITEM",activeItem)


  return (
    <div className="w-full max-w-[1440px] mx-auto flex flex-col gap-16 px-2">
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
      <div className="flex gap-4 mb-4">
        {languages.map((lang) => (
          <button
            key={lang}
            onClick={() => setActiveLang(lang)}
            className={`px-4 py-2 text-sm font-semibold ${
              activeLang === lang ? "bg-redMain text-white" : "bg-white"
            }`}
          >
            {lang.toUpperCase()}
          </button>
        ))}
      </div>
      <ProductPreview
        activeItem={activeItem}
        setActiveItem={setActiveItem}
        languages={languages}
        activeLang={activeLang}
        setActiveLang={setActiveLang}
      />
      <ProductCharacteristics
        activeItem={activeItem}
        setActiveItem={setActiveItem}
        languages={languages}
        activeLang={activeLang}
        setActiveLang={setActiveLang}
      />
      <VideoReview
        activeItem={activeItem}
        setActiveItem={setActiveItem}
        languages={languages}
        activeLang={activeLang}
        setActiveLang={setActiveLang}
      />
      <Reviews
        activeItem={activeItem}
        setActiveItem={setActiveItem}
        languages={languages}
        activeLang={activeLang}
        setActiveLang={setActiveLang}
      />
    </div>
  );
}
