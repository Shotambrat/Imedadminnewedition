"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import partnerPhoto from "@/public/images/aboutUs/partners/image3.png";
import partnerPhoto1 from "@/public/images/aboutUs/partners/image58.png";
import GreenArrow from "../Buttons/GreenArrow";
import PartnersMain from "@/app/_components/AdminModal/Partners/PartnersMain";
import axios from "axios";
import DeleteConfirmationModal from "./DeleteConfirmationModal";
import EditPartnerModal from "./EditPartnerModal";

export default function ListPartners() {
  const [showAll, setShowAll] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(null);
  const [editModalSlug, setEditModalSlug] = useState(null);
  const [partners, setPartners] = useState([]);
  useEffect(() => {
    axios("https://imed.uz/api/v1/partner/all", {
      headers: {
        "Accept-Language": "uz",
      },
    }).then((response) => {
      setPartners(response.data.data);
    });
  }, []);

  console.log(partners);
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) {
        // Adjust the value to match your 'mdx' breakpoint
        setShowAll(true);
      } else {
        setShowAll(false);
      }
    };

    handleResize(); // Check the initial screen size
    window.addEventListener("resize", handleResize); // Add resize event listener

    return () => {
      window.removeEventListener("resize", handleResize); // Clean up the event listener
    };
  }, []);

  const [adminModal, setAdminModal] = useState(false);

  const visiblePartners = showAll ? partners : partners.slice(0, 2);

  const handleEditClick = (slug) => {
    setEditModalSlug(slug); // Устанавливаем slug выбранного клиента
  };

  const handleCloseEditModal = () => {
    setEditModalSlug(null); // Закрываем модальное окно
  };

  return (
    <div className="w-full max-w-[1440px] mx-auto px-2 flex flex-col gap-8 mt-7">
      {adminModal && <PartnersMain closeModal={setAdminModal} />}
      <div className="grid grid-cols-1 gap-4 mdx:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 mb-[40px] mdx:mb-[180px]">
        {visiblePartners.map((card) => (
          <div
            key={card.id}
            className="bg-white p-4 border-[1px] border-gray-200 mdx:p-0 mdl:p-5 relative group"
          >
            <div className=" items-center justify-between divide-y  ">
              <div className="w-full h-[70px] relative mt-3 mb-9">
                <Image
                  src={card.logo?.url}
                  alt={card.title}
                  layout="fill"
                  objectFit="contain"
                />
              </div>
              <div className="mdx:mb-4 mdx:p-3 ">
                <h2 className="text-xl font-bold right mt-4 mdx:mb-2 xl:text-[28px]">
                  {card.name}
                </h2>
                <p className="mb-4 text-gray-600 xl:text-[18px] ">
                  {card.about.slice(0, 100)}
                </p>
                <Link href={`/partners/${card.link}`}>
                  <span className="text-[#E31E24] font-semibold mdx:text-[18px]">
                    <GreenArrow title={"Подробнее"} />
                  </span>
                </Link>
              </div>
            </div>
            <div className="absolute bottom-2 right-2 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
              <button
                className="px-4 py-2 bg-blue-500 text-white rounded-lg"
                onClick={() => handleEditClick(card.slug)} // Устанавливаем slug при клике
              >
                Edit Info
              </button>
              <button
                className="px-4 py-2 bg-red-500 text-white rounded-lg"
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  setShowDeleteModal(card.id);
                }}
              >
                Delete
              </button>
            </div>
            {showDeleteModal && (
              <DeleteConfirmationModal
                productId={showDeleteModal}
                onClose={() => setShowDeleteModal(false)}
              />
            )}

            {editModalSlug === card.slug && ( // Открываем модальное окно только для выбранного клиента
              <EditPartnerModal
                slug={card.slug}
                onClose={handleCloseEditModal}
              />
            )}
          </div>
        ))}
        <button
          onClick={() => setAdminModal(true)}
          className="min-h-[200px] text-5xl font-bold border-2 border-dashed border-redMain text-redMain"
        >
          +
        </button>
      </div>
      <div className="flex justify-center mb-[120px]">
        <button
          onClick={() => setShowAll(!showAll)}
          className="bg-white border text-[#252324] py-3 px-[55px] "
        >
          {showAll ? "Скрыть" : "Показать все"}
        </button>
      </div>
    </div>
  );
}
