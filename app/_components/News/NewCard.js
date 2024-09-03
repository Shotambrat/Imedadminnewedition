"use client";

import { useState } from "react";
import Image from "next/image";
import GreenArrow from "../Buttons/GreenArrow";
import DeleteConfirmationModal from "./DeleteConfirmationModal";
import EditNewModal from "./EditNewModal";
import Link from "next/link";

export default function NewCard({ key, id, title, date, imageSrc, slug }) {
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [editModalSlug, setEditModalSlug] = useState(null);

  const handleEditClick = (slug) => {
    setEditModalSlug(slug); // Устанавливаем slug выбранного клиента
  };

  const handleCloseEditModal = () => {
    setEditModalSlug(null); // Закрываем модальное окно
  };
  return (
    <div className="w-full border border-neutral-300 bg-white h-full flex flex-col gap-5 justify-between relative group">
      <Image
        src={imageSrc}
        width={500}
        height={500}
        alt={`News Image ${key}`}
        className="w-full h-auto object-cover"
      />
      <div className="w-full flex flex-col gap-6 pl-4 pb-4">
        <h3 className="text-xl max-mdx:text-lg font-semibold">{title}</h3>
        <GreenArrow title={"Подробнее"} />
      </div>
      <div className="absolute bottom-2 right-2 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
        <button
          className="px-4 py-2 bg-blue-500 text-white rounded-lg"
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            handleEditClick(slug);
          }} // Устанавливаем slug при клике
        >
          Edit Info
        </button>
        <button
          className="px-4 py-2 bg-red-500 text-white rounded-lg"
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            setShowDeleteModal(true);
          }}
        >
          Delete
        </button>
      </div>
      {showDeleteModal && (
        <DeleteConfirmationModal
          productId={id}
          onClose={() => setShowDeleteModal(false)}
        />
      )}

      {editModalSlug === slug && ( // Открываем модальное окно только для выбранного клиента
        <div
          className={`modal-open ${editModalSlug ? "content-under-modal" : ""}`}
        >
          <EditNewModal slug={slug} onClose={handleCloseEditModal} />
        </div>
      )}
    </div>
  );
}
