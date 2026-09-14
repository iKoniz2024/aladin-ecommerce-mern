"use client";

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from "react";

import { motion } from "framer-motion";
import { Trophy, Flame, Star, ShoppingCart, Zap } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { formatBDT } from "@/utils/currency";
import OrderModal from "@/components/ui/OrderModal";
import { useAuth } from "@/hooks/useAuth";
import { useAddToCart } from "@/hooks/useAddToCart";
import useSettings from "@/hooks/useSettings";

function StockBar({ stock, maxStock }) {
  if (stock === 0) return null;
  const ref = maxStock || 100;
  const percentage = Math.min((stock / ref) * 100, 100);
  const isLow = percentage <= 25;

  return (
    <div className="space-y-1">
      <div className="flex items-center justify-between">
        <span className={`text-[11px] ${stock <= 5 ? "font-medium text-foreground" : "text-muted-foreground"}`}>
          {stock <= 5 ? `${stock} left` : `${stock} in stock`}
        </span>
        <span className="text-[11px] text-muted-foreground">
          {Math.round(percentage)}%
        </span>
      </div>
      <div className="h-1.5 w-full overflow-hidden rounded-full bg-muted">
        <div
          className={`h-full rounded-full transition-all duration-500 ${isLow ? "bg-foreground" : "bg-primary"
            }`}
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
}

const badgeConfig = {
  "best-seller": {
    label: "Best Seller",
    icon: Trophy,
    className: "bg-foreground text-background",
    ring: "ring-2 ring-foreground/30",
  },
  "top-rated": {
    label: "Top Rated",
    icon: Star,
    className: "bg-foreground text-background",
    ring: "ring-2 ring-foreground/30",
  },
  popular: {
    label: "Popular",
    icon: Flame,
    className: "bg-foreground text-background",
    ring: "ring-2 ring-foreground/30",
  },
};

export default function ProductCard({ product, index, badge }) {
  const router = useRouter();
  const { addToCart } = useAddToCart();
  const { siteName } = useSettings();
  const [showModal, setShowModal] = useState(false);
  const [modalMode, setModalMode] = useState("checkout");
  const { user } = useAuth();
  const isAdminOrVendor = user?.role === "admin" || user?.role === "vendor";
  const hasDiscount = product.discountPercentage > 0;
  const discountedPrice = hasDiscount
    ? (product.price * (1 - product.discountPercentage / 100)).toFixed(2)
    : null;
  const isOutOfStock = product.stock === 0;

  const effectiveBadge = badge !== undefined ? badge : product.badge;
  const sizeMeasurementSizes = Array.isArray(product.sizeMeasurements)
    ? product.sizeMeasurements.map(sm => typeof sm === 'string' ? sm : sm?.size).filter(Boolean)
    : [];
  const hasOptions =
    (Array.isArray(product.sizes) && product.sizes.length > 0) ||
    sizeMeasurementSizes.length > 0 ||
    (Array.isArray(product.colors) && product.colors.length > 0) ||
    (Array.isArray(product.variants) && product.variants.length > 0) ||
    (product.attributes && typeof product.attributes === "object" && Object.entries(product.attributes).some(([k, v]) => Array.isArray(v) && v.length > 0));

  const handleDirectAddToCart = (e) => {
    e.preventDefault();
    setModalMode("cart");
    setShowModal(true);
  };

  const handleDirectOrderNow = (e) => {
    e.preventDefault();
    setModalMode("checkout");
    setShowModal(true);
  };

  return (
    <>
      <motion.div
        custom={index}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-40px" }}
        variants={{
          hidden: { opacity: 0, y: 20 },
          visible: (i) => ({
            opacity: 1,
            y: 0,
            transition: { delay: i * 0.08, duration: 0.5, ease: [0.22, 1, 0.36, 1] },
          }),
        }}
        className="w-[270px] max-w-full h-auto mx-auto shrink-0"
      >
        <div className={`group flex h-auto w-full flex-col overflow-hidden rounded-xl border border-border bg-card shadow-xs transition-all duration-300 hover:-translate-y-1 hover:shadow-md ${badgeConfig[effectiveBadge]?.ring ?? ""}`}>
          <Link href={`/product/${product._id}`} className="relative h-[180px] w-full overflow-hidden bg-muted block shrink-0">
            <img
              src={product.thumbnail || product.images?.[0] || undefined}
              alt={product.title}
              className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
              loading="lazy"
            />

            {hasDiscount && (
              <div className="absolute left-0 top-1.5 z-10 rounded-none bg-gradient-to-r from-orange-500 via-pink-500 to-rose-500 px-1.5 py-0.5 text-[9px] font-black text-white tracking-tight shadow-md animate-pulse">
                -{Math.round(product.discountPercentage)}%
              </div>
            )}

            {effectiveBadge && badgeConfig[effectiveBadge] && (
              <div className="absolute right-1.5 top-1.5 z-10">
                <Badge className={`gap-1 text-[8px] sm:text-[9px] font-semibold px-1 py-0.5 ${badgeConfig[effectiveBadge].className}`}>
                  {(() => { const Icon = badgeConfig[effectiveBadge].icon; return <Icon className="size-2.5" />; })()}
                  <span>{badgeConfig[effectiveBadge].label}</span>
                </Badge>
              </div>
            )}

            {!effectiveBadge && product.stock <= 5 && product.stock > 0 && (
              <div className="absolute right-1.5 top-1.5 z-10">
                <Badge variant="secondary" className="text-[9px] font-semibold px-1.5 py-0.5">
                  Only {product.stock} left
                </Badge>
              </div>
            )}

            {isOutOfStock && (
              <div className="absolute inset-0 z-10 flex items-center justify-center bg-background/60 backdrop-blur-sm">
                <Badge variant="destructive" className="text-[9px] font-semibold px-2 py-0.5">
                  Out of Stock
                </Badge>
              </div>
            )}
          </Link>

          <div className="flex flex-1 flex-col justify-between p-2.5 bg-card shrink-0 gap-2">
            <div className="space-y-0.5">
              {/* Shop Name */}
              <div className="mb-0.5">
                <span className="text-[9px] sm:text-[10px] text-muted-foreground uppercase tracking-wider font-medium">
                  {product.shopName || product.shop?.name || siteName}
                </span>
              </div>

              <Link href={`/product/${product._id}`} className="block">
                <h3 className="line-clamp-1 text-xs sm:text-sm font-semibold text-foreground group-hover:text-primary transition-colors">
                  {product.title}
                </h3>
              </Link>

              <div className="flex items-baseline gap-1 flex-wrap">
                <span className="text-xs sm:text-sm font-bold text-foreground">
                  {formatBDT(hasDiscount ? discountedPrice : product.price)}
                </span>
                {hasDiscount && (
                  <span className="text-[9px] sm:text-[10px] text-muted-foreground line-through font-normal">
                    {formatBDT(product.price)}
                  </span>
                )}
              </div>

              {/* Stock Progress Bar */}
              <div className="mt-1 space-y-1">
                <div className="flex items-center justify-between text-[9px] sm:text-[10px] text-muted-foreground font-medium">
                  <span>{product.stock || 0} in stock</span>
                  <span>{Math.round(Math.min(((product.stock || 0) / (product.maxStock || 100)) * 100, 100))}%</span>
                </div>
                <div className="h-1 w-full rounded-full bg-secondary overflow-hidden">
                  <div
                    className="h-full bg-foreground rounded-full transition-all duration-500"
                    style={{ width: `${Math.round(Math.min(((product.stock || 0) / (product.maxStock || 100)) * 100, 100))}%` }}
                  />
                </div>
              </div>
            </div>

            <div className="flex items-center gap-1 pt-0.5 w-full">
              <button
                disabled={isOutOfStock || isAdminOrVendor}
                onClick={handleDirectAddToCart}
                title={isAdminOrVendor ? "Admins cannot purchase" : "Add to Cart"}
                className={`min-w-0 flex-1 flex items-center justify-center gap-0.5 rounded-full border border-blue-200/80 bg-white dark:bg-card text-[#0B3C73] dark:text-foreground py-1 px-1 text-[9px] sm:text-[10px] font-bold transition-all hover:bg-muted ${isOutOfStock || isAdminOrVendor ? "opacity-50 cursor-not-allowed" : "cursor-pointer"} shadow-2xs`}
              >
                <ShoppingCart className="size-2.5 sm:size-3 shrink-0 text-[#0B3C73] dark:text-foreground" />
                <span className="truncate whitespace-nowrap">Add to Cart</span>
              </button>
              <button
                disabled={isOutOfStock || isAdminOrVendor}
                onClick={handleDirectOrderNow}
                title={isAdminOrVendor ? "Admins cannot purchase" : "Order Now"}
                className={`min-w-0 flex-1 flex items-center justify-center gap-0.5 rounded-full bg-[#FFA800] text-[#0B3C73] py-1 px-1 text-[9px] sm:text-[10px] font-bold transition-all duration-200 hover:bg-[#e69500] active:scale-[0.99] ${isOutOfStock || isAdminOrVendor ? "opacity-50 cursor-not-allowed" : "cursor-pointer"} shadow-2xs`}
              >
                <Zap className="size-2.5 sm:size-3 fill-current shrink-0" />
                <span className="truncate whitespace-nowrap">{isOutOfStock ? "Unavailable" : "Order Now"}</span>
              </button>
            </div>
          </div>
        </div>
      </motion.div>

      {!isAdminOrVendor && (
        <OrderModal
          product={product}
          open={showModal}
          onClose={() => setShowModal(false)}
          mode={modalMode}
        />
      )}
    </>
  );
}
