"use client";

import Link from 'next/link';
import { useRouter, usePathname, useSearchParams } from 'next/navigation';
import { useState, useEffect } from "react";
import { Search, ShoppingCart, Sun, Moon, Menu, X, Phone, Package, House, Store, TrendingUp, Zap, Sparkles, LayoutGrid, ChevronDown } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import useCart from "@/hooks/useCart";
import useTheme from "@/hooks/useTheme";
import { getCategories } from "@/services/category.api";
import useSettings from "@/hooks/useSettings";
import { getLocalCartCount } from "@/utils/localCart";
import { useAuth } from "@/hooks/useAuth";

const Navbar = () => {
    const { cartCount, refetchCartCount } = useCart();
    const { theme, toggleTheme } = useTheme();
    const { siteName, logo, contactPhone } = useSettings();
    const { user, logout } = useAuth();
    const router = useRouter();
    const pathname = usePathname();
    const [search, setSearch] = useState("");
    const [mobileOpen, setMobileOpen] = useState(false);
    const [mobileCatOpen, setMobileCatOpen] = useState(false);
    const [mounted, setMounted] = useState(false);

    const { data: categories } = useQuery({
        queryKey: ["categories"],
        queryFn: getCategories,
    });

    const handleSearchSubmit = (e) => {
        if (e) e.preventDefault();
        const query = search.trim();
        if (query) {
            router.push(`/products?search=${encodeURIComponent(query)}`);
        } else {
            router.push(`/products`);
        }
        setMobileOpen(false);
    };

    useEffect(() => {
        refetchCartCount(getLocalCartCount());
        setMounted(true);
    }, [refetchCartCount]);

    useEffect(() => {
        if (typeof window !== "undefined") {
            const urlSearch = new URLSearchParams(window.location.search).get("search") || "";
            setSearch(urlSearch);
        }
    }, [pathname]);

    return (
        <header className="sticky top-0 z-100 bg-[#0B3C73] text-white border-b border-[#082d56]">
            {/* Top Header (Lighter Blue - #0B3C73) */}
            <div className="bg-[#0B3C73]">
                <div className="mx-auto flex h-16 sm:h-20 max-w-7xl items-center justify-between px-4 gap-4">
                    {/* Logo */}
                    <Link href="/" className="flex items-center shrink-0">
                        {logo ? (
                            <img src={logo} alt={siteName || "Logo"} className="h-9 sm:h-12 w-auto object-contain" />
                        ) : siteName ? (
                            <span suppressHydrationWarning className="text-xl sm:text-2xl font-black text-white tracking-tight">
                                {siteName}
                            </span>
                        ) : null}
                    </Link>

                    {/* Clean Search Bar */}
                    <div className="hidden flex-1 max-w-2xl md:block">
                        <form onSubmit={handleSearchSubmit} className="relative flex items-center">
                            <input
                                type="text"
                                placeholder="Search thousands of products, brands or vendors..."
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                className="w-full rounded-full border border-white/20 bg-white/10 py-2.5 pl-5 pr-14 text-sm text-white placeholder:text-blue-100/70 outline-none focus:border-[#FFA800] focus:bg-white/15 focus:ring-2 focus:ring-[#FFA800]/30 transition-all"
                            />
                            <button
                                type="submit"
                                className="absolute right-1 top-1/2 -translate-y-1/2 flex h-8 w-11 items-center justify-center rounded-full bg-[#FFA800] text-[#0B3C73] shadow-xs transition-all hover:bg-[#ffb733] hover:scale-105 font-bold"
                                title="Search"
                            >
                                <Search className="size-4" />
                            </button>
                        </form>
                    </div>

                    {/* Right Utilities */}
                    <div className="flex items-center gap-2 sm:gap-3">
                        <Link
                            href="/orders"
                            className="hidden items-center gap-1.5 rounded-full bg-white/10 border border-white/15 px-3.5 py-2 text-xs font-bold text-white transition-all hover:bg-[#FFA800] hover:text-[#0B3C73] hover:border-[#FFA800] md:flex shrink-0 shadow-2xs"
                        >
                            <Package className="size-4 shrink-0 text-[#FFA800] group-hover:text-[#0B3C73]" />
                            <span>Track Order</span>
                        </Link>

                        {mounted && contactPhone && (
                            <a
                                href={`tel:${contactPhone}`}
                                className="hidden items-center gap-1.5 rounded-full border border-white/20 px-3.5 py-2 text-xs font-semibold text-white transition-all hover:bg-white/10 hover:border-[#FFA800] hover:text-[#FFA800] md:flex shrink-0 shadow-2xs"
                            >
                                <Phone className="size-3.5 shrink-0 text-[#FFA800]" />
                                <span>{contactPhone}</span>
                            </a>
                        )}

                        <div className="hidden h-6 w-px bg-white/20 md:block" />

                        <button
                            onClick={toggleTheme}
                            className="hidden sm:flex size-9 items-center justify-center rounded-full border border-white/20 text-white transition-all hover:bg-white/10 hover:scale-105"
                            title={mounted && theme === "dark" ? "Switch to light mode" : "Switch to dark mode"}
                        >
                            {mounted && theme === "dark" ? <Sun className="size-4 text-[#FFA800]" /> : <Moon className="size-4" />}
                        </button>

                        {(!user || (user.role !== "admin" && user.role !== "vendor")) && (
                            <Link
                                href="/cart"
                                className="relative flex size-9 items-center justify-center rounded-full border border-white/20 text-white transition-all hover:bg-white/10 hover:scale-105"
                            >
                                <ShoppingCart className="size-4.5 text-white" />
                                {mounted && cartCount > 0 && (
                                    <span className="absolute -right-1.5 -top-1.5 flex size-5 items-center justify-center rounded-full bg-[#FFA800] text-[10px] font-black text-[#0B3C73] shadow-md">
                                        {cartCount}
                                    </span>
                                )}
                            </Link>
                        )}

                        {mounted && (
                            user ? (
                                <div className="relative hidden sm:block group/profile">
                                    <button
                                        className="flex size-9 items-center justify-center rounded-full bg-[#FFA800] text-sm font-black text-[#0B3C73] shadow-md ring-2 ring-[#FFA800]/40 transition-all duration-200 hover:scale-105"
                                    >
                                        {user?.name?.charAt(0)?.toUpperCase() || "U"}
                                    </button>
                                    <div className="invisible opacity-0 group-hover/profile:visible group-hover/profile:opacity-100 transition-all duration-200 absolute right-0 top-full z-50 mt-2 w-56 rounded-2xl border border-white/20 bg-[#0B3C73] p-2 shadow-2xl text-white">
                                        <div className="px-3 py-2 border-b border-white/15 mb-1">
                                            <p className="text-sm font-bold text-white truncate">{user?.name}</p>
                                            <p className="text-xs text-blue-100/70 truncate">{user?.email}</p>
                                        </div>
                                        <Link
                                            href={user?.role === "vendor" ? "/dashboard/vendor" : "/dashboard"}
                                            className="flex items-center gap-2 rounded-xl px-3 py-2 text-xs font-semibold text-white hover:bg-white/10 hover:text-[#FFA800] transition-colors"
                                        >
                                            Dashboard
                                        </Link>
                                        <Link
                                            href="/dashboard/profile"
                                            className="flex items-center gap-2 rounded-xl px-3 py-2 text-xs font-semibold text-white hover:bg-white/10 hover:text-[#FFA800] transition-colors"
                                        >
                                            Profile
                                        </Link>
                                        <button
                                            onClick={async () => {
                                                await logout();
                                                router.push("/");
                                            }}
                                            className="flex w-full items-center gap-2 rounded-xl px-3 py-2 text-xs font-semibold text-rose-300 hover:bg-rose-950/40 transition-colors"
                                        >
                                            Logout
                                        </button>
                                    </div>
                                </div>
                            ) : (
                                <Link
                                    href="/login"
                                    className="hidden sm:inline-flex rounded-full bg-[#FFA800] px-4 py-2 text-xs font-black text-[#0B3C73] transition-all duration-200 hover:bg-[#ffb733] shadow-md hover:scale-105"
                                >
                                    Login
                                </Link>
                            )
                        )}

                        <button
                            onClick={() => setMobileOpen(true)}
                            className="flex size-9 items-center justify-center rounded-lg border border-white/20 text-white transition-colors hover:bg-white/10 md:hidden"
                        >
                            <Menu className="size-5" />
                        </button>
                    </div>
                </div>
            </div>

            {/* Second Navigation Bar (Darker Blue - #082d56) */}
            <nav className="hidden border-t border-[#093260] md:block bg-[#082d56]">
                <div className="relative mx-auto max-w-7xl px-4">
                    <div className="flex h-12 sm:h-13 items-center justify-between">
                        <div className="flex items-center gap-1.5">
                            <Link href="/" className={`flex items-center gap-2 rounded-xl px-4 py-2 text-xs sm:text-sm font-bold transition-all ${pathname === "/" ? "bg-white/15 text-[#FFA800] border border-white/10 shadow-2xs" : "text-blue-100/80 hover:bg-white/10 hover:text-white"}`}>
                                <House className="size-4 text-[#FFA800]" />
                                <span>Home</span>
                            </Link>

                            {/* Categories Mega Dropdown */}
                            <div className="group/cat">
                                <button className="flex items-center gap-2 rounded-xl px-4 py-2 text-xs sm:text-sm font-bold text-blue-100/80 hover:bg-white/10 hover:text-white transition-all cursor-pointer">
                                    <LayoutGrid className="size-4 text-[#FFA800]" />
                                    <span>Categories</span>
                                    <ChevronDown className="size-3.5 text-blue-100/70 group-hover/cat:rotate-180 transition-transform duration-200" />
                                </button>

                                {/* Mega Dropdown Menu (Full Content Width - Glassmorphism) */}
                                <div className="invisible opacity-0 group-hover/cat:visible group-hover/cat:opacity-100 transition-all duration-200 absolute left-4 right-4 top-full z-100 mt-1 rounded-2xl border border-white/60 dark:border-slate-800/80 bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl p-6 shadow-2xl text-slate-900 dark:text-white">
                                    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-6 max-h-[420px] overflow-y-auto pr-1">
                                        {categories && categories.length > 0 ? (
                                            categories.map((cat, idx) => (
                                                <div key={cat._id || `${cat.slug || 'cat'}-${idx}`} className="space-y-2">
                                                    <Link
                                                        href={`/products?category=${cat.slug}`}
                                                        className="block text-sm sm:text-base font-extrabold text-slate-900 dark:text-white hover:text-primary transition-colors truncate"
                                                    >
                                                        {cat.name}
                                                    </Link>
                                                    {cat.children && cat.children.length > 0 && (
                                                        <ul className="space-y-1.5 text-xs sm:text-sm text-slate-600 dark:text-slate-300 font-medium">
                                                            {cat.children.map((child, cIdx) => (
                                                                <li key={child._id || `${child.slug || 'child'}-${cIdx}`}>
                                                                    <Link
                                                                        href={`/products?category=${child.slug}`}
                                                                        className="hover:text-slate-900 dark:hover:text-white hover:underline block truncate"
                                                                    >
                                                                        {child.name}
                                                                    </Link>
                                                                </li>
                                                            ))}
                                                        </ul>
                                                    )}
                                                </div>
                                            ))
                                        ) : (
                                            <p className="text-xs text-slate-400 col-span-full">Loading categories...</p>
                                        )}
                                    </div>
                                </div>
                            </div>

                            <Link href="/products" className={`flex items-center gap-2 rounded-xl px-4 py-2 text-xs sm:text-sm font-bold transition-all ${pathname === "/products" ? "bg-white/15 text-[#FFA800] border border-white/10 shadow-2xs" : "text-blue-100/80 hover:bg-white/10 hover:text-white"}`}>
                                <Store className="size-4 text-[#FFA800]" />
                                <span>Shop Products</span>
                            </Link>

                            <Link
                                href="/best-selling"
                                className={`flex items-center gap-2 rounded-xl px-4 py-2 text-xs sm:text-sm font-bold transition-all ${pathname === "/best-selling" ? "bg-white/15 text-[#FFA800] border border-white/10 shadow-2xs" : "text-blue-100/80 hover:bg-white/10 hover:text-white"}`}
                            >
                                <TrendingUp className="size-4 text-[#FFA800]" />
                                <span>Best Selling</span>
                            </Link>

                            <Link
                                href="/flash-sale"
                                className={`flex items-center gap-2 rounded-xl px-4 py-2 text-xs sm:text-sm font-bold transition-all ${pathname === "/flash-sale" ? "bg-white/15 text-[#FFA800] border border-white/10 shadow-2xs" : "text-blue-100/80 hover:bg-white/10 hover:text-white"}`}
                            >
                                <Zap className="size-4 text-rose-400 fill-rose-400/20" />
                                <span>Flash Deals</span>
                            </Link>
                        </div>

                        <div className="flex items-center gap-2">
                            <Link
                                href="/become-seller"
                                className="flex items-center gap-1.5 rounded-full bg-[#FFA800] text-[#0B3C73] px-4 py-1.5 text-xs font-black transition-all hover:bg-[#ffb733] hover:scale-105 shadow-md"
                            >
                                <Sparkles className="size-3.5 text-[#0B3C73]" />
                                <span>Become a Seller</span>
                            </Link>
                        </div>
                    </div>
                </div>
            </nav>

            {/* Mobile Drawer */}
            {mobileOpen && (
                <div className="fixed inset-0 z-100 md:hidden">
                    <div
                        className="absolute inset-0 bg-black/60 backdrop-blur-xs"
                        onClick={() => setMobileOpen(false)}
                    />
                    <div className="absolute inset-y-0 left-0 w-80 max-w-[85vw] bg-[#0B3C73] text-white shadow-2xl overflow-y-auto border-r border-white/10">
                        <div className="flex items-center justify-between border-b border-white/15 px-5 py-4">
                            <Link href="/" onClick={() => setMobileOpen(false)}>
                                {logo ? (
                                    <img src={logo} alt={siteName || "Logo"} className="h-9 w-auto object-contain" />
                                ) : siteName ? (
                                    <span suppressHydrationWarning className="text-lg font-black text-white">{siteName}</span>
                                ) : null}
                            </Link>
                            <button
                                onClick={() => setMobileOpen(false)}
                                className="flex size-8 items-center justify-center rounded-lg text-white/80 hover:bg-white/10 hover:text-white"
                            >
                                <X className="size-5" />
                            </button>
                        </div>

                        <div className="px-5 py-4">
                            <form onSubmit={handleSearchSubmit} className="relative">
                                <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-blue-100/70" />
                                <input
                                    type="text"
                                    placeholder="Search products or vendors..."
                                    value={search}
                                    onChange={(e) => setSearch(e.target.value)}
                                    className="w-full rounded-full border border-white/20 bg-white/10 py-2.5 pl-10 pr-4 text-xs text-white placeholder:text-blue-100/60 outline-none focus:border-[#FFA800]"
                                />
                            </form>
                        </div>

                        <nav className="border-t border-white/15 px-5 py-3 space-y-1">
                            <Link
                                href="/"
                                onClick={() => setMobileOpen(false)}
                                className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-blue-100 hover:bg-white/10 hover:text-white"
                            >
                                <House className="size-4 text-[#FFA800]" /> Home
                            </Link>

                            <Link
                                href="/products"
                                onClick={() => setMobileOpen(false)}
                                className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-blue-100 hover:bg-white/10 hover:text-white"
                            >
                                <Store className="size-4 text-[#FFA800]" /> Shop Products
                            </Link>

                            <Link
                                href="/best-selling"
                                onClick={() => setMobileOpen(false)}
                                className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-blue-100 hover:bg-white/10 hover:text-white"
                            >
                                <TrendingUp className="size-4 text-[#FFA800]" /> Best Selling
                            </Link>

                            <Link
                                href="/flash-sale"
                                onClick={() => setMobileOpen(false)}
                                className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-blue-100 hover:bg-white/10 hover:text-white"
                            >
                                <Zap className="size-4 text-rose-400" /> Flash Deals
                            </Link>
                        </nav>
                    </div>
                </div>
            )}
        </header>
    );
};

export default Navbar;
