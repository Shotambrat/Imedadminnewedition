"use client";
import { useState } from "react";
import { Transition } from "@headlessui/react";
import Image from "next/image";
import upGreen from "@/public/svg/arrow-up-green.svg";
import downGray from "@/public/svg/arrow-down-gray.svg";

export default function CatalogList({ categories, onCatalogSelect, openSection }) {
  const [openSections, setOpenSections] = useState([openSection]);

  const toggleSection = (section) => {
    setOpenSections((prev) =>
      prev.includes(section)
        ? prev.filter((s) => s !== section)
        : [...prev, section]
    );
  };

  return (
    <section className="w-full">
      <div className="flex flex-col w-full">
        {categories.map(({ id, name, slug, catalogs }) => (
          <div key={id} className="w-full">
            {catalogs.length > 0 ? (
              <div>
                <summary
                  onClick={() => toggleSection(id)}
                  className={`flex gap-5 py-7 ${openSections.includes(id) ? "text-redMain" : "text-black"} font-semibold text-xl max-md:max-w-full cursor-pointer`}
                >
                  <span className="flex-auto">{name}</span>
                  {openSections.includes(id) ? (
                    <Image
                      src={upGreen}
                      alt="Up icon"
                      priority
                      width={20}
                      height={20}
                      quality={100}
                    />
                  ) : (
                    <Image
                      src={downGray}
                      alt="Down icon"
                      priority
                      width={20}
                      height={20}
                      quality={100}
                    />
                  )}
                </summary>
                <Transition
                  show={openSections.includes(id)}
                  enter="transition-all duration-500 ease-in-out"
                  enterFrom="max-h-0 opacity-0"
                  enterTo="max-h-screen opacity-100"
                  leave="transition-all duration-500 ease-in-out"
                  leaveFrom="max-h-screen opacity-100"
                  leaveTo="max-h-0 opacity-0"
                >
                  <div className="overflow-hidden">
                    <div className="flex flex-col gap-5 text-lg font-semibold text-[#252324] w-full px-4">
                      {catalogs.map((catalog) => (
                        <div
                          key={catalog.id}
                          className="cursor-pointer"
                          onClick={() => onCatalogSelect(catalog.id)}
                        >
                          {catalog.name}
                        </div>
                      ))}
                    </div>
                  </div>
                </Transition>
              </div>
            ) : (
              <div
                className="py-7 border-t border-b border-solid border-neutral-200 cursor-pointer"
                onClick={() => onCatalogSelect(null)}
              >
                <span className="text-2xl font-bold text-neutral-900">
                  {name}
                </span>
              </div>
            )}
          </div>
        ))}
      </div>
    </section>
  );
}