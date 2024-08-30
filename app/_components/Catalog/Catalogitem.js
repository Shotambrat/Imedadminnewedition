  "use client";
  import { useState, useEffect, useCallback, useMemo } from "react";
  import Image from "next/image";
  import Link from "next/link";
  import GreenArrow from "../Buttons/GreenArrow";
  import fav from "@/public/svg/main/fav.svg";
  import favFilled from "@/public/svg/main/fav-filled.svg";
  import DeleteConfirmationModal from "./DeleteConfirmationModal";
  import EditProductModal from "./EditProductModal";

  export default function  Catalogitem({
    new: isNew,
    sale,
    image,
    title,
    description,
    price,
    slug,
    discount,
  }) {
    const [isFavorite, setIsFavorite] = useState(false);
    const [isMdx, setIsMdx] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [editModalSlug, setEditModalSlug] = useState(null);

    useEffect(() => {
      const handleResize = () => {
        setIsMdx(window.innerWidth >= 460); // mdx breakpoint is 768px in Tailwind
      };

      handleResize(); // Check initially
      window.addEventListener("resize", handleResize);

      return () => {
        window.removeEventListener("resize", handleResize);
      };
    }, []);

    useEffect(() => {
      const favorites = JSON.parse(localStorage.getItem("favorites")) || [];
      setIsFavorite(favorites.some((item) => item.slug === slug));
    }, [slug]);

    const handleFavoriteToggle = useCallback(() => {
      let favorites = JSON.parse(localStorage.getItem("favorites")) || [];

      if (isFavorite) {
        favorites = favorites.filter((item) => item.slug !== slug);
      } else {
        favorites.push({ title, description, image, price, slug });
      }

      localStorage.setItem("favorites", JSON.stringify(favorites));
      setIsFavorite(!isFavorite);
    }, [isFavorite, title, description, image, price, slug]);

    const handleEditClick = (slug) => {
      setEditModalSlug(slug);
    };

    const handleCloseEditModal = () => {
      setEditModalSlug(null);
    };


    return (
      <div className="h-[290px] mdx:h-[440px] w-full ">
        <div className="rounded-2xl mdx:pt-8 flex flex-col justify-between mdx:p-2 mdl:p-4 h-full relative group">
          <div
            onClick={handleFavoriteToggle}
            className="absolute top-4 right-4 z-10"
          >
            <Image
              src={isFavorite ? favFilled : fav}
              width={100}
              height={100}
              alt="Favorite Icon"
              className="w-6 h-6 max-mdx:w-5 max-mdx:h-45"
            />
          </div>
          <div className="w-full h-[300px] flex items-center justify-center relative overflow-hidden">
            <div className="absolute bottom-2 left-2 flex gap-1 ">
              {isNew && (
                <div className="py-1 px-3 rounded-full text-[12px] mdx:text-sm font-bold text-red-500 bg-red-100 ">
                  Новинка
                </div>
              )}
              {sale && discount > 0 && (
                <div className="py-1 px-3 rounded-full text-[12px] mdx:text-sm font-bold text-red-500 bg-red-100">
                  {`-${discount}%`}
                </div>
              )}
            </div>
            <Image
              src={image}
              alt={title}
              width={200}
              height={200}
              className="object-contain w-full h-full"
            />
          </div>
          <h3 className="text-md font-semibold ">
            {isMdx
              ? title
              : title?.length > 12
              ? `${title.substring(0, 12)}...`
              : title}
          </h3>
          <p className="text-xs text-[#BABABA] mt-1 line-clamp-3">
            {description}
          </p>
          <div className="flex w-full justify-between items-center flex-wrap mt-3">
            <Link href={`/product/${slug}`}>
              <GreenArrow title={"Подробнее"} />
            </Link>
            {/* {price && (
              <div className="py-1 px-2 font-semibold rounded-full text-greenView">
                {price}
              </div>
            )} */}
          </div>
          <div className="absolute bottom-2 right-2 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
            <button
              className="px-4 py-2 bg-blue-500 text-white rounded-lg"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                handleEditClick(slug);
              }}
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
              onClose={() => setShowDeleteModal(false)}
              slug={editModalSlug}
            />
          )}
          {editModalSlug === slug && (
            <EditProductModal
              onClose={handleCloseEditModal}
              slug={editModalSlug}
            />
          )}
        </div>
      </div>
    );
  }