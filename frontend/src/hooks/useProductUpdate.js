import { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { appendCommaSeparatedToFormData } from "../utils/appendCommaSeparatedToFormData";

const useProductUpdate = (product, editProduct, setEditing, getProductById) => {
  const [form, setForm] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  // Track changes
  const hasChanges = form && JSON.stringify(form) !== JSON.stringify(product);

  useEffect(() => {
    if (product) {
      // Deep clone so we don't mutate original
      setForm(JSON.parse(JSON.stringify(product)));
    }
  }, [product]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSave = async () => {
    if (!form || !hasChanges) {
      toast.info("No changes to save.");
      setEditing(false);
      return;
    }

    // Build diff object (only changed fields)
    const diff = {};
    Object.keys(form).forEach((key) => {
      if (form[key] !== product[key]) {
        diff[key] = form[key];
      }
    });

    // Remove specs if not needed
    delete diff.specifications;

    // === Always use FormData ===
    const payload = new FormData();

    Object.entries(diff).forEach(([key, value]) => {
      if (value === undefined || value === null) return;

      if (key === "images") {
        value.forEach((img) => {
          if (img instanceof File) {
            payload.append("images", img); // new uploads
          } else if (img.url && img.public_id) {
            payload.append(
              "existingImages",
              JSON.stringify({ url: img.url, public_id: img.public_id })
            );
          }
        });
      } else if (["tags", "colors", "sizes"].includes(key) && typeof value === "string") {
        // Use utility to append comma-separated values
        appendCommaSeparatedToFormData(payload, key, value);
      } else if (Array.isArray(value) || typeof value === "object") {
        // stringify arrays/objects (colors, sizes, tags, category, etc.)
        payload.append(key, JSON.stringify(value));
      } else if (key === "dimensions" && typeof value === "object") {
        payload.append("dimensions", JSON.stringify(value));
      } else if (key === "weight") {
        payload.append("weight", Number(value));
      } else {
        payload.append(key, value);
      }
    });

    setIsLoading(true);

    try {
      const res = await editProduct(product._id, payload);
      if (res.success) {
        toast.success(res.message || "Product updated successfully.");
        if (getProductById) getProductById(product._id);
      } else {
        toast.error(res.message || "Failed to update product.");
      }
      return res;
    } catch (error) {
      console.error("Product update failed:", error);
      toast.error("An unexpected error occurred while updating product.");
    } finally {
      setIsLoading(false);
      setEditing(false);
    }
  };

  return {
    form,
    setForm,
    handleChange,
    handleSave,
    isLoading,
    hasChanges,
  };
};

export default useProductUpdate;