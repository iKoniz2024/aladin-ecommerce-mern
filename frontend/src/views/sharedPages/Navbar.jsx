"use client";

import Link from 'next/link';
import { useRouter, usePathname, useSearchParams } from 'next/navigation';

import { useState, useEffect } from "react";
import { Search, ShoppingCart, Sun, Moon, ChevronDown, Menu, X, Phone, Package, House, LayoutGrid, Store, TrendingUp, Zap } from "lucide-react";
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
    const searchParams = useSearchParams();
    const [search, setSearch] = useState("");
    const [mobileOpen, setMobileOpen] = useState(false);
    const [mobileCatOpen, setMobileCatOpen] = useState(false);
    const [mounted, setMounted] = useState(false);

    const scrollToSection = (sectionId) => {
        if (pathname === "/") {
            const el = document.getElementById(sectionId);
            if (el) el.scrollIntoView({ behavior: "smooth" });
        } else {
            router.push("/", { state: { scrollTo: sectionId } });
        }
    };

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
        <header className="sticky top-0 z-100 bg-background">
            {/* Top Header */}
            <div className="border-b border-border">
                <div className="mx-auto flex h-16 sm:h-20 max-w-7xl items-center justify-between px-4">
                    <Link href="/" className="flex items-center shrink-0">
                        {mounted && logo && (
                            <img src={logo} alt={siteName} className="h-8 sm:h-14 w-auto object-contain dark:invert" />
                        )}
                    </Link>

                    <div className="hidden flex-1 max-w-xl mx-6 md:block">
                        <form onSubmit={handleSearchSubmit} className="relative">
                            <input
                                type="text"
                                placeholder="Search Product....."
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                className="w-full rounded-lg border border-border bg-muted/50 py-2.5 pl-4 pr-12 text-sm outline-none focus:border-foreground/30 transition-colors"
                            />
                            <button
                                type="submit"
                                className="absolute right-0 top-0 flex h-full items-center justify-center px-3 text-muted-foreground hover:text-foreground transition-colors"
                            >
                                <Search className="size-4" />
                            </button>
                        </form>
                    </div>

                    <div className="flex items-center gap-2 sm:gap-3">
                        <Link
                            href="/orders"
                            className="hidden items-center gap-1.5 rounded-full bg-[#0B3C73] px-3.5 py-2 sm:px-4 sm:py-2.5 text-xs font-bold text-white transition-all hover:bg-[#082d56] md:flex shrink-0 shadow-xs"
                        >
                            <Package className="size-4 shrink-0" />
                            <span>Track Your Order</span>
                        </Link>

                        <a
                            href={`tel:${mounted ? contactPhone : "+8801XXXXXXXXX"}`}
                            className="hidden items-center gap-1.5 rounded-full bg-[#0B3C73] px-3.5 py-2 sm:px-4 sm:py-2.5 text-xs font-bold text-white transition-all hover:bg-[#082d56] md:flex shrink-0 shadow-xs"
                        >
                            <Phone className="size-4 shrink-0" />
                            <span>{mounted ? contactPhone : "+8809613111333"}</span>
                        </a>

                        <div className="hidden h-6 w-px bg-border lg:block" />

                        <button
                            onClick={toggleTheme}
                            className="hidden sm:flex size-9 items-center justify-center rounded-xl text-muted-foreground transition-all duration-200 hover:bg-amber-500/10 hover:text-amber-500 hover:scale-105"
                            title={mounted && theme === "dark" ? "Switch to light mode" : "Switch to dark mode"}
                        >
                            {mounted && theme === "dark" ? <Sun className="size-4 text-amber-500" /> : <Moon className="size-4" />}
                        </button>

                        <Link
                            href="/cart"
                            className="relative hidden sm:flex size-9 items-center justify-center rounded-xl text-muted-foreground transition-all duration-200 hover:bg-amber-500/10 hover:text-amber-500 hover:scale-105"
                        >
                            <ShoppingCart className="size-5" />
                            {cartCount > 0 && (
                                <span className="absolute -right-1.5 -top-1.5 flex size-5 items-center justify-center rounded-full bg-[#FFA800] text-[10px] font-extrabold text-[#0B3C73] shadow-md">
                                    {cartCount}
                                </span>
                            )}
                        </Link>

                        {mounted && (
                            user ? (
                                <div className="relative hidden sm:block group/profile">
                                    <button
                                        className="flex size-9 items-center justify-center rounded-full bg-[#0B3C73] text-sm font-extrabold text-white shadow-md shadow-[#0B3C73]/30 ring-2 ring-[#0B3C73]/40 transition-all duration-200 hover:scale-105 hover:bg-[#082d56]"
                                    >
                                        {user?.name?.charAt(0)?.toUpperCase() || "U"}
                                    </button>
                                    <div className="invisible opacity-0 group-hover/profile:visible group-hover/profile:opacity-100 transition-all duration-200 absolute right-0 top-full z-50 mt-2 w-56 rounded-xl border border-border bg-background py-2 shadow-xl">
                                        <div className="px-4 py-2 border-b border-border">
                                            <p className="text-sm font-semibold text-foreground truncate">{user?.name}</p>
                                            <p className="text-xs text-muted-foreground truncate">{user?.email}</p>
                                        </div>
                                        <Link
                                            href="/dashboard"
                                            className="flex items-center gap-2 px-4 py-2 text-sm text-foreground hover:bg-[#FFA800]/10 hover:text-[#0B3C73] transition-colors font-medium"
                                        >
                                            Dashboard
                                        </Link>
                                        <Link
                                            href="/dashboard/profile"
                                            className="flex items-center gap-2 px-4 py-2 text-sm text-foreground hover:bg-[#FFA800]/10 hover:text-[#0B3C73] transition-colors font-medium"
                                        >
                                            Profile
                                        </Link>
                                        <button
                                            onClick={async () => {
                                                await logout();
                                                router.push("/");
                                            }}
                                            className="flex w-full items-center gap-2 px-4 py-2 text-sm text-red-600 hover:bg-red-50 dark:hover:bg-red-900/10 transition-colors font-medium"
                                        >
                                            Logout
                                        </button>
                                    </div>
                                </div>
                            ) : (
                                <Link
                                    href="/login"
                                    className="hidden sm:inline-block rounded-full bg-[#0B3C73] px-4 py-2 text-xs font-bold text-white transition-all duration-200 hover:bg-[#082d56] shadow-xs"
                                >
                                    Admin Login
                                </Link>
                            )
                        )}

                        <button
                            onClick={() => setMobileOpen(true)}
                            className="flex size-9 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-muted hover:text-foreground md:hidden"
                        >
                            <Menu className="size-5" />
                        </button>
                    </div>
                </div>
            </div>

            {/* Navigation Bar */}
            <nav className="hidden border-b border-border md:block">
                <div className="mx-auto max-w-7xl px-4">
                    <div className="flex items-center gap-1">
                        <Link href="/" className={`flex items-center gap-2 rounded-lg px-4 py-2.5 text-sm font-bold transition-colors border-b-[3px] ${pathname === "/" ? "border-primary text-primary" : "border-transparent text-foreground hover:bg-muted"}`}>
                            <House className="size-4" />
                            <span className="text-base">Home</span>
                        </Link>

                        <div className="relative group/dropdown">
                            <button className="flex items-center gap-2 rounded-lg px-4 py-2.5 text-sm font-bold transition-colors border-b-[3px] border-transparent text-foreground hover:bg-muted">
                                <LayoutGrid className="size-4" />
                                <span className="text-base">Categories</span>
                                <ChevronDown className="size-3.5 text-muted-foreground" />
                            </button>
                            <div className="invisible opacity-0 group-hover/dropdown:visible group-hover/dropdown:opacity-100 transition-all duration-200 fixed left-1/2 -translate-x-1/2 z-200 w-7xl border-b border-border bg-background shadow-xl">
                                <div className="mx-auto max-w-7xl p-6">
                                    <div className="grid grid-cols-6 gap-6">
                                        {mounted && categories?.slice(0, 18).map((cat) => (
                                            <div key={cat._id}>
                                                <Link
                                                    href={`/products?category=${cat.slug}`}
                                                    className="block text-sm font-bold text-foreground hover:text-primary transition-colors mb-2"
                                                >
                                                    {cat.name}
                                                </Link>
                                                {cat.children?.length > 0 && (
                                                    <div className="space-y-1.5">
                                                        {cat.children.map((sub, idx) => (
                                                            <Link
                                                                key={idx}
                                                                href={`/products?category=${sub.slug || cat.slug}`}
                                                                className="block text-sm text-muted-foreground hover:text-primary transition-colors"
                                                            >
                                                                {sub.name}
                                                            </Link>
                                                        ))}
                                                    </div>
                                                )}
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>

                        <Link href="/products" className={`flex items-center gap-2 rounded-lg px-4 py-2.5 text-sm font-bold transition-colors border-b-[3px] ${pathname === "/products" ? "border-primary text-primary" : "border-transparent text-foreground hover:bg-muted"}`}>
                            <Store className="size-4" />
                            <span className="text-base">Shop Product</span>
                        </Link>

                        <Link
                            href="/best-selling"
                            className={`flex items-center gap-2 rounded-lg px-4 py-2.5 text-sm font-bold transition-colors border-b-[3px] ${pathname === "/best-selling" ? "border-primary text-primary" : "border-transparent text-foreground hover:bg-muted"}`}
                        >
                            <TrendingUp className="size-4" />
                            <span className="text-base">Best Selling</span>
                        </Link>

                        <Link
                            href="/flash-sale"
                            className={`flex items-center gap-2 rounded-lg px-4 py-2.5 text-sm font-bold transition-colors border-b-[3px] ${pathname === "/flash-sale" ? "border-primary text-primary" : "border-transparent text-foreground hover:bg-muted"}`}
                        >
                            <Zap className="size-4" />
                            <span className="text-base">Flash Sale</span>
                        </Link>
                    </div>
                </div>
            </nav>

            {/* Mobile Sidebar */}
            {mobileOpen && (
                <div className="fixed inset-0 z-100 md:hidden">
                    <div
                        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
                        onClick={() => setMobileOpen(false)}
                    />
                    <div className="absolute inset-y-0 left-0 w-80 max-w-[85vw] bg-background shadow-2xl overflow-y-auto">
                        <div className="flex items-center justify-between border-b border-border px-5 py-4">
                            <Link href="/" onClick={() => setMobileOpen(false)}>
                                {mounted && logo && (
                                    <img src={logo} alt={siteName} className="h-10 w-auto object-contain dark:invert" />
                                )}
                            </Link>
                            <button
                                onClick={() => setMobileOpen(false)}
                                className="flex size-8 items-center justify-center rounded-lg text-destructive transition-colors hover:bg-destructive/10 hover:text-destructive"
                            >
                                <X className="size-5" />
                            </button>
                        </div>

                        <div className="px-5 py-4">
                            <form onSubmit={handleSearchSubmit} className="relative">
                                <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                                <input
                                    type="text"
                                    placeholder="Search Product....."
                                    value={search}
                                    onChange={(e) => setSearch(e.target.value)}
                                    className="w-full rounded-lg border border-border bg-muted/50 py-2.5 pl-10 pr-10 text-sm outline-none focus:border-foreground/30"
                                />
                                <button type="submit" className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground">
                                    <Search className="size-4" />
                                </button>
                            </form>
                        </div>

                        <div className="px-5 pb-4">
                            <Link
                                href="/orders"
                                onClick={() => setMobileOpen(false)}
                                className="flex items-center gap-3 rounded-xl border border-border bg-muted/50 px-4 py-3 text-sm font-medium text-foreground transition-colors hover:bg-muted"
                            >
                                <Package className="size-5 text-muted-foreground" />
                                <div>
                                    <div className="font-semibold">Track Order</div>
                                    <div className="text-xs text-muted-foreground">Know Your Order Status</div>
                                </div>
                            </Link>
                        </div>

                        <nav className="border-t border-border px-5 py-4">
                            <div className="space-y-1">
                                <Link
                                    href="/"
                                    onClick={() => setMobileOpen(false)}
                                    className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-foreground transition-colors hover:bg-muted"
                                >
                                    Home
                                </Link>

                                <div>
                                    <button
                                        onClick={() => setMobileCatOpen(!mobileCatOpen)}
                                        className="flex w-full items-center justify-between rounded-lg px-3 py-2.5 text-sm font-medium text-foreground transition-colors hover:bg-muted"
                                    >
                                        <span>Categories</span>
                                        <ChevronDown className={`size-4 text-muted-foreground transition-transform ${mobileCatOpen ? "rotate-180" : ""}`} />
                                    </button>
                                    {mobileCatOpen && (
                                        <div className="ml-6 mt-1 space-y-1 border-l-2 border-border pl-4">
                                            {mounted && categories?.map((cat) => (
                                                <Link
                                                    key={cat._id}
                                                    href={`/products?category=${cat.slug}`}
                                                    onClick={() => setMobileOpen(false)}
                                                    className="block rounded-lg px-3 py-2 text-sm text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
                                                >
                                                    {cat.name}
                                                </Link>
                                            ))}
                                        </div>
                                    )}
                                </div>

                                <Link
                                    href="/products"
                                    onClick={() => setMobileOpen(false)}
                                    className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-foreground transition-colors hover:bg-muted"
                                >
                                    Shop Product
                                </Link>

                                <Link
                                    href="/best-selling"
                                    onClick={() => setMobileOpen(false)}
                                    className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-foreground transition-colors hover:bg-muted"
                                >
                                    Best Selling
                                </Link>

                                <Link
                                    href="/flash-sale"
                                    onClick={() => setMobileOpen(false)}
                                    className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-foreground transition-colors hover:bg-muted"
                                >
                                    Flash Sale
                                </Link>
                            </div>
                        </nav>

                        <div className="border-t border-border px-5 py-4 space-y-2">
                            <Link
                                href="/cart"
                                onClick={() => setMobileOpen(false)}
                                className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-foreground transition-colors hover:bg-muted"
                            >
                                <ShoppingCart className="size-4" />
                                Cart {cartCount > 0 && `(${cartCount})`}
                            </Link>
                            {mounted && (
                                user ? (
                                    <>
                                        <div className="rounded-lg bg-muted/50 px-4 py-3">
                                            <p className="text-sm font-semibold text-foreground truncate">{user?.name}</p>
                                            <p className="text-xs text-muted-foreground truncate">{user?.email}</p>
                                        </div>
                                        <Link
                                            href="/dashboard"
                                            onClick={() => setMobileOpen(false)}
                                            className="block w-full rounded-lg border border-border px-4 py-2.5 text-center text-sm font-medium text-foreground transition-colors hover:bg-muted"
                                        >
                                            Dashboard
                                        </Link>
                                        <Link
                                            href="/dashboard/profile"
                                            onClick={() => setMobileOpen(false)}
                                            className="block w-full rounded-lg border border-border px-4 py-2.5 text-center text-sm font-medium text-foreground transition-colors hover:bg-muted"
                                        >
                                            Profile
                                        </Link>
                                        <button
                                            onClick={async () => {
                                                await logout();
                                                setMobileOpen(false);
                                                router.push("/");
                                            }}
                                            className="block w-full rounded-lg border border-red-200 px-4 py-2.5 text-center text-sm font-medium text-red-600 transition-colors hover:bg-red-50 dark:border-red-800 dark:hover:bg-red-900/10"
                                        >
                                            Logout
                                        </button>
                                    </>
                                ) : (
                                    <Link
                                        href="/login"
                                        onClick={() => setMobileOpen(false)}
                                        className="block w-full rounded-full bg-[#0B3C73] px-4 py-2.5 text-center text-sm font-bold text-white transition-colors hover:bg-[#082d56]"
                                    >
                                        Admin Login
                                    </Link>
                                )
                            )}
                        </div>
                    </div>
                </div>
            )}
        </header>
    );
};

export default Navbar;
