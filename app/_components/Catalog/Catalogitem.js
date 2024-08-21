"use client";
import { useState } from "react";
import Image from "next/image";
import EditProductModal from "./EditProductModal";
import DeleteConfirmationModal from "./DeleteConfirmationModal";
import GreenArrow from "@/app/_components/Buttons/GreenArrow";
import fav from "@/public/svg/main/fav.svg";
import favFilled from "@/public/svg/main/fav-filled.svg";

export default function CatalogItem({ product, onDelete, onUpdate }) {
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [isFavorite, setIsFavorite] = useState(false);

  useEffect(() => {
    const favorites = JSON.parse(localStorage.getItem("favorites")) || [];
    setIsFavorite(favorites.some(item => item.slug === product.slug));
  }, [product.slug]);

  const handleFavoriteToggle = () => {
    let favorites = JSON.parse(localStorage.getItem("favorites")) || [];

    if (isFavorite) {
      favorites = favorites.filter(item => item.slug !== product.slug);
    } else {
      favorites.push({
        title: product.name,
        description: product.shortDescription,
        image: product.gallery[0]?.url,
        price: product.originalPrice,
        slug: product.slug,
      });
    }

    localStorage.setItem("favorites", JSON.stringify(favorites));
    setIsFavorite(!isFavorite);
  };

  return (
    <div className="h-[450px] w-full relative group">
      <div className="border border-neutral-300 rounded-2xl p-4 pt-6 flex flex-col h-full relative">
        <div className="absolute top-2 left-2 flex gap-1">
          {product.new && (
            <div className="py-1 px-2 font-semibold rounded-full text-xs text-greenView bg-green-100">
              New
            </div>
          )}
          {product.sale && (
            <div className="py-1 px-2 font-semibold rounded-full text-xs text-red-500 bg-red-100">
              {`-${product.discount}%`}
            </div>
          )}
        </div>
        <div className="absolute top-4 right-4 z-10" onClick={handleFavoriteToggle}>
          <Image
            src={isFavorite ? favFilled : fav}
            width={24}
            height={24}
            alt="Favorite Icon"
            className="cursor-pointer"
          />
        </div>
        <div className="w-full h-[300px] flex items-center justify-center overflow-hidden">
          <Image
            src={product.gallery[0]?.url}
            alt={product.name}
            width={200}
            height={200}
            className="object-contain w-full h-full"
          />
        </div>
        <h3 className="text-md font-semibold mt-3">{product.name}</h3>
        <p className="text-xs text-gray-600 mt-1">
          {product.shortDescription}
        </p>
        <div className="flex w-full justify-between items-center flex-wrap mt-3">
          <GreenArrow title="more details" href={`/product/${product.slug}`} />
          {product.originalPrice && (
            <div className="py-1 px-2 font-semibold rounded-full text-greenView">
              {product.originalPrice} y.e
            </div>
          )}
        </div>
      </div>
      <div className="absolute bottom-2 right-2 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
        <button
          className="px-4 py-2 bg-blue-500 text-white rounded-lg"
          onClick={() => setShowEditModal(true)}
        >
          Edit
        </button>
        <button
          className="px-4 py-2 bg-red-500 text-white rounded-lg"
          onClick={() => setShowDeleteModal(true)}
        >
          Delete
        </button>
      </div>
      {showEditModal && (
        <EditProductModal
          product={product}
          onClose={() => setShowEditModal(false)}
          onSave={onUpdate}
        />
      )}
      {showDeleteModal && (
        <DeleteConfirmationModal
          productId={product.id}
          onClose={() => setShowDeleteModal(false)}
          onDelete={onDelete}
        />
      )}
    </div>
  );
}