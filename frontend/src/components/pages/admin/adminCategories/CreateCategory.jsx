import { useContext, useEffect, useState } from "react";
import CategoryContext from "../../../../context/categories/CategoryContext";
import InputField from "../../../common/InputField";
import Button from "../../../common/Button";
import BackButton from "../../../common/layout/BackButton";
import { FiPlus, FiPlusCircle, FiX } from "react-icons/fi";
import CustomSelect from "../../../common/layout/CustomSelect";
import useCategorySelection from "../../../../hooks/useCategorySelection";
import { toast } from "react-toastify";

const CreateCategory = () => {
  const { createCategory, loading } = useContext(CategoryContext);

  // local state to work with useCategorySelection
  const [selectedCategories, setSelectedCategories] = useState([""]);
  const [isEditing, setIsEditing] = useState(false); // <-- add this

  const {
    categoryLevels,
    handleCategoryClick,
    getSelectedCategoryPath,
    loadCategories,
  } = useCategorySelection(() => { }, setSelectedCategories, selectedCategories);

  // Form state
  const [form, setForm] = useState({ name: "", description: "", parent: "" });
  const [categoryImage, setCategoryImage] = useState(null);

  // Handle text input change
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // ✅ Pick the last valid selected category (not "none")
  const parentCategoryId =
    [...selectedCategories].reverse().find((id) => id && id !== "none") || "";

  // Handle form submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsEditing(true); // <-- set editing true

    // Build FormData
    const formData = new FormData();
    formData.append("name", form.name);
    formData.append("description", form.description);
    if (parentCategoryId) formData.append("parent", parentCategoryId);

    // ✅ Only allow image if root-level category
    if (!parentCategoryId && categoryImage) {
      formData.append("categoryImage", categoryImage);
    }

    const result = await createCategory(formData);

    if (result.success) {
      toast.success(result.message || "Category created successfully!");
      setForm({ name: "", description: "", parent: "" });
      setCategoryImage(null);
      setSelectedCategories(["none"]);
      loadCategories();
    } else {
      toast.error(result.message || "Failed to create category.");
    }
    setIsEditing(false); // <-- set editing false after submit
  };

  useEffect(() => {
    loadCategories(); // Load root categories on mount
  }, []);

  return (
    <section className="bg-gray-100 min-h-screen p-6 shadow-md">
      <BackButton />

      <div className="mt-4 mb-6 flex justify-between items-center gap-2">
        <h2 className="text-xl md:text-2xl font-bold">Create Category</h2>
      </div>

      <form className="flex flex-col gap-6 justify-start items-start">
        <div className="w-full bg-white p-6 rounded-lg hover:shadow-blue-500 shadow-md transition duration-200 space-y-4">
          <InputField
            label="Category Name *"
            name="name"
            value={form.name}
            onChange={handleChange}
            required
            placeholder="Category Name"
          />

          <InputField
            label="Description *"
            name="description"
            value={form.description}
            onChange={handleChange}
            placeholder="Description"
          />
        </div>

        {/* File Upload → only for root categories */}
        {!parentCategoryId && (
          <div className="w-full min-h-[200px] bg-white rounded-lg hover:shadow-blue-500 shadow-md transition duration-200 flex flex-col justify-center gap-3 p-6">
            <div className="bg-gray-200 w-full p-6 rounded-lg flex flex-col justify-center items-center">
              <div>
                <label
                  htmlFor="images"
                  className="flex flex-col font-medium text-gray-700 items-center gap-2 cursor-pointer"
                  title="Upload at least one clear image"
                >
                  <FiPlusCircle size={50} className="text-blue-600" />
                  <span className="text-base md:text-lg mb-1">
                    Upload Category Image
                  </span>
                </label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => setCategoryImage(e.target.files[0])}
                  className="hidden"
                  id="images"
                />
              </div>
              <p className="text-yellow-600 text-xs md:text-sm">
                Image size should not exceed 2MB.
              </p>
            </div>

            <div>
              <div className="text-lg md:text-xl font-semibold">Image:</div>
              {categoryImage && (
                <div className="flex flex-wrap gap-3 mt-2 mb-3">
                  <div className="w-24 h-24 rounded-lg overflow-hidden relative">
                    <img
                      src={
                        categoryImage instanceof File
                          ? URL.createObjectURL(categoryImage)
                          : categoryImage.url || categoryImage
                      }
                      alt={`preview`}
                      className="w-full h-full object-cover"
                    />
                    <button
                      type="button"
                      className="absolute inset-0 flex items-center justify-center bg-black/30 hover:bg-red-600/60 transition rounded-lg cursor-pointer"
                      style={{ zIndex: 2 }}
                      onClick={() => setCategoryImage(null)}
                      title="Delete image"
                    >
                      <FiX size={50} className="text-white select-none pointer-events-none" />
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Multi-level Parent Category Selector */}
        <div className="w-full bg-white p-6 rounded-lg hover:shadow-blue-500 shadow-md transition duration-200">
          <label className="block font-medium mb-2">Parent Category</label>
          <div className="flex flex-col gap-4">
            {categoryLevels.map((level, idx) => (
              <CustomSelect
                key={idx}
                options={[
                  { value: "none", label: "None" },
                  ...level.map((cat) => ({
                    value: cat._id,
                    label: cat.name,
                  })),
                ]}
                value={selectedCategories[idx] || ""}
                onChange={(value) => handleCategoryClick(value, idx)}
                menuPlacement="auto"
              />
            ))}
          </div>

          {/* ✅ Always show clean path */}
          <div className="mt-2 text-sm text-gray-500">
            Selected Path:{" "}
            {selectedCategories.includes("none")
              ? "Parent Level"
              : getSelectedCategoryPath() || "—"}
          </div>
        </div>

        <Button
          icon={FiPlus}
          text={loading && isEditing ? "Adding..." : "Add Category"}
          disabled={loading || isEditing || !form.name.trim() || !form.description.trim()}
          type="submit"
          onClick={handleSubmit}
          className="py-2"
        />
      </form>
    </section>
  );
};

export default CreateCategory;