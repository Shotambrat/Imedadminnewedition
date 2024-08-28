"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import GreenArrow from "../Buttons/GreenArrow";
import ClientsMain from "@/app/_components/AdminModal/Clients/ClientsMain";
import axios from "axios";
import DeleteConfirmationModal from "./DeleteConfirmationModal";
import EditClientModal from "./EditClientModal";

export default function ListClients() {
  const [visibleCount, setVisibleCount] = useState(6);
  const [adminModal, setAdminModal] = useState(false);
  const [clients, setClients] = useState([]);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [editModalSlug, setEditModalSlug] = useState(null);

  useEffect(() => {
    try {
      axios
        .get("https://imed.uz/api/v1/client/all", {
          headers: {
            "Accept-Language": "uz",
          },
        })
        .then((response) => {
          return response.data;
        })
        .then((data) => setClients(data.data))
        .catch((e) => {
          throw Error("Ошибка при загрузке данных", e);
        });
    } catch (error) {
      console.log(error);
    }
  }, []);

  console.log("Clients", clients);

  const showMoreClients = () => {
    setVisibleCount(clients.length);
  };

  const handleEditClick = (slug) => {
    setEditModalSlug(slug); // Устанавливаем slug выбранного клиента
  };

  const handleCloseEditModal = () => {
    setEditModalSlug(null); // Закрываем модальное окно
  };

  return (
    <div className="w-full max-w-[1440px] mx-auto px-2 flex flex-col gap-8 mb-[110px] mdx:mb-[130px] xl:mb-[180px]">
      {adminModal && <ClientsMain closeModal={setAdminModal} />}
      <div className="w-full flex justify-between items-center pt-[40px]">
        <h1 className="font-semibold text-[25px] mdx:text-[30px] lg:text-[35px] xl:text-[40px] uppercase ">
          Кейсы
        </h1>
        <button
          onClick={() => setAdminModal(true)}
          className="px-4 py-3 text-xl bg-red-500 text-white font-semibold"
        >
          Добавить клиента
        </button>
      </div>
      <div className="grid grid-cols-1 gap-4 xl:grid-cols-2">
        {clients.slice(0, visibleCount).map((card) => (
          <div
            key={card.id}
            className="bg-white p-4 w-full border-[1px] border-gray-200 mdx:p-0 mdl:p-5 slg:h-auto relative group"
          >
            <div className="mdx:flex mdx:flex-row items-center justify-between ">
              <div className="mdx:w-[50%] h-full relative flex justify-center">
                <Image
                  src={card.logo.url}
                  alt={card.name}
                  height={1000}
                  width={1000}
                  className="w-[70%] h-auto object-contain"
                />
              </div>
              <div className="mdx:mb-4 mdx:w-[50%]">
                <h2 className="text-xl font-bold right mt-4 mdx:mb-2 xl:text-[28px]">
                  {card.name}
                </h2>
                <p className="mb-4 text-gray-600 xl:text-[18px]">
                  {card.description.slice(0, 100)}
                </p>
                <Link href={`/clients/${card.slug}`}>
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
                onClick={() => setShowDeleteModal(true)}
              >
                Delete
              </button>
            </div>
            {showDeleteModal && (
              <DeleteConfirmationModal
                productId={card.id}
                onClose={() => setShowDeleteModal(false)}
              />
            )}

            {editModalSlug === card.slug && ( // Открываем модальное окно только для выбранного клиента
              <EditClientModal
                slug={card.slug}
                onClose={handleCloseEditModal}
              />
            )}
          </div>
        ))}
      </div>
      {visibleCount < clients.length && (
        <div className="flex justify-center items-center">
          <button
            onClick={showMoreClients}
            className="bg-[#E94B50] text-[#fff] text-[14px] mdx:text-[16px] py-3 px-[60px]"
          >
            Загрузить все
          </button>
        </div>
      )}
    </div>
  );
}