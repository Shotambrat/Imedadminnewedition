"use client";
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import axios from "axios";
import List from '@/app/_components/Catalog/List';
import Application from "@/app/_components/Main/Application";

export default function Page() {
  const { slug } = useParams();
  const router = useRouter();
  const [category, setCategory] = useState(null);
  const [products, setProducts] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Fetch category details by slug
    axios.get(`http://213.230.91.55:8130/v1/category/${slug}`, {
      headers: {
        "Accept-Language": "uz",
        "Content-Type": "application/json",
      },
    })
    .then((response) => {
      const categoryData = response.data.data;
      setCategory(categoryData);

      // Fetch products by category ID
      return axios.get(`http://213.230.91.55:8130/v1/product?category-id=${categoryData.id}`, {
        headers: {
          "Accept-Language": "uz",
          "Content-Type": "application/json",
        },
      });
    })
    .then((response) => {
      setProducts(response.data.data);
    })
    .catch((error) => {
      console.error("Error fetching category or products:", error);
      setError(error);
      router.push('/404');
    });
  }, [slug, router]);

  if (error) {
    return <div>Error: {error.message}</div>;
  }

  return (
    <div className='w-full bg-white flex flex-col py-24'>
      {category && <List category={category} products={products} setProducts={setProducts} />}
      <Application />
    </div>
  );
}