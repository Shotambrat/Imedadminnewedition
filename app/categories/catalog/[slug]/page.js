import List from '@/app/_components/Catalog/List';
import Application from "@/app/_components/Main/Application";
import { getAllCotegories, getCotegoriesWithSlug, getProductWithCatalogID } from '@/app/lib/api';

export default async function Page({ params, searchParams }) {
  const { slug } = params;
  const id = searchParams?.catalogId || null;

  let productWithCatalogID = [];
  if (id) {
    try {
      productWithCatalogID = await getProductWithCatalogID(id);
    } catch (error) {
      console.error('Error fetching huysos:', error.message);
    }
  }

  let allCotegories = [];
  try {
    allCotegories = await getAllCotegories();
  } catch (error) {
    console.error('Error fetching all categories:', error.message);
  }

  let data = [];
  try {
    data = await getCotegoriesWithSlug({ slug });
    console.log(typeof catalogId);
  } catch (error) {
    console.error('Error fetching data:', error.message);
  }

  return (
    <div className='w-full bg-white flex flex-col'>
      <List data={data} allCotegories={allCotegories} selectedCatalogId={id} productWithCatalogID={productWithCatalogID}/>
      <Application />
    </div>
  );
}
