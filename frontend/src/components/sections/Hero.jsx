"use client";

import Link from "next/link";
import { useMemo, useState, useEffect } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination, Navigation } from "swiper/modules";
import { ChevronLeft, ChevronRight, ChevronRight as ArrowRightIcon, Zap, Store, Layers, Sparkles } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { getBanners } from "@/services/banner.api";
import { getCategoriesWithCounts } from "@/services/category.api";
import { getFlashSaleProducts } from "@/services/product.api";
import { getFeaturedVendor } from "@/services/vendor.api";
import CountdownTimer from "./CountdownTimer";

import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";

const heroStyles = `
  .hero-swiper .swiper-pagination-bullet {
    width: 8px;
    height: 8px;
    background: rgba(255, 255, 255, 0.5);
    opacity: 1;
    transition: all 0.3s;
  }
  .hero-swiper .swiper-pagination-bullet-active {
    background: #e11d48;
    width: 20px;
    border-radius: 4px;
  }
`;

export default function Hero({ initialData }) {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Banners query
  const { data: bannerData, isLoading: isBannerLoading } = useQuery({
    queryKey: ["banners"],
    queryFn: getBanners,
    initialData,
  });

  // Categories query for Left Sidebar
  const { data: categoryData } = useQuery({
    queryKey: ["categories-with-counts"],
    queryFn: getCategoriesWithCounts,
  });

  // Flash Sale query for Right Promo Card
  const { data: flashData } = useQuery({
    queryKey: ["flash-sale"],
    queryFn: getFlashSaleProducts,
  });

  // Featured Vendor query
  const { data: featuredVendorData } = useQuery({
    queryKey: ["featured-vendor"],
    queryFn: getFeaturedVendor,
  });

  const banners = useMemo(() => {
    const data = Array.isArray(bannerData) ? bannerData : bannerData?.banners || [];
    return data.filter((b) => b.isActive && (b.image || b.images?.length > 0));
  }, [bannerData]);

  const categories = useMemo(() => {
    const data = Array.isArray(categoryData) ? categoryData : categoryData?.categories || [];
    return data.slice(0, 9);
  }, [categoryData]);

  const flashProducts = useMemo(() => {
    return flashData?.products || [];
  }, [flashData]);

  const featuredVendor = featuredVendorData?.vendor || null;

  return (
    <section id="hero" className="relative overflow-hidden py-4 sm:py-6">
      <style>{heroStyles}</style>

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-12 lg:items-stretch">
          
          {/* ================= LEFT COLUMN: VERTICAL CATEGORY MENU (Desktop) ================= */}
          <div className="hidden lg:col-span-3 lg:flex lg:flex-col justify-between overflow-hidden rounded-2xl border border-border/80 bg-card p-3 shadow-xs">
            <div>
              <div className="mb-3 flex items-center gap-2 border-b border-border/60 pb-2.5 px-2">
                <Layers className="size-4 text-primary" />
                <h3 className="text-sm font-bold text-foreground tracking-tight">Top Categories</h3>
              </div>

              <nav className="space-y-1">
                {categories.length > 0 ? (
                  categories.map((cat, idx) => (
                    <Link
                      key={cat._id || cat.slug || idx}
                      href={`/products?category=${cat.slug}`}
                      className="group flex items-center justify-between rounded-xl px-2.5 py-2 text-xs font-medium text-muted-foreground transition-all duration-200 hover:bg-accent hover:text-foreground"
                    >
                      <div className="flex items-center gap-2.5 truncate">
                        {cat.image ? (
                          <img
                            src={cat.image}
                            alt={cat.name}
                            className="size-5 rounded-md object-cover"
                          />
                        ) : (
                          <div className="size-5 rounded-md bg-muted flex items-center justify-center text-[10px] font-bold text-foreground">
                            {cat.name.charAt(0)}
                          </div>
                        )}
                        <span className="truncate">{cat.name}</span>
                      </div>
                      <ArrowRightIcon className="size-3.5 opacity-0 transition-all duration-200 group-hover:opacity-100 group-hover:translate-x-0.5" />
                    </Link>
                  ))
                ) : (
                  Array.from({ length: 7 }).map((_, i) => (
                    <div key={i} className="h-8 rounded-lg bg-muted/60 animate-pulse" />
                  ))
                )}
              </nav>
            </div>

            <div className="pt-2 border-t border-border/60 mt-2">
              <Link
                href="/products"
                className="flex items-center justify-center gap-1 text-xs font-semibold text-primary hover:underline py-1"
              >
                All Categories <ArrowRightIcon className="size-3" />
              </Link>
            </div>
          </div>

          {/* ================= CENTER COLUMN: MAIN BANNER SLIDER ================= */}
          <div className="lg:col-span-6 flex flex-col justify-center">
            {isBannerLoading ? (
              <div className="flex h-64 sm:h-80 lg:h-full min-h-[340px] items-center justify-center rounded-2xl border border-border bg-muted/30">
                <div className="size-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
              </div>
            ) : banners.length > 0 ? (
              <div className="relative overflow-hidden rounded-2xl border border-border/60 shadow-sm h-full">
                <Swiper
                  modules={[Autoplay, Pagination, Navigation]}
                  speed={800}
                  autoplay={{ delay: 4000, disableOnInteraction: false }}
                  pagination={{ clickable: true }}
                  navigation={{
                    prevEl: ".hero-prev",
                    nextEl: ".hero-next",
                  }}
                  loop={banners.length > 1}
                  className="hero-swiper size-full min-h-[260px] sm:min-h-[320px] lg:min-h-[350px]"
                >
                  {banners.map((banner) => (
                    <SwiperSlide key={banner._id}>
                      <Link href="/products" className="block size-full relative">
                        <img
                          src={banner.image || banner.images?.[0]}
                          alt={banner.title || "Promotional Banner"}
                          className="size-full object-cover object-center min-h-[260px] sm:min-h-[320px] lg:min-h-[350px]"
                        />
                      </Link>
                    </SwiperSlide>
                  ))}

                  {banners.length > 1 && (
                    <>
                      <button className="hero-prev absolute left-3 top-1/2 z-10 flex size-9 -translate-y-1/2 items-center justify-center rounded-full bg-background/80 text-foreground shadow-md backdrop-blur-sm transition-all hover:bg-background hover:scale-105">
                        <ChevronLeft className="size-5" />
                      </button>
                      <button className="hero-next absolute right-3 top-1/2 z-10 flex size-9 -translate-y-1/2 items-center justify-center rounded-full bg-background/80 text-foreground shadow-md backdrop-blur-sm transition-all hover:bg-background hover:scale-105">
                        <ChevronRight className="size-5" />
                      </button>
                    </>
                  )}
                </Swiper>
              </div>
            ) : null}
          </div>

          {/* ================= RIGHT COLUMN: PROMO CARDS (Featured Seller + Flash Deal) ================= */}
          <div className="hidden lg:col-span-3 lg:flex lg:flex-col gap-3 justify-between">
            
            {/* Card 1: Featured Store / Seller Promotion */}
            <div className="flex-1 rounded-2xl border border-border/80 bg-gradient-to-br from-card to-accent/20 p-4 shadow-xs flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="inline-flex items-center gap-1 rounded-full bg-primary/10 px-2.5 py-0.5 text-[11px] font-bold text-primary">
                    <Sparkles className="size-3" /> Featured Store
                  </span>
                  <Store className="size-4 text-muted-foreground" />
                </div>
                
                {featuredVendor ? (
                  <div className="mt-2 flex items-center gap-3">
                    {featuredVendor.vendorInfo?.shopLogo ? (
                      <img src={featuredVendor.vendorInfo.shopLogo} alt={featuredVendor.vendorInfo.shopName} className="size-12 rounded-lg object-cover border border-border/50" />
                    ) : (
                      <div className="size-12 rounded-lg bg-muted flex items-center justify-center text-xs font-bold text-foreground">
                        {featuredVendor.vendorInfo?.shopName?.charAt(0) || "S"}
                      </div>
                    )}
                    <div className="truncate flex-1">
                      <h4 className="text-sm font-bold text-foreground truncate">{featuredVendor.vendorInfo?.shopName || "Top Rated Seller"}</h4>
                      <p className="text-[10px] text-muted-foreground mt-0.5 truncate">
                        {featuredVendor.email}
                      </p>
                    </div>
                  </div>
                ) : (
                  <>
                    <h4 className="text-sm font-bold text-foreground mt-2">Top Rated Seller</h4>
                    <p className="mt-1 text-xs text-muted-foreground line-clamp-2">
                      Discover verified multi-vendor stores offering exclusive discounts & original products.
                    </p>
                  </>
                )}
              </div>
              <Link
                href={featuredVendor ? `/products?shopName=${encodeURIComponent(featuredVendor.vendorInfo?.shopName || "")}` : "/products"}
                className="mt-3 block w-full rounded-xl bg-foreground px-3 py-2 text-center text-xs font-semibold text-background transition-all hover:opacity-90 shadow-xs"
              >
                {featuredVendor ? "Visit Store" : "Explore Stores"}
              </Link>
            </div>

            {/* Card 2: Daily Flash Sale Highlight */}
            <div className="flex-1 rounded-2xl border border-border/80 bg-gradient-to-br from-card to-rose-500/5 p-4 shadow-xs flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="inline-flex items-center gap-1 rounded-full bg-rose-500/10 px-2.5 py-0.5 text-[11px] font-bold text-rose-600 dark:text-rose-400">
                    <Zap className="size-3 fill-rose-500" /> Flash Sale
                  </span>
                  <span className="text-[10px] font-bold uppercase text-muted-foreground">Limited</span>
                </div>
                
                {!isMounted ? (
                  <p className="text-xs text-muted-foreground">Don't miss today's special deal discounts!</p>
                ) : flashProducts.length > 0 ? (
                  <Swiper
                    modules={[Autoplay]}
                    speed={800}
                    autoplay={{ delay: 3000, disableOnInteraction: false }}
                    loop={flashProducts.length > 1}
                    className="w-full"
                  >
                    {flashProducts.map((fp) => (
                      <SwiperSlide key={fp._id || fp.id}>
                        <Link href={`/product/${fp._id}`} className="group flex gap-4 items-center my-2">
                          <img
                            src={fp.thumbnail || fp.images?.[0] || fp.image}
                            alt={fp.title || fp.name}
                            className="size-16 sm:size-20 rounded-xl object-cover border border-border/50 shrink-0"
                          />
                          <div className="truncate flex-1">
                            <h5 className="text-sm font-bold text-foreground truncate mb-1 group-hover:text-rose-600 transition-colors">{fp.title || fp.name}</h5>
                            <div className="flex items-center gap-2 mt-0.5">
                              <span className="text-sm sm:text-base font-extrabold text-rose-600">৳{fp.discountPercentage > 0 ? (fp.price * (1 - fp.discountPercentage / 100)).toFixed(0) : fp.price}</span>
                              {fp.discountPercentage > 0 && (
                                <span className="text-xs text-muted-foreground line-through">৳{fp.price}</span>
                              )}
                            </div>
                          </div>
                        </Link>
                      </SwiperSlide>
                    ))}
                  </Swiper>
                ) : (
                  <p className="text-xs text-muted-foreground">Don't miss today's special deal discounts!</p>
                )}
              </div>

              <div className="mt-3">
                <div className="mb-3 flex justify-center">
                  <CountdownTimer size="sm" />
                </div>
                <Link
                  href="/products"
                  className="block w-full rounded-xl bg-rose-600 px-3 py-2 text-center text-xs font-semibold text-white transition-all hover:bg-rose-700 shadow-xs"
                >
                  Grab Deal Now
                </Link>
              </div>
            </div>

          </div>

        </div>
      </div>
    </section>
  );
}
