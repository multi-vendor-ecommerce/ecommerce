import { useState, useEffect } from "react";

const useProfileUpdate = (person, editPerson, setEditing, getCurrentPerson, image = "profileImage") => {
  const [form, setForm] = useState(null);
  const [imageFile, setImageFile] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (person) {
      // Deep clone to avoid mutating original person object
      setForm(JSON.parse(JSON.stringify(person)));
    }
  }, [person]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => {
      const keys = name.split(".");
      const updated = { ...prev };
      let obj = updated;
      keys.forEach((k, i) => {
        if (i === keys.length - 1) {
          obj[k] = value;
        } else {
          obj[k] = { ...obj[k] }; // ensure deep copy
          obj = obj[k];
        }
      });
      return updated;
    });
  };

  const handleSave = async () => {
    if (!form) return;

    // Check if anything has changed
    const isChanged = JSON.stringify(form) !== JSON.stringify(person);
    if (!isChanged) {
      alert("No changes to save.");
      setEditing(false);
      return;
    }

    setIsLoading(true);
    const formData = new FormData();

    const appendNested = (obj, parentKey = "") => {
      Object.entries(obj).forEach(([key, value]) => {
        const fullKey = parentKey ? `${parentKey}.${key}` : key;

        if (typeof value === "object" && value !== null && !(value instanceof File)) {
          appendNested(value, fullKey);
        } else {
          // Avoid adding temporary blob URLs to the backend
          if (typeof value === "string" && value.startsWith("blob:")) return;
          if (value !== undefined && value !== null) {
            formData.append(fullKey, value);
          }
        }
      });
    };

    const formCopy = { ...form };

    // Always prevent email changes for security
    if ("email" in formCopy) delete formCopy.email;

    appendNested(formCopy);

    if (imageFile) {
      formData.append(image, imageFile);
    }

    try {
      const res = await editPerson(formData);
      if (res.success) {
        alert(res.message || "Profile updated successfully.");
        if (getCurrentPerson) getCurrentPerson();
      } else {
        alert(res.message || "Failed to update profile.");
      }
    } catch (error) {
      console.error("Profile update failed:", error);
      alert("An unexpected error occurred while updating profile.");
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
    setImageFile,
  };
};

export default useProfileUpdate;