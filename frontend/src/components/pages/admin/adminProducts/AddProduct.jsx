import { useState, useContext, useEffect } from "react";
import ProductContext from "../../../../context/products/ProductContext";
import CategoryContext from "../../../../context/categories/CategoryContext";

const AddProduct = () => {
  const { addProduct } = useContext(ProductContext);
  const { categories, getAllCategories, loading } = useContext(CategoryContext);

  useEffect(() => {
    getAllCategories();
  }, []);

  const initialForm = {
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
    status: "pending", // as per schema
    visibility: "public", // default
  };

  const [formData, setFormData] = useState(initialForm);
  const [images, setImages] = useState([]);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    let val = value;

    if (type === "checkbox") val = checked;

    if (["title", "brand", "category"].includes(name)) {
      val = val.trimStart().replace(/\s+/g, " ");
    }

    setFormData((prev) => ({
      ...prev,
      [name]: val,
    }));
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
      setFormData(initialForm);
      setImages([]);
    } else {
      alert("Failed to add product.");
    }
  };

  return (
    <div className="max-w-2xl mx-auto mt-10 bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-xl font-semibold mb-4">Add New Product</h2>
      <form onSubmit={handleSubmit} className="space-y-4">

        {/* Basic text inputs */}
        {[
          { name: "title", placeholder: "Product Title" },
          { name: "brand", placeholder: "Brand" },
          { name: "tags", placeholder: "Tags (comma-separated)" },
          { name: "color", placeholder: "Color" },
          { name: "size", placeholder: "Size" },
          { name: "sku", placeholder: "SKU" },
          { name: "hsnCode", placeholder: "HSN Code" },
        ].map(({ name, placeholder }) => (
          <input
            key={name}
            name={name}
            type="text"
            placeholder={placeholder}
            className="w-full border p-2 rounded"
            value={formData[name]}
            onChange={handleInputChange}
            required={["title", "category", "sku", "hsnCode"].includes(name)}
          />
        ))}

        <label className="block">
          <span className="text-sm text-gray-600">Category</span>
          <select
            name="category"
            value={formData.category}
            onChange={handleInputChange}
            required
            className="w-full border p-2 rounded"
          >
            <option value="">Select Category</option>
            {categories.map((cat) => (
              <option key={cat._id} value={cat._id}>
                {cat.name}
              </option>
            ))}
          </select>
        </label>


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
        {[
          { name: "price", placeholder: "Price" },
          { name: "discount", placeholder: "Discount %" },
          { name: "stock", placeholder: "Stock" },
          { name: "gstRate", placeholder: "GST Rate (e.g., 0, 5, 12)" },
        ].map(({ name, placeholder }) => (
          <input
            key={name}
            name={name}
            type="number"
            placeholder={placeholder}
            className="w-full border p-2 rounded"
            value={formData[name]}
            onChange={handleInputChange}
            required={["price", "stock", "gstRate"].includes(name)}
          />
        ))}

        {/* Checkboxes */}
        <label className="block">
          <input
            type="checkbox"
            name="isTaxable"
            checked={formData.isTaxable}
            onChange={handleInputChange}
            className="mr-2"
          />
          Is Taxable
        </label>

        <label className="block">
          <input
            type="checkbox"
            name="freeDelivery"
            checked={formData.freeDelivery}
            onChange={handleInputChange}
            className="mr-2"
          />
          Free Delivery
        </label>

        {/* Select Status and Visibility */}
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
