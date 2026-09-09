"use client";

import Link from 'next/link';
import { useState } from "react";

import { motion } from "framer-motion";

import { Badge } from "@/components/ui/badge";
import { formatBDT } from "@/utils/currency";
import OrderModal from "@/components/ui/OrderModal";
import { useAuth } from "@/hooks/useAuth";

function StockBar({ stock, maxStock }) {
  const percentage = maxStock > 0 ? Math.min((stock / maxStock) * 100, 100) : 0;
  const isLow = percentage <= 25;

  return (
    <div className="space-y-1">
      <div className="flex items-center justify-between">
        <span className="text-[11px] text-muted-foreground">
          {stock} left
        </span>
        <span className="text-[11px] text-muted-foreground">
          {Math.round(percentage)}%
        </span>
      </div>
      <div className="h-1.5 w-full overflow-hidden rounded-full bg-muted">
        <div
          className={`h-full rounded-full transition-all duration-500 ${
            isLow ? "bg-foreground" : "bg-primary"
          }`}
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
}

export default function FlashSaleProductCard({ product, index, maxStock }) {
  const [showModal, setShowModal] = useState(false);
  const { user } = useAuth();
  const isAdmin = user?.role === "admin";
  const hasDiscount = product.discountPercentage > 0;
  const discountedPrice = hasDiscount
    ? (product.price * (1 - product.discountPercentage / 100)).toFixed(2)
    : null;

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
      >
        <Link
          href={`/product/${product._id}`}
          className="group block h-full"
        >
          <div className="flex h-full flex-col overflow-hidden rounded-xl border border-border bg-card shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg">
            <div className="relative overflow-hidden bg-muted aspect-square">
              <img
                src={product.thumbnail || product.images?.[0] || undefined}
                alt={product.title}
                className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                loading="lazy"
              />

              {hasDiscount && (
                <div className="absolute left-0 top-3 z-10 rounded-none bg-gradient-to-r from-orange-500 via-pink-500 to-rose-500 px-1.5 py-1 text-[11px] sm:text-xs font-black text-white tracking-tight shadow-md animate-pulse">
                  -{Math.round(product.discountPercentage)}%
                </div>
              )}

              {product.stock <= 5 && product.stock > 0 && (
                <div className="absolute right-3 top-3 z-10">
                  <Badge variant="secondary" className="text-[11px] font-semibold">
                    Only {product.stock} left
                  </Badge>
                </div>
              )}

              {product.stock === 0 && (
                <div className="absolute inset-0 z-10 flex items-center justify-center bg-background/60 backdrop-blur-sm">
                  <Badge variant="destructive" className="text-xs font-semibold">
                    Out of Stock
                  </Badge>
                </div>
              )}
            </div>

            <div className="flex flex-1 flex-col justify-between gap-2.5 p-3">
              <div className="flex items-center justify-between gap-2">
                <h3 className="truncate text-xs font-semibold text-foreground sm:text-sm">
                  {product.title}
                </h3>

                <div className="flex items-baseline gap-1 shrink-0">
                  <span className="text-xs font-bold text-foreground sm:text-sm">
                    {formatBDT(hasDiscount ? discountedPrice : product.price)}
                  </span>
                  {hasDiscount && (
                    <span className="text-[10px] text-muted-foreground line-through">
                      {formatBDT(product.price)}
                    </span>
                  )}
                </div>
              </div>

              {!isAdmin && (
                <button
                  disabled={product.stock === 0}
                  onClick={(e) => {
                    e.preventDefault();
                    setShowModal(true);
                  }}
                  className="w-full rounded-lg bg-[#FFA800] text-[#0B3C73] py-1.5 text-xs sm:text-sm font-bold transition-all duration-200 hover:bg-[#e69500] hover:shadow-xs active:scale-[0.99] disabled:opacity-50"
                >
                  {product.stock === 0 ? "Unavailable" : "Order Now"}
                </button>
              )}
            </div>
          </div>
        </Link>
      </motion.div>

      {!isAdmin && (
        <OrderModal
          product={product}
          open={showModal}
          onClose={() => setShowModal(false)}
        />
      )}
    </>
  );
}
