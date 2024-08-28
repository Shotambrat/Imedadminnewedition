import { useState, useMemo, useEffect, useCallback } from 'react';
import Image from 'next/image';
import { Transition } from '@headlessui/react';
import upGreen from '@/public/svg/arrow-up-green.svg';
import downGray from '@/public/svg/arrow-down-gray.svg';
import { useRouter, useSearchParams, useParams } from 'next/navigation';

// Accordion Item Component
const AccordionItem = ({ title, isOpen, onClick, children }) => (
  <div className="border-t border-b border-solid">
    <summary
      onClick={onClick}
      className={`flex gap-5 py-7 ${
        isOpen ? 'text-redMain' : 'text-black'
      } font-semibold text-xl max-md:max-w-full cursor-pointer`}
    >
      <span className="flex-auto">{title}</span>
      {isOpen ? (
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
      show={isOpen}
      enter="transition-all duration-500 ease-in-out"
      enterFrom="max-h-0 opacity-0"
      enterTo="max-h-screen opacity-100"
      leave="transition-all duration-500 ease-in-out"
      leaveFrom="max-h-screen opacity-100"
      leaveTo="max-h-0 opacity-0"
    >
      <div className="overflow-hidden">{children}</div>
    </Transition>
  </div>
);

// Accordion Content Component
const AccordionContent = ({ children }) => (
  <div className="pb-5 px-4">{children}</div>
);

// Main CatalogList Component
export default function CatalogList({ allCotegories }) {
  const params = useParams();
  const [openSection, setOpenSection] = useState(null);
  const [selectedCatalogId, setSelectedCatalogId] = useState(null);
  const router = useRouter();
  const searchParams = useSearchParams();

  // Automatically open the accordion based on the slug
  useEffect(() => {
    const { slug } = params;

    if (slug && allCotegories) {
      const matchedCategory = allCotegories.data.find(category => category.slug === slug);
      if (matchedCategory) {
        setOpenSection(matchedCategory.id);
      }
    }

    const openSectionId = searchParams.get('openSection');
    const catalogId = searchParams.get('catalogId');
    if (openSectionId) {
      setOpenSection(Number(openSectionId));
    }
    if (catalogId) {
      setSelectedCatalogId(Number(catalogId));
    }
  }, [params.slug, allCotegories, searchParams]);

  // Toggle accordion section and update URL
  const toggleSection = useCallback(
    (id, slug) => {
      const newOpenSection = openSection === id ? null : id;
      setOpenSection(newOpenSection);

      // Construct the new URL with the slug
      const newUrl = `${slug}?openSection=${newOpenSection ?? ''}&catalogId=${selectedCatalogId ?? ''}`;
      router.replace(newUrl, undefined, { shallow: true });
    },
    [openSection, selectedCatalogId, router]
  );

  // Handle catalog click and update URL
  const handleCatalogClick = useCallback(
    (catalogId, slug) => {
      setSelectedCatalogId(catalogId);

      // Construct the new URL with the slug, openSection, and catalogId
      const newUrl = `${slug}?openSection=${openSection ?? ''}&catalogId=${catalogId}`;
      router.replace(newUrl, undefined, { shallow: true });
    },
    [openSection, router]
  );

  const renderedCategories = useMemo(
    () =>
      allCotegories?.data.map(({ id, name, slug, catalogs }) => (
        <div key={id} className="w-full">
          {catalogs.length > 0 ? (
            <AccordionItem
              title={name}
              isOpen={openSection === id}
              onClick={() => toggleSection(id, slug)}
            >
              <AccordionContent>
                <div className="flex flex-col gap-5 text-lg font-semibold text-[#252324] w-full">
                  {catalogs.map(catalogItem => (
                    <div
                      key={catalogItem.id}
                      className={`cursor-pointer ${
                        selectedCatalogId === catalogItem.id
                          ? 'text-red-500'
                          : 'text-black'
                      }`}
                      onClick={() => handleCatalogClick(catalogItem.id, slug)}
                    >
                      {catalogItem.name}
                    </div>
                  ))}
                </div>
              </AccordionContent>
            </AccordionItem>
          ) : (
            <div className="w-full h-full">
              <div className="py-7 border-t border-b border-solid border-neutral-200">
                <span className="text-2xl font-bold text-neutral-900">
                  {name}
                </span>
              </div>
            </div>
          )}
        </div>
      )),
    [allCotegories, openSection, selectedCatalogId, toggleSection, handleCatalogClick]
  );

  return (
    <section className="w-full">
      <div className="flex flex-col w-full">{renderedCategories}</div>
    </section>
  );
}
