import React, { useContext, useState } from "react";
import CategoryContext from "../../../../context/categories/CategoryContext";
import InputField from "../../../common/InputField";
import Button from "../../../common/Button";
import BackButton from "../../../common/layout/BackButton";
import { FiPlus } from "react-icons/fi";

const CreateCategory = ({ categories = [] }) => {
  const { createCategory, loading } = useContext(CategoryContext);

  // Form state
  const [form, setForm] = useState({
    name: "",
    description: "",
    parent: "",
  });
  const [categoryImage, setCategoryImage] = useState(null);

  // Handle text input change
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // Handle form submit
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Build FormData
    const formData = new FormData();
    formData.append("name", form.name);
    formData.append("description", form.description);
    if (form.parent) formData.append("parent", form.parent);
    if (categoryImage) formData.append("categoryImage", categoryImage);

    const result = await createCategory(formData);

    if (result.success) {
      alert("Category created!");
      setForm({ name: "", description: "", parent: "" });
      setCategoryImage(null);
    } else {
      alert(result.message);
    }
  };

  return (
    <section className="bg-gray-100 min-h-screen p-6 shadow-md">
      <BackButton />

      <div className="mt-4 mb-6 flex justify-between items-center gap-2">
        <h2 className="text-xl md:text-2xl font-bold">Create Category</h2>
      </div>

      <form className="flex flex-col gap-6">
        <div className="w-full bg-white p-6 rounded-lg hover:shadow-blue-500 shadow-md transition duration-200 space-y-4">
          <InputField
            label="Category Name"
            name="name"
            value={form.name}
            onChange={handleChange}
            required
            placeholder="Category Name"
          />

          <InputField
            label="Description"
            name="description"
            value={form.description}
            onChange={handleChange}
            placeholder="Description"
          />
        </div>

        {/* File Upload */}
        <div className="w-full bg-white p-6 rounded-lg hover:shadow-blue-500 shadow-md transition duration-200">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Category Image
          </label>
          <input
            type="file"
            accept="image/*"
            onChange={(e) => setCategoryImage(e.target.files[0])}
            className="w-full border rounded px-3 py-2 focus:outline-none focus:ring focus:border-blue-400"
          />
        </div>

        {/* Parent Category Dropdown */}
        <div className="w-full bg-white p-6 rounded-lg hover:shadow-blue-500 shadow-md transition duration-200">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Parent Category
          </label>
          <select
            name="parent"
            value={form.parent}
            onChange={handleChange}
            className="w-full border rounded px-3 py-2 focus:outline-none focus:ring focus:border-blue-400"
          >
            <option value="">Root Category</option>
            {categories.map((cat) => (
              <option key={cat._id} value={cat._id}>
                {cat.name}
              </option>
            ))}
          </select>
        </div>
      </form>

      <Button
        icon={FiPlus}
        text={loading ? "Adding..." : "Add Category"}
        disabled={loading || !form.name.trim() || !form.description.trim()}
        onClick={handleSubmit}
        className="mt-8 py-2"
      />
    </section>
  );
};

export default CreateCategory;