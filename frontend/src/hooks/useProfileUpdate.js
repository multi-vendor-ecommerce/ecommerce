import { useState, useEffect } from "react";

const useProfileUpdate = (person, editPerson, setEditing, getCurrentPerson) => {
  const [form, setForm] = useState(null);
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

    // Always prevent email changes for security
    const formCopy = { ...form };
    if ("email" in formCopy) delete formCopy.email;

    try {
      const res = await editPerson(formCopy); // Send as JSON, not FormData
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
  };
};

export default useProfileUpdate;