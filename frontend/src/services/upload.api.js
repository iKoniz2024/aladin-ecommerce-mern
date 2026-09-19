import axiosPublic from "@/utils/axiosPublic";

/**
 * Uploads a single image file to the backend via Multer.
 * @param {File} file - The image file to upload.
 * @returns {Promise<string>} - Resolves to the uploaded file URL (e.g. "/uploads/filename.png").
 */
export const uploadImage = async (file) => {
  if (!file) return "";

  // If it's already a URL string (not a File object), return as is
  if (typeof file === "string") return file;

  const formData = new FormData();
  formData.append("image", file);

  const { data } = await axiosPublic.post("/upload/single", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });

  return data.url;
};

/**
 * Uploads multiple image files to the backend via Multer.
 * @param {File[]} files - Array of image files.
 * @returns {Promise<string[]>} - Resolves to an array of uploaded file URLs.
 */
export const uploadMultipleImages = async (files) => {
  if (!files || files.length === 0) return [];

  const filesToUpload = files.filter((f) => f instanceof File);
  const existingUrls = files.filter((f) => typeof f === "string");

  if (filesToUpload.length === 0) return existingUrls;

  const formData = new FormData();
  filesToUpload.forEach((file) => {
    formData.append("images", file);
  });

  const { data } = await axiosPublic.post("/upload/multiple", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });

  return [...existingUrls, ...data.urls];
};
