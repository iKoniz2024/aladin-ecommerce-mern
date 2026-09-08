"use client";

import { useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { getSettings } from "../services/settings.api";

import { getApiUrl } from "../utils/getApiUrl";

const useSettings = () => {
  const { data, isLoading } = useQuery({
    queryKey: ["settings"],
    queryFn: getSettings,
  });

  const apiUrl = getApiUrl();
  const logo = data?.logo || null;

  useEffect(() => {
    if (typeof document !== "undefined") {
      let iconLinks = document.querySelectorAll("link[rel*='icon']");
      if (logo) {
        const iconUrl = logo.startsWith("data:image/") || logo.startsWith("http")
          ? logo
          : `${apiUrl}/settings/logo`;

        if (iconLinks.length > 0) {
          iconLinks.forEach((link) => {
            if (link && link.href !== iconUrl) link.href = iconUrl;
          });
        } else {
          const link = document.createElement("link");
          link.rel = "icon";
          link.href = iconUrl;
          document.head.appendChild(link);
        }
      } else {
        iconLinks.forEach((link) => {
          if (link && link.parentNode) {
            link.parentNode.removeChild(link);
          }
        });
      }
    }
  }, [logo, apiUrl]);

  return {
    siteName: data?.siteName || "Aladiinn",
    logo,
    contactEmail: data?.contactEmail || "",
    contactPhone: data?.contactPhone || "",
    address: data?.address || "",
    googleMapLink: data?.googleMapLink || "",
    facebookUrl: data?.facebookUrl || "",
    instagramUrl: data?.instagramUrl || "",
    tiktokUrl: data?.tiktokUrl || "",
    youtubeUrl: data?.youtubeUrl || "",
    metaPixelId: data?.metaPixelId || "",
    metaPixels: data?.metaPixels || [],
    isLoading,
  };
};

export default useSettings;
