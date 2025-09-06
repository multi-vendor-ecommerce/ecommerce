import { useState, useEffect } from "react";
import { toast } from "react-toastify";

const useProductUpdate = (product, editProduct, setEditing, getProductById) => {
  const [form, setForm] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  // Track changes
  const hasChanges = form && JSON.stringify(form) !== JSON.stringify(product);

  // Required fields for product
  const requiredFields = ["title", "price", "stock", "sku", "hsnCode", "category"];

  useEffect(() => {
    if (product) {
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

    // Only include changed fields
    const diff = {};
    Object.keys(form).forEach((key) => {
      if (form[key] !== product[key]) {
        diff[key] = form[key];
      }
    });

    // Only check required fields that are being updated
    const hasEmptyRequired = requiredFields.some(
      (field) => field in diff && (!diff[field] || diff[field].toString().trim() === "")
    );

    if (hasEmptyRequired) {
      toast.error("Please fill all required fields.");
      return;
    }

    setIsLoading(true);

    try {
      const res = await editProduct(product._id, diff);

      if (res.success) {
        toast.success(res.message || "Product updated successfully.");
        if (getProductById) getProductById(product._id);
      } else {
        toast.error(res.message || "Failed to update product.");
      }
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