import { useState, useEffect } from "react";
import { toast } from "react-toastify";

const baseAllowedFields = [
  "name", "profileImage", "profileImageId",
  "address.recipientName", "address.recipientPhone",
  "address.line1", "address.line2", "address.locality",
  "address.city", "address.state", "address.country", "address.pincode",
  "address.geoLocation.lat", "address.geoLocation.lng"
];

// No required fields
const requiredFields = [];

const useProfileUpdate = (person, editPerson, setEditing, getCurrentPerson) => {
  const [form, setForm] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  // Dynamically build allowed fields
  const allowedFields = [...baseAllowedFields];
  if (person?.role === "vendor" && (!person?.companyNameLocked || !person?.companyName)) {
    allowedFields.push("companyName");
  }

  const hasChanges = form && JSON.stringify(form) !== JSON.stringify(person);

  const hasEmptyRequired = form
    ? requiredFields.some((field) => {
      if (field.includes(".")) {
        const keys = field.split(".");
        let value = form;
        for (const k of keys) {
          value = value?.[k];
          if (value === undefined) break;
        }
        return !value || value.toString().trim() === "";
      }
      return !form[field] || form[field].toString().trim() === "";
    })
    : false;

  useEffect(() => {
    if (person) {
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
          obj[k] = obj[k] ? { ...obj[k] } : {};
          obj = obj[k];
        }
      });
      return updated;
    });
  };

  const filterAllowedDiff = (diffObj) => {
    const filtered = {};
    const traverse = (obj, prefix = "") => {
      for (const key in obj) {
        const path = prefix ? `${prefix}.${key}` : key;
        if (allowedFields.includes(path)) {
          filtered[path] = obj[key];
        } else if (obj[key] !== null && typeof obj[key] === "object" && !Array.isArray(obj[key])) {
          traverse(obj[key], path);
        }
      }
    };
    traverse(diffObj);

    const result = {};
    Object.entries(filtered).forEach(([path, value]) => {
      const keys = path.split(".");
      let curr = result;
      keys.forEach((k, i) => {
        if (i === keys.length - 1) {
          curr[k] = value;
        } else {
          if (!curr[k]) curr[k] = {};
          curr = curr[k];
        }
      });
    });
    return result;
  };

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

    // Filter only allowed fields
    const allowedDiff = filterAllowedDiff(diff);

    setIsLoading(true);

    try {
      let res;
      if (editPerson.length >= 2) {
        res = await editPerson(person._id, allowedDiff);
      } else {
        res = await editPerson(allowedDiff);
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
    allowedFields, // expose for frontend to disable locked fields
  };
};

export default useProfileUpdate;