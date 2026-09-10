"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Store, CheckCircle2, ArrowRight, ArrowLeft } from "lucide-react";
import { registerVendor } from "@/services/auth.api";
import toast from "react-hot-toast";

export default function BecomeSeller() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    shopName: "",
    shopPhone: "",
    shopAddress: "",
    description: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await registerVendor(formData);
      if (res.success) {
        toast.success(res.message || "Application submitted successfully!");
        setSubmitted(true);
      }
    } catch (err) {
      const msg = err?.response?.data?.message || "Failed to submit application.";
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[85vh] bg-muted/10 py-8 px-4 sm:px-6">
      <div className="mx-auto max-w-2xl">
        {/* Back to Home Button */}
        <div className="mb-4">
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 rounded-xl border border-border bg-card px-3.5 py-2 text-xs font-semibold text-muted-foreground transition-all hover:bg-muted hover:text-foreground shadow-2xs"
          >
            <ArrowLeft className="size-3.5" />
            <span>Back to Home</span>
          </Link>
        </div>

        {/* Simple Header */}
        <div className="text-center mb-8">
          <div className="mx-auto mb-3 flex size-12 items-center justify-center rounded-2xl bg-[#0B3C73]/10 text-[#0B3C73] dark:bg-white/10 dark:text-[#FFA800]">
            <Store className="size-6" />
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-foreground tracking-tight">
            Register as a Seller
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Fill in your shop details below to apply for a seller account.
          </p>
        </div>

        {/* Form Container */}
        {submitted ? (
          <div className="rounded-2xl border border-border bg-card p-8 text-center shadow-xs">
            <div className="mx-auto flex size-14 items-center justify-center rounded-full bg-emerald-500/10 text-emerald-500 mb-3">
              <CheckCircle2 className="size-8" />
            </div>
            <h2 className="text-xl font-bold text-foreground">Application Submitted!</h2>
            <p className="mt-2 text-sm text-muted-foreground">
              Your vendor request has been sent for review. You will be able to log in once an administrator approves your shop.
            </p>
            <div className="mt-6">
              <button
                onClick={() => router.push("/login")}
                className="inline-flex items-center gap-2 rounded-xl bg-[#0B3C73] px-6 py-2.5 text-sm font-bold text-white shadow-xs transition-all hover:bg-[#082d56]"
              >
                Go to Login <ArrowRight className="size-4" />
              </button>
            </div>
          </div>
        ) : (
          <div className="rounded-2xl border border-border bg-card p-6 sm:p-8 shadow-xs">
            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-muted-foreground mb-1.5">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    name="name"
                    required
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="Enter your name"
                    className="w-full rounded-xl border border-border bg-background px-3.5 py-2.5 text-sm text-foreground outline-none focus:border-[#0B3C73] focus:ring-2 focus:ring-[#0B3C73]/15 transition-all"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-muted-foreground mb-1.5">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    name="email"
                    required
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="seller@example.com"
                    className="w-full rounded-xl border border-border bg-background px-3.5 py-2.5 text-sm text-foreground outline-none focus:border-[#0B3C73] focus:ring-2 focus:ring-[#0B3C73]/15 transition-all"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-muted-foreground mb-1.5">
                    Password *
                  </label>
                  <input
                    type="password"
                    name="password"
                    required
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="Set account password"
                    className="w-full rounded-xl border border-border bg-background px-3.5 py-2.5 text-sm text-foreground outline-none focus:border-[#0B3C73] focus:ring-2 focus:ring-[#0B3C73]/15 transition-all"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-muted-foreground mb-1.5">
                    Shop / Brand Name *
                  </label>
                  <input
                    type="text"
                    name="shopName"
                    required
                    value={formData.shopName}
                    onChange={handleChange}
                    placeholder="e.g. Aladiinn Fashion"
                    className="w-full rounded-xl border border-border bg-background px-3.5 py-2.5 text-sm text-foreground outline-none focus:border-[#0B3C73] focus:ring-2 focus:ring-[#0B3C73]/15 transition-all"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-muted-foreground mb-1.5">
                    Phone Number *
                  </label>
                  <input
                    type="text"
                    name="shopPhone"
                    required
                    value={formData.shopPhone}
                    onChange={handleChange}
                    placeholder="017xxxxxxxx"
                    className="w-full rounded-xl border border-border bg-background px-3.5 py-2.5 text-sm text-foreground outline-none focus:border-[#0B3C73] focus:ring-2 focus:ring-[#0B3C73]/15 transition-all"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-muted-foreground mb-1.5">
                    Shop Location / Address
                  </label>
                  <input
                    type="text"
                    name="shopAddress"
                    value={formData.shopAddress}
                    onChange={handleChange}
                    placeholder="Dhaka, Bangladesh"
                    className="w-full rounded-xl border border-border bg-background px-3.5 py-2.5 text-sm text-foreground outline-none focus:border-[#0B3C73] focus:ring-2 focus:ring-[#0B3C73]/15 transition-all"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-muted-foreground mb-1.5">
                  About Your Shop / Products
                </label>
                <textarea
                  name="description"
                  rows={3}
                  value={formData.description}
                  onChange={handleChange}
                  placeholder="Briefly describe what items or brands you sell..."
                  className="w-full rounded-xl border border-border bg-background px-3.5 py-2.5 text-sm text-foreground outline-none focus:border-[#0B3C73] focus:ring-2 focus:ring-[#0B3C73]/15 transition-all"
                />
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full rounded-xl bg-[#0B3C73] py-3 text-sm font-bold text-white shadow-xs transition-all hover:bg-[#082d56] disabled:opacity-50"
                >
                  {loading ? "Submitting Application..." : "Submit Application"}
                </button>
              </div>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}
