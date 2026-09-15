"use client";

import Link from "next/link";
import { useMemo, useState, useEffect } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination, Navigation } from "swiper/modules";
import { ChevronLeft, ChevronRight, ChevronRight as ArrowRightIcon, Zap, Store, Sparkles } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { getBanners } from "@/services/banner.api";
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

  const flashProducts = useMemo(() => {
    return flashData?.products || [];
  }, [flashData]);

  const featuredVendor = featuredVendorData?.vendor || null;

  return (
    <section id="hero" className="relative overflow-hidden py-4 sm:py-5">
      <style>{heroStyles}</style>

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Parent container bounding Banner Slider & Right Promo Cards */}
        <div className="grid grid-cols-1 gap-3.5 lg:grid-cols-12 lg:items-stretch">

          {/* ================= MAIN BANNER SLIDER (Takes 8 columns or 9 columns) ================= */}
          <div className="lg:col-span-8 xl:col-span-9 flex flex-col justify-center aspect-[12/5] w-full">
            {isBannerLoading ? (
              <div className="flex size-full items-center justify-center rounded-none border border-border bg-muted/30">
                <div className="size-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
              </div>
            ) : banners.length > 0 ? (
              <div className="relative overflow-hidden rounded-none border border-border/60 shadow-sm size-full">
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
                  className="hero-swiper size-full"
                >
                  {banners.map((banner) => (
                    <SwiperSlide key={banner._id}>
                      <Link href="/products" className="block size-full relative overflow-hidden bg-slate-950 flex items-center justify-center">
                        <img
                          src={banner.image || banner.images?.[0]}
                          alt={banner.title || "Promotional Banner"}
                          className="size-full object-cover object-center"
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
          <div className="hidden lg:col-span-4 xl:col-span-3 lg:flex lg:flex-col justify-between gap-3.5 h-full overflow-hidden">

            {/* Card 1: Featured Store / Seller Promotion */}
            <div className="rounded-2xl border border-border/80 bg-gradient-to-br from-card to-accent/20 p-3.5 sm:p-4 shadow-xs flex flex-col justify-start gap-2.5 shrink-0">
              <div className="flex items-center justify-between">
                <span className="inline-flex items-center gap-1 rounded-full bg-primary/10 px-2.5 py-1 text-xs font-bold text-primary">
                  <Sparkles className="size-3.5" /> Featured Store
                </span>
                <Store className="size-4 text-muted-foreground" />
              </div>

              {featuredVendor ? (
                <div className="flex items-center gap-3">
                  {featuredVendor.vendorInfo?.shopLogo ? (
                    <img src={featuredVendor.vendorInfo.shopLogo} alt={featuredVendor.vendorInfo.shopName} className="size-10 sm:size-11 rounded-xl object-cover border border-border/50 shrink-0" />
                  ) : (
                    <div className="size-10 sm:size-11 rounded-xl bg-muted flex items-center justify-center text-sm font-bold text-foreground shrink-0">
                      {featuredVendor.vendorInfo?.shopName?.charAt(0) || ""}
                    </div>
                  )}
                  <div className="truncate flex-1 min-w-0">
                    <h4 className="text-sm font-bold text-foreground truncate">{featuredVendor.vendorInfo?.shopName || ""}</h4>
                    <p className="text-xs text-muted-foreground truncate mt-0.5">
                      {featuredVendor.email}
                    </p>
                  </div>
                </div>
              ) : null}

              <Link
                href={featuredVendor ? `/products?shopName=${encodeURIComponent(featuredVendor.vendorInfo?.shopName || "")}` : "/products"}
                className="block w-full rounded-full bg-foreground py-2 sm:py-2.5 text-center text-xs sm:text-sm font-bold text-background transition-all hover:opacity-90 shadow-xs"
              >
                Visit Store
              </Link>
            </div>

            {/* Card 2: Daily Flash Sale Highlight */}
            <div className="rounded-2xl border border-border/80 bg-gradient-to-br from-card to-accent/20 p-3.5 sm:p-4 shadow-xs flex flex-col justify-start gap-2.5 shrink-0">

              {/* 1. Header Badge */}
              <div className="flex items-center justify-between shrink-0">
                <span className="inline-flex items-center gap-1 rounded-full bg-rose-500/10 px-2.5 py-1 text-xs font-bold text-rose-600 dark:text-rose-400">
                  <Zap className="size-3.5 fill-rose-500" /> Flash Sale
                </span>
                <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Limited</span>
              </div>

              {/* 2. Product Row */}
              {flashProducts.length > 0 ? (
                <div className="h-13 sm:h-14 overflow-hidden shrink-0">
                  <Swiper
                    modules={[Autoplay]}
                    speed={800}
                    autoplay={{ delay: 3000, disableOnInteraction: false }}
                    loop={flashProducts.length > 1}
                    className="w-full h-full"
                  >
                    {flashProducts.map((fp) => (
                      <SwiperSlide key={fp._id || fp.id} className="h-full flex items-center">
                        <Link href={`/product/${fp._id}`} className="group flex gap-3 items-center w-full">
                          <img
                            src={fp.thumbnail || fp.images?.[0] || fp.image}
                            alt={fp.title || fp.name}
                            className="size-11 sm:size-12 rounded-lg object-cover border border-border/50 shrink-0"
                          />
                          <div className="truncate flex-1 min-w-0">
                            <h5 className="text-xs sm:text-sm font-bold text-foreground truncate group-hover:text-rose-600 transition-colors">{fp.title || fp.name}</h5>
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
                </div>
              ) : null}

              {/* 3. Countdown Timer */}
              <div className="flex justify-center shrink-0">
                <CountdownTimer size="sm" />
              </div>

              {/* 4. Order Now Button */}
              <Link
                href="/products"
                className="block w-full rounded-full bg-rose-600 py-2 sm:py-2.5 text-center text-xs sm:text-sm font-bold text-white transition-all hover:bg-rose-700 shadow-xs shrink-0"
              >
                Order Now
              </Link>
            </div>

          </div>

        </div>
      </div>
    </section>
  );
}
