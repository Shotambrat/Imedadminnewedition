import Modal from "./AttachedFiles";
import { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import axios from "axios";

export default function ProductCharacteristics({
  activeItem,
  setActiveItem,
  languages,
  activeLang,
  setActiveLang,
}) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalContent, setModalContent] = useState([]);
  const [editType, setEditType] = useState(null);
  const [clients, setClients] = useState([]);
  const [selectedClients, setSelectedClients] = useState([]);
  const [modal, setModal] = useState(false);

  // Централизованная структура данных для категорий
  const categoriesData = useCallback(() => [
    {
      category: "descriptions",
      title: "Описание",
      desc: true,
      data: activeItem?.descriptions || [],
    },
    {
      category: "characteristics",
      title: "Характеристики",
      desc: false,
      data: activeItem?.characteristics || [],
    },
    {
      category: "client",
      title: "Клиенты",
      desc: false,
      data: activeItem?.clients || [],
    },
    {
      category: "files",
      title: "Файлы",
      desc: false,
      data: activeItem?.files || [],
    },
  ], [activeItem]);

  const [active, setActive] = useState("descriptions");
  const [filtered, setFiltered] = useState(categoriesData()[0]);

  useEffect(() => {
    // Fetch clients for the client section
    const fetchClients = async () => {
      try {
        const response = await axios.get("https://imed.uz/api/v1/client/all");
        setClients(response.data.data);
      } catch (error) {
        console.error("Error fetching clients:", error);
      }
    };
    fetchClients();
  }, []);

  useEffect(() => {
    // Обновляем отфильтрованные данные при изменении activeItem или active
    const data = categoriesData();
    setFiltered(data.find((item) => item.category === active));
  }, [activeItem, active, categoriesData]);

  const handleOpenModal = (content = [], type) => {
    setEditType(type);
    setIsModalOpen(true);

    if (type === "clients") {
      setSelectedClients(activeItem.clients.map((client) => client.id));
    } else {
      // Подготовка содержимого для модального окна
      const initializedContent = content.map((block) => ({
        id: block.id || null,
        title: { uz: "", ru: "", en: "", ...block.title },
        value: { uz: "", ru: "", en: "", ...block.value },
      }));
      setModalContent(initializedContent);
    }
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setModalContent([]);
    setEditType(null);
  };

  const handleSaveModal = () => {
    // Обновляем activeItem на основе содержимого модального окна
    if (editType) {
      const updatedItem = { ...activeItem, [editType]: modalContent };
      setActiveItem(updatedItem);
    }
    handleCloseModal();
  };

  const handleAddBlock = () => {
    // Добавляем новый пустой блок для редактирования (без id)
    setModalContent((prev) => [
      ...prev,
      {
        createId: new Date().getTime(), // Создаем временный уникальный ID для новых блоков
        title: { uz: "", ru: "", en: "" },
        value: { uz: "", ru: "", en: "" },
      },
    ]);
  };

  const handleRemoveBlock = (id) => {
    // Удаляем блок по createId или id
    setModalContent((prev) =>
      prev.map((block) =>
        block.createId === id || block.id === id
          ? { ...block, title: null, value: null } // Очищаем блок, но сохраняем id
          : block
      )
    );
  };

  const handleChange = (e, id, field) => {
    const { name, value } = e.target;
    setModalContent((prev) =>
      prev.map((block) =>
        block.createId === id || block.id === id
          ? {
              ...block,
              [field]: { ...block[field], [name]: value }, // Обновляем конкретное поле
            }
          : block
      )
    );
  };

  const handleCheckboxChange = (clientId) => {
    // Обновляем выбранных клиентов
    setSelectedClients((prev) =>
      prev.includes(clientId)
        ? prev.filter((id) => id !== clientId)
        : [...prev, clientId]
    );
  };

  return (
    <div className="w-full flex flex-col gap-5">
      <div className="w-full flex flex-col relative">
        <div className="w-full overflow-x-scroll flex gap-8 lg:gap-12 scrollbar-hide">
          {categoriesData().map((item, index) => (
            <button
              key={index}
              onClick={() => setActive(item.category)}
              className={`z-10 w-auto text-lg transition-text font-medium ${
                active === item.category
                  ? "text-[#E31E24] border-b-2 border-b-[#E31E24]"
                  : "text-neutral-400"
              }`}
            >
              <h3 className="my-2 whitespace-nowrap">{item.title}</h3>
            </button>
          ))}
        </div>
        <hr className="w-full border-t-2 absolute bottom-0 border-slate-300" />
      </div>

      {/* Display filtered data */}
      <div>
        {filtered.desc ? (
          <div className="flex flex-col gap-4">
            {filtered.data
              .filter((block) => block.title !== null)
              .map((block, index) => (
                <div key={index} className="flex flex-col gap-2">
                  <h3 className="font-bold text-lg">{block.title[activeLang]}</h3>
                  <p className="text-neutral-500">{block.value[activeLang]}</p>
                </div>
              ))}
          </div>
        ) : (
          <div className="flex flex-col gap-6 w-full">
            {filtered.category === "characteristics" &&
              filtered.data.filter((block) => block.title !== null).map((item, i) => (
                <div key={i} className="w-full flex gap-3">
                  <p className="w-full text-neutral-400 max-w-[200px]">
                    {item.title[activeLang]}
                  </p>
                  <div className="flex w-full flex-col">
                    {item.value[activeLang]?.split("\n").map((line, j) => (
                      <p key={j}>{line}</p>
                    ))}
                  </div>
                </div>
              ))}

            {filtered.category === "client" && (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                {filtered.data.map((client, index) => (
                  <div key={index} className="border p-4">
                    <div className="flex-col mdx:flex-row flex gap-6">
                      <Image
                        src={client.logo?.url}
                        alt={client.name}
                        width={50}
                        height={50}
                      />
                      <div className="mt-2 flex gap-4 flex-col">
                        <h3 className="font-bold text-lg">{client.name}</h3>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {filtered.category === "files" && (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                {filtered.data.map((file, index) => (
                  <div key={index} className="border p-4 flex items-center">
                    <Image
                      src={file.url}
                      alt={`File ${index}`}
                      width={50}
                      height={50}
                    />
                    <span className="ml-4">Файл {index + 1}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      <div className="flex justify-start gap-4 mt-2">
        <button
          className="bg-[#FCE8E9] text-[#E31E24] py-4 px-[30px] font-bold"
          onClick={() => handleOpenModal(activeItem?.descriptions, "descriptions")}
        >
          Редактировать Описание
        </button>
        <button
          className="bg-[#FCE8E9] text-[#E31E24] py-4 px-[30px] font-bold"
          onClick={() =>
            handleOpenModal(activeItem?.characteristics, "characteristics")
          }
        >
          Редактировать Характеристики
        </button>
        <button
          className="bg-[#FCE8E9] text-[#E31E24] py-4 px-[30px] font-bold"
          onClick={() => handleOpenModal(activeItem?.clients, "clients")}
        >
          Редактировать Клиенты
        </button>
        <button
          className="bg-[#FCE8E9] text-[#E31E24] py-4 px-[30px] font-bold"
          onClick={() => handleOpenModal(activeItem?.files, "files")}
        >
          Редактировать Файлы
        </button>
      </div>

      {/* Modal for editing content */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-8 rounded-lg w-full max-w-lg h-[90%] overflow-y-scroll">
            <div className="flex justify-end mb-4">
              {languages.map((lang) => (
                <button
                  key={lang}
                  onClick={() => setActiveLang(lang)}
                  className={`px-4 py-2 text-sm font-semibold ${
                    activeLang === lang ? "bg-redMain text-white" : "bg-white text-black"
                  }`}
                >
                  {lang.toUpperCase()}
                </button>
              ))}
            </div>

            <h2 className="text-2xl mb-4">
              {editType === "descriptions"
                ? "Редактировать Описание"
                : editType === "characteristics"
                ? "Редактировать Характеристики"
                : editType === "files"
                ? "Редактировать Файлы"
                : "Редактировать Клиенты"}
            </h2>

            {/* Modal Content */}
            {editType === "clients" ? (
              clients.map((client) => (
                <div key={client.id} className="flex items-center mb-4">
                  <input
                    type="checkbox"
                    checked={selectedClients.includes(client.id)}
                    onChange={() => handleCheckboxChange(client.id)}
                  />
                  <Image src={client.logo?.url} alt={client.name} width={50} height={50} />
                  <span className="ml-4">{client.name}</span>
                </div>
              ))
            ) : (
              modalContent
                .filter((block) => block.title !== null)
                .map((block, index) => (
                  <div key={index} className="mb-6 border-b pb-4">
                    <div className="mb-4">
                      <label className="block text-sm font-medium mb-2">
                        Заголовок ({activeLang})
                      </label>
                      <input
                        type="text"
                        name={activeLang}
                        value={block.title[activeLang] || ""}
                        onChange={(e) =>
                          handleChange(e, block.createId ? block.createId : block.id, "title")
                        }
                        className="w-full p-2 border border-gray-300 rounded"
                      />
                    </div>
                    <div className="mb-4">
                      <label className="block text-sm font-medium mb-2">
                        Описание ({activeLang})
                      </label>
                      <textarea
                        name={activeLang}
                        value={block.value[activeLang] || ""}
                        onChange={(e) =>
                          handleChange(e, block.createId ? block.createId : block.id, "value")
                        }
                        className="w-full p-2 border border-gray-300 rounded"
                      />
                    </div>
                    <button
                      onClick={() => handleRemoveBlock(block.id || block.createId)}
                      className="py-2 px-4 bg-red-500 text-white rounded"
                    >
                      Удалить блок
                    </button>
                  </div>
                ))
            )}

            <div className="flex justify-end gap-4">
              <button
                onClick={handleAddBlock}
                className="py-2 px-4 bg-blue-500 text-white rounded"
              >
                Добавить блок
              </button>
              <button
                onClick={handleSaveModal}
                className="py-2 px-4 bg-blue-500 text-white rounded"
              >
                Сохранить
              </button>
              <button
                onClick={handleCloseModal}
                className="py-2 px-4 bg-gray-300 text-black rounded"
              >
                Отмена
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
