"use client";
import { useState } from "react";
import axios from "axios";

export default function DeleteConfirmationModal({ productId, onClose }) {
  const [showSuccess, setShowSuccess] = useState(false);
  const [showError, setShowError] = useState(false);

  const handleDelete = async () => {
    const authFormData = new FormData();
    authFormData.append("username", "nasiniemsin");
    authFormData.append("password", "2x2=xx");

    const authResponse = await axios.post(
      "http://213.230.91.55:8130/v1/auth/login",
      authFormData
    );

    const token = authResponse.data.data.token;
    try {
      const response = await axios.delete(
        `https://imed.uz/api/v1/new/delete/${productId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      console.log(response);

      if (response.status === 200) {
        setShowSuccess(true);
        setTimeout(() => {
          setShowSuccess(false);
          onClose();
        }, 3000); // Уменьшено время задержки до 3 секунд
      } else {
        setShowError(true);
      }
    } catch (error) {
      console.error("Error deleting client:", error);
      setShowError(true);
    }
  };

  console.log("ProductId", productId)

  return (
    <div className="fixed inset-0 flex justify-center items-center bg-modalBg z-[9999]">
      <div className="bg-white p-8 rounded-lg shadow-lg w-[90%] lg:w-[40%] max-h-[95%] overflow-y-scroll no-scrollbar">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-semibold">Удалить кдиента</h2>
          <button onClick={onClose}>Закрыть</button>
        </div>
        <div className="flex flex-col items-center">
          <p>Вы уверены что хотите удалить клиента?</p>
          <div className="flex gap-4 mt-4">
            <button
              onClick={(e) => {
                e.stopPropagation();
                e.preventDefault();
                handleDelete();
              } }
              className="bg-red-500 rounded-lg text-white p-2"
            >
              Подтвердить
            </button>
            <button
              onClick={onClose}
              className="bg-gray-500 rounded-lg text-white p-2"
            >
              Отмена
            </button>
          </div>
          {showSuccess && (
            <div className="mt-4 bg-green-500 text-white p-2 rounded">
              Клиент удален успешно
            </div>
          )}
          {showError && (
            <div className="mt-4 bg-red-500 text-white p-2 rounded">
              Ошибка при удалении. Попробуйте еще раз
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
