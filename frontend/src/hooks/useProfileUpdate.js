import { useState, useEffect } from "react";

const useProfileUpdate = (person, editPerson, setEditing, getCurrentPerson) => {
  const [form, setForm] = useState(null);
  const [imageFile, setImageFile] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

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
          obj[k] = { ...obj[k] };
          obj = obj[k];
        }
      });
      return updated;
    });
  };

  const handleSave = async () => {
    if (!form) return;

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
          if (typeof value === "string" && value.startsWith("blob:")) return;
          formData.append(fullKey, value);
        }
      });
    };

    const formCopy = { ...form };
    delete formCopy.email; // prevent email change
    appendNested(formCopy);

    if (imageFile) {
      formData.append("profileImage", imageFile);
    }

    const res = await editPerson(formData);
    setIsLoading(false);

    if (res.success) {
      alert(res.message || "Profile updated successfully.");
      if (getCurrentPerson) getCurrentPerson();
    } else {
      alert(res.message || "Failed to update profile.");
    }

    setEditing(false);
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
