"use client";

import { useMemo, useState, useEffect } from "react";
import { Folder, ChevronRight, CheckCircle2 } from "lucide-react";

export default function CategorySelect({
  categories = [],
  value = "",
  onChange,
  error,
  label = "Category *",
  className = "",
}) {
  // Find initial parent and child based on current value slug
  const { parentCat, childCat } = useMemo(() => {
    if (!value || !Array.isArray(categories)) {
      return { parentCat: null, childCat: null };
    }
    for (const parent of categories) {
      if (parent.slug === value) {
        return { parentCat: parent, childCat: null };
      }
      if (Array.isArray(parent.children)) {
        const foundChild = parent.children.find((child) => child.slug === value);
        if (foundChild) {
          return { parentCat: parent, childCat: foundChild };
        }
      }
    }
    return { parentCat: null, childCat: null };
  }, [value, categories]);

  const [selectedParentSlug, setSelectedParentSlug] = useState("");
  const [selectedChildSlug, setSelectedChildSlug] = useState("");

  // Sync internal state when `value` or `categories` change
  useEffect(() => {
    if (parentCat) {
      setSelectedParentSlug(parentCat.slug);
      setSelectedChildSlug(childCat ? childCat.slug : "");
    } else if (!value) {
      setSelectedParentSlug("");
      setSelectedChildSlug("");
    }
  }, [value, parentCat, childCat]);

  // Handle Main Category Change
  const handleParentChange = (e) => {
    const parentSlug = e.target.value;
    setSelectedParentSlug(parentSlug);
    setSelectedChildSlug("");
    if (onChange) {
      onChange(parentSlug);
    }
  };

  // Handle Subcategory Change
  const handleChildChange = (e) => {
    const childSlug = e.target.value;
    setSelectedChildSlug(childSlug);
    if (onChange) {
      // If child selected, use child slug. If child reset, fall back to parent slug.
      onChange(childSlug || selectedParentSlug);
    }
  };

  // Current active parent object
  const activeParent = useMemo(() => {
    return categories.find((p) => p.slug === selectedParentSlug) || null;
  }, [categories, selectedParentSlug]);

  const hasChildren = Array.isArray(activeParent?.children) && activeParent.children.length > 0;

  return (
    <div className={`space-y-2 ${className}`}>
      {label && (
        <label className="block text-xs font-semibold text-foreground">
          {label}
        </label>
      )}

      <div className="grid gap-2 sm:grid-cols-2">
        {/* Main Category Selector */}
        <div>
          <select
            value={selectedParentSlug}
            onChange={handleParentChange}
            className={`w-full rounded-lg border bg-background px-3 py-2 text-xs sm:text-sm outline-none transition-colors focus:border-ring ${
              error ? "border-destructive" : "border-border"
            }`}
          >
            <option value="">-- Select Main Category --</option>
            {categories.map((parent, pIdx) => (
              <option key={parent._id || `${parent.slug}-${pIdx}`} value={parent.slug}>
                {parent.name || parent.slug}
              </option>
            ))}
          </select>
        </div>

        {/* Subcategory Selector */}
        <div>
          <select
            value={selectedChildSlug}
            onChange={handleChildChange}
            disabled={!selectedParentSlug || !hasChildren}
            className={`w-full rounded-lg border bg-background px-3 py-2 text-xs sm:text-sm outline-none transition-colors focus:border-ring ${
              !selectedParentSlug || !hasChildren
                ? "opacity-60 cursor-not-allowed border-border"
                : error
                ? "border-destructive"
                : "border-border"
            }`}
          >
            {!selectedParentSlug ? (
              <option value="">Select Main Category First</option>
            ) : !hasChildren ? (
              <option value="">(No Subcategories)</option>
            ) : (
              <>
                <option value="">Select Subcategory (Optional)...</option>
                {activeParent.children.map((child, cIdx) => (
                  <option key={child._id || `${selectedParentSlug}-${child.slug}-${cIdx}`} value={child.slug}>
                    ↳ {child.name || child.slug}
                  </option>
                ))}
              </>
            )}
          </select>
        </div>
      </div>

      {/* Selected Category Breadcrumb Badge */}
      {selectedParentSlug && (
        <div className="flex items-center gap-1.5 text-xs text-muted-foreground pt-0.5">
          <span className="inline-flex items-center gap-1 font-semibold text-primary bg-primary/10 px-2 py-0.5 rounded-md">
            <Folder className="size-3" />
            {activeParent?.name || selectedParentSlug}
          </span>
          {selectedChildSlug && (
            <>
              <ChevronRight className="size-3 text-muted-foreground" />
              <span className="inline-flex items-center gap-1 font-semibold text-foreground bg-accent px-2 py-0.5 rounded-md">
                <CheckCircle2 className="size-3 text-emerald-500" />
                {childCat?.name || selectedChildSlug}
              </span>
            </>
          )}
        </div>
      )}

      {error && <p className="mt-1 text-xs text-destructive">{error}</p>}
    </div>
  );
}
