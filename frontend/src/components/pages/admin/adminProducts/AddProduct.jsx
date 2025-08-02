import { useState, useContext, useEffect } from "react";
import ProductContext from "../../../../context/products/ProductContext";
import CategoryContext from "../../../../context/categories/CategoryContext";

const AddProduct = () => {
  const { addProduct } = useContext(ProductContext);
  const { getCategoriesByLevel } = useContext(CategoryContext);

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    price: "",
    discount: "",
    stock: "",
    brand: "",
    category: "",
    color: "",
    size: "",
    tags: "",
    sku: "",
    hsnCode: "",
    gstRate: "",
    isTaxable: true,
    freeDelivery: false,
    status: "pending",
    visibility: "public",
  });

  const [images, setImages] = useState([]);
  const [categoryLevels, setCategoryLevels] = useState([[]]);
  const [selectedCategories, setSelectedCategories] = useState([]);

  useEffect(() => {
  loadCategories(1, null, 0); // ✅ Properly specify level 1 and no parent
}, []);

  const loadCategories = async (level = 1, parentId = null, index = 0) => {
    const newCategories = await getCategoriesByLevel(level, parentId);
    if (!newCategories || newCategories.length === 0) {
      setCategoryLevels((prev) => prev.slice(0, index + 1));
      setSelectedCategories((prev) => prev.slice(0, index + 1));
      return;
    }
    const updatedLevels = [...categoryLevels.slice(0, index + 1), newCategories];
    setCategoryLevels(updatedLevels);
    setSelectedCategories((prev) => prev.slice(0, index + 1));
  };

  const handleCategoryChange = (e, levelIndex) => {
    const selectedId = e.target.value;
    const updatedSelections = [...selectedCategories];
    updatedSelections[levelIndex] = selectedId;
    setSelectedCategories(updatedSelections);
    setFormData((prev) => ({ ...prev, category: selectedId }));

    loadCategories(levelIndex + 1, selectedId, levelIndex);
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    const val = type === "checkbox" ? checked : value;
    setFormData((prev) => ({ ...prev, [name]: val }));
  };

  const handleImageChange = (e) => {
    setImages([...e.target.files]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const submitData = new FormData();
    Object.entries(formData).forEach(([key, value]) =>
      submitData.append(key, value)
    );
    images.forEach((img) => submitData.append("images", img));

    const success = await addProduct(submitData);

    if (success) {
      alert("Product added successfully!");
      setFormData({
        title: "", description: "", price: "", discount: "", stock: "", brand: "",
        category: "", color: "", size: "", tags: "", sku: "", hsnCode: "",
        gstRate: "", isTaxable: true, freeDelivery: false, status: "pending", visibility: "public"
      });
      setImages([]);
      setSelectedCategories([]);
      setCategoryLevels([categoryLevels[0]]);
    } else {
      alert("Failed to add product.");
    }
  };

  return (
    <div className="max-w-2xl mx-auto mt-10 bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-xl font-semibold mb-4">Add New Product</h2>
      <form onSubmit={handleSubmit} className="space-y-4">

        {/* Category Selects by Levels */}
        {categoryLevels.map((level, idx) => (
          <select
            key={idx}
            className="w-full border p-2 rounded"
            value={selectedCategories[idx] || ""}
            onChange={(e) => handleCategoryChange(e, idx)}
            required={idx === categoryLevels.length - 1}
          >
            <option value="">Select Category Level {idx + 1}</option>
            {level.map((cat) => (
              <option key={cat._id} value={cat._id}>{cat.name}</option>
            ))}
          </select>
        ))}

        {/* Basic text inputs */}
        {["title", "brand", "tags", "color", "size", "sku", "hsnCode"].map((field) => (
          <input
            key={field}
            name={field}
            type="text"
            placeholder={field.replace(/([A-Z])/g, ' $1')}
            className="w-full border p-2 rounded"
            value={formData[field]}
            onChange={handleInputChange}
            required={["title", "sku", "hsnCode"].includes(field)}
          />
        ))}

        {/* Description */}
        <textarea
          name="description"
          placeholder="Product Description"
          className="w-full border p-2 rounded"
          value={formData.description}
          onChange={handleInputChange}
          required
        />

        {/* Number inputs */}
        {["price", "discount", "stock", "gstRate"].map((field) => (
          <input
            key={field}
            name={field}
            type="number"
            placeholder={field.replace(/([A-Z])/g, ' $1')}
            className="w-full border p-2 rounded"
            value={formData[field]}
            onChange={handleInputChange}
            required={["price", "stock", "gstRate"].includes(field)}
          />
        ))}

        {/* Checkboxes */}
        {["isTaxable", "freeDelivery"].map((field) => (
          <label key={field} className="block">
            <input
              type="checkbox"
              name={field}
              checked={formData[field]}
              onChange={handleInputChange}
              className="mr-2"
            />
            {field.replace(/([A-Z])/g, ' $1')}
          </label>
        ))}

        {/* Status & Visibility */}
        <select
          name="status"
          className="w-full border p-2 rounded"
          value={formData.status}
          onChange={handleInputChange}
        >
          <option value="pending">Pending</option>
          <option value="approved">Approved</option>
          <option value="rejected">Rejected</option>
        </select>

        <select
          name="visibility"
          className="w-full border p-2 rounded"
          value={formData.visibility}
          onChange={handleInputChange}
        >
          <option value="public">Public</option>
          <option value="private">Private</option>
        </select>

        {/* Image Upload */}
        <input
          type="file"
          multiple
          accept="image/*"
          onChange={handleImageChange}
          className="w-full"
          required
        />

        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
        >
          Upload Product
        </button>
      </form>
    </div>
  );
};

export default AddProduct;
