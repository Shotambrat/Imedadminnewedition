"use client";
import { useState } from "react";
import CreatedList from "./CreatedList";
import ProductInfo from "./ProductInfo";
import { DNA } from "react-loader-spinner";
import axios from "axios";

export default function ProductMain({ closeModal }) {
  // State management
  const [idCounter, setIdCounter] = useState(2);
  const [activeId, setActiveId] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const languages = ["uz", "ru", "en"];
  const [activeLang, setActiveLang] = useState(languages[0]);

  // Empty item template
  const emptyItem = {
    id: 1,
    name: { uz: "", ru: "", en: "" },
    new: false,
    sale: false,
    shortDescription: { uz: "", ru: "", en: "" },
    descriptions: [
      { title: { uz: "", ru: "", en: "" }, value: { uz: "", ru: "", en: "" } },
    ],
    discount: 0,
    originalPrice: 0,
    conditions: { uz: "", ru: "", en: "" },
    technical: true,
    brand: { id: 1 },
    category: { id: 2 },
    clients: [{ id: 1 }],
    characteristics: [
      { title: { uz: "", ru: "", en: "" }, value: { uz: "", ru: "", en: "" } },
    ],
    active: true,
    popular: false,
    gallery: [],
    videos: [],
    reviewsList: [],
    files: [],
    maintenance: [
      {
        title: {
          uz: "uz",
          ru: "ru",
          en: "en",
        },
        text: {
          uz: "uz",
          ru: "ru",
          en: "en",
        },
      },
    ],
  };

  // Initialize state with one empty item
  const [createdList, setCreatedList] = useState([{ ...emptyItem }]);
  const [activeItem, setActiveItem] = useState(createdList[0]);

  // Handle switching active item by ID
  const handleChangeActiveId = (id) => {
    const updatedItem = createdList.find((item) => item.id === id);
    setActiveItem(updatedItem);
    setActiveId(id);
  };

  const handleAddItem = () => {
    const newItem = { ...emptyItem, id: idCounter };
    setCreatedList((prevList) => [...prevList, newItem]);
    setActiveItem(newItem);
    setIdCounter(idCounter + 1);
  };

  const handleDeleteItem = (id) => {
    setCreatedList((prevList) => {
      const updatedList = prevList.filter((item) => item.id !== id);
      return updatedList;
    });
    if (updatedList.length > 0) {
      setActiveItem(updatedList[0]);
      setActiveId(updatedList[0].id);
    } else {
      setActiveItem(null);
      setActiveId(null);
    }
  };

  // Convert Blob URL to File
  const blobToFile = async (blobUrl, filename) => {
    const response = await fetch(blobUrl);
    const blob = await response.blob();
    return new File([blob], filename, { type: blob.type });
  };

  function dataURItoFile(dataURI, filename) {
    const byteString = atob(dataURI.split(",")[1]);
    const mimeString = dataURI.split(",")[0].split(":")[1].split(";")[0];
    const ab = new ArrayBuffer(byteString.length);
    const ia = new Uint8Array(ab);
    for (let i = 0; i < byteString.length; i++) {
      ia[i] = byteString.charCodeAt(i);
    }
    return new File([ab], filename, { type: mimeString });
  }

  // Save all items by sending them to the server
  const handleSaveAllItems = async () => {
    setLoading(true);
    setError(null);
    const authFormData = new FormData();
    authFormData.append("username", "nasiniemsin");
    authFormData.append("password", "2x2=xx");

    const authResponse = await axios.post(
      "http://213.230.91.55:8130/v1/auth/login",
      authFormData
    );

    const token = authResponse.data.data.token;

    try {
      for (const item of createdList) {
        const { gallery, files, id, category, catalog, reviewsList, ...other } =
          item;
        const { clients, ...others } = other;
        const formData = new FormData();

        const clientsFiltered = clients.map((item) => {
          return {
            id: item.id,
          };
        });

        console.log("hhhh", files);

        if (catalog !== null) {
          formData.append(
            "json",
            JSON.stringify({ ...others, clients: clientsFiltered, catalog })
          );
        } else {
          formData.append(
            "json",
            JSON.stringify({ ...others, clients: clientsFiltered, category })
          );
        }

        for (const [index, file] of gallery.entries()) {
          if (typeof file === "string" && file.startsWith("blob:")) {
            const convertedFile = await blobToFile(file, `image-${index}.png`);
            formData.append("gallery", convertedFile);
          } else if (file instanceof File) {
            formData.append("gallery", file);
          }
        }

        const response = await axios.post(
          "http://213.230.91.55:8130/v1/product",
          formData,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "multipart/form-data",
            },
          }
        );

        const productId = response.data.data.id;

        // Optionally handle file uploads
        if (files.length > 0) {
          const fileData = new FormData();
          for (const file of files) {
            if (file.downloadLink && file.downloadLink.startsWith("blob:")) {
              const convertedFile = await blobToFile(
                file.downloadLink,
                file.name
              );
              fileData.append("files", convertedFile);
            } else if (file instanceof File) {
              fileData.append("files", file);
            }
          }
          fileData.append("product-id", productId);

          await axios.post("http://213.230.91.55:8130/v1/product/file", fileData, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });
        }

        // Optionally handle reviews
        for (const review of reviewsList) {
          const reviewFormData = new FormData();
          console.log(review);
          reviewFormData.append(
            "json",
            JSON.stringify({
              nameDoctor: review.nameDoctor,
              position: review.position,
              options: review.options,
            })
          );
          reviewFormData.append("product-id", productId);
          if (
            review.avatarImage &&
            review.avatarImage.startsWith("data:image/")
          ) {
            const reviewFile = dataURItoFile(review.avatarImage, "avatar.png");
            reviewFormData.append("doctor-photo", reviewFile);
          }

          await axios.post(
            "http://213.230.91.55:8130/v1/product/review",
            reviewFormData,
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          );
        }
      }
      setLoading(false);
      closeModal(false);
    } catch (error) {
      console.error("Ошибка при создании продукта:", error);
      alert("Произошла ошибка, проверьте данные или обратитесь к разработчику")
      setLoading(false);
      setError("Произошла ошибка при сохранении продукта.");
    }
  };

  console.log("Created",createdList)

  return (
    <div className="fixed h-screen flex w-full bg-modalBg z-[999] inset-0">
      {loading && (
        <div className="fixed h-screen w-full inset-0 flex justify-center items-center bg-subModal z-[9999]">
          <DNA
            visible={true}
            height="120"
            width="120"
            ariaLabel="dna-loading"
          />
        </div>
      )}
      <div className="h-full w-full relative max-w-[300px]">
        <CreatedList
          activeId={activeId}
          activeLang={activeLang}
          createdList={createdList}
          closeModal={closeModal}
          addNewItem={handleAddItem}
          setActiveId={handleChangeActiveId}
          deleteItem={handleDeleteItem}
          handleSave={handleSaveAllItems}
        />
      </div>
      <div className="w-full h-full bg-white p-8 overflow-y-scroll no-scrollbar">
        <ProductInfo
          setCreatedList={setCreatedList}
          activeItem={activeItem}
          setActiveItem={setActiveItem}
          languages={languages}
          activeLang={activeLang}
          setActiveLang={setActiveLang}
          createdList={createdList}
        />
      </div>
      {error && (
        <div className="absolute bottom-4 left-4 text-red-600">{error}</div>
      )}
    </div>
  );
}
