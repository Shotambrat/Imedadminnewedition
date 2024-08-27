"use client";

import newsPhoto from "@/public/images/news/news-photo.png";
import NewCard from "@/app/_components/News/NewCard";
import Pagination from "@/app/_components/News/Pagination";
import Link from "next/link";
import { useEffect, useState } from "react";
import NewsMain from "../AdminModal/News/NewsMain";
import axios from "axios";

export default function NewsComp() {
  const [data, setData] = useState([]);
  useEffect(() => {
    axios('http://213.230.91.55:8130/v1/new/get-all?page=1', {
      headers: {
        'Accept-Language': 'ru'
      }
    })
    .then(response => response.data.data)
    .then(data => setData(data))
  }, [])
  const [adminModal, setAdminModal] = useState(false);

  console.log(data)
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 12; // Количество новостей на одной странице

  // Определим индексы новостей, которые нужно отображать на текущей странице
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentItems = data.slice(startIndex, endIndex);

  const totalPages = Math.ceil(data.length / itemsPerPage);

  return (
    <div className="w-full max-w-[1440px] mx-auto px-2 flex flex-col gap-8 my-[120px] mdx:my-[200px] 2xl:my-[250px]">
      {adminModal && <NewsMain closeModal={setAdminModal} />}
      <div className="flex w-full justify-between">
        <h2 className="text-[25px] mdx:text-[30px] mdl:text-[35px] xl:text-[40px] font-semibold">
          НОВОСТИ
        </h2>
        <button
          onClick={() => setAdminModal(true)}
          className="px-12 py-3 bg-redMain rounded-xl text-white font-semibold"
        >
          Добавить новость
        </button>
      </div>
      <div className="w-full grid gap-4 grid-cols-1 mdl:grid-cols-2 xl:grid-cols-4 h-auto">
        {currentItems.map((item, i) => (
          <Link key={i} href={`/news/${item.slug}`}>
            <NewCard
              key={i}
              id={item.id}
              title={item.head.heading.slice(0, 70)}
              date={item.createdDate}
              imageSrc={item.head.photo?.url}
              slug={item.slug}
            />
          </Link>
        ))}
      </div>
      <div className="flex w-full justify-center">
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
        />
      </div>
    </div>
  );
}
