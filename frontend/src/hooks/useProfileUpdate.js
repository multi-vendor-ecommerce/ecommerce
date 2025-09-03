import { useState, useEffect } from "react";
import { toast } from "react-toastify";

const useProfileUpdate = (person, editPerson, setEditing, getCurrentPerson) => {
  const [form, setForm] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  // Track if there are changes between form and person
  const hasChanges = form && JSON.stringify(form) !== JSON.stringify(person);

  // Add required fields here
  const requiredFields = ["commissionRate", "gstNumber"];

  // Check for empty required fields
  const hasEmptyRequired = form
    ? requiredFields.some((field) => !form[field] || form[field].toString().trim() === "")
    : false;

  useEffect(() => {
    if (person) {
      // Deep clone to avoid mutating original person object
      setForm(JSON.parse(JSON.stringify(person)));
    }
  }, [person]);

  // Handle nested input changes
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
          obj[k] = obj[k] ? { ...obj[k] } : {};
          obj = obj[k];
        }
      });
      return updated;
    });
  };

  // Save changes
  const handleSave = async () => {
    if (!form || !hasChanges) {
      toast.info("No changes to save.");
      setEditing(false);
      return;
    }

    if (hasEmptyRequired) {
      toast.error("Please fill all required fields.");
      return;
    }

    // Only include fields that actually changed
    const diff = {};
    const compareObjects = (orig, updated, path = "") => {
      Object.keys(updated).forEach((key) => {
        const fullPath = path ? `${path}.${key}` : key;
        if (typeof updated[key] === "object" && updated[key] !== null && !Array.isArray(updated[key])) {
          compareObjects(orig?.[key] || {}, updated[key], fullPath);
        } else if (orig?.[key] !== updated[key]) {
          const keys = fullPath.split(".");
          let curr = diff;
          keys.forEach((k, i) => {
            if (i === keys.length - 1) {
              curr[k] = updated[key];
            } else {
              if (!curr[k]) curr[k] = {};
              curr = curr[k];
            }
          });
        }
      });
    };

    compareObjects(person, form);

    setIsLoading(true);

    try {
      let res;
      if (editPerson.length >= 2) {
        res = await editPerson(person._id, diff);
      } else {
        res = await editPerson(diff);
      }

      if (res.success) {
        toast.success(res.message || "Profile updated successfully.");
        if (getCurrentPerson) getCurrentPerson();
      } else {
        toast.error(res.message || "Failed to update profile.");
      }
    } catch (error) {
      console.error("Profile update failed:", error);
      toast.error("An unexpected error occurred while updating profile.");
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
    hasEmptyRequired,
  };
};

export default useProfileUpdate;