"use client";
import { useEffect, useState } from "react";
import axios from "axios";
import CategoryItem from "@/app/_components/Categories/CategoryItem";

export default function List() {
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    axios("http://213.230.91.55:8130/v1/category", {
      headers: {
        "Accept-Language": "uz",
        "Content-Type": "application/json",
      },
    })
    .then((response) => {
      setCategories(response.data.data);
    })
    .catch((error) => {
      console.error("Error fetching categories:", error);
    });
  
  }, []);

  console.log(categories);

  return (
    <div className="w-full max-w-[1440px] mx-auto px-2 flex flex-col gap-8">
      <h1 className="text-3xl max-mdx:text-2xl font-semibold uppercase">
        Категории
      </h1>
      <div className="w-full grid grid-cols-1 mdl:grid-cols-2 xl:grid-cols-4 gap-4">
        {categories.map((category, i) => (
          <CategoryItem
            key={category.id}
            title={category.name}
            imageSrc={category.photo.url}
            slug={category.slug}
          />
        ))}
      </div>
    </div>
  );
}
