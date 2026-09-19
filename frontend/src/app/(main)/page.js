import Home from "@/views/Home/Home";
import { getApiUrl } from "@/utils/getApiUrl";

export const metadata = {
  title: "Home",
};

export const revalidate = 300;

async function safeFetch(url, options = {}) {
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 8000);
    const res = await fetch(url, {
      ...options,
      signal: controller.signal,
    });
    clearTimeout(timeoutId);
    if (!res.ok) return null;
    return await res.json();
  } catch (err) {
    return null;
  }
}

async function fetchHomeData() {
  const baseUrl = getApiUrl();

  const [
    categoriesData,
    newArrivalsData,
    bestSellingData,
    flashSaleData,
    bannersData
  ] = await Promise.all([
    safeFetch(`${baseUrl}/categories/with-counts`, { next: { revalidate: 60 } }),
    safeFetch(`${baseUrl}/products/new-arrivals`, { next: { revalidate: 60 } }),
    safeFetch(`${baseUrl}/products/best-sellers`, { next: { revalidate: 60 } }),
    safeFetch(`${baseUrl}/products/flash-sale`, { next: { revalidate: 60 } }),
    safeFetch(`${baseUrl}/banners`, { cache: "no-store" }),
  ]);

  return {
    categoriesData: categoriesData || [],
    newArrivalsData: newArrivalsData || { products: [] },
    bestSellingData: bestSellingData || { products: [] },
    flashSaleData: flashSaleData || { products: [] },
    bannersData: bannersData || [],
  };
}

export default async function Page() {
  const initialData = await fetchHomeData();

  return <Home initialData={initialData} />;
}
