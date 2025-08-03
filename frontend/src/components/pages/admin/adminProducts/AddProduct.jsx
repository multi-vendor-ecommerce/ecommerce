import { useState, useContext, useEffect } from "react";
import ProductContext from "../../../../context/products/ProductContext";
import CategoryContext from "../../../../context/categories/CategoryContext";
import Stepper from "../../../common/Stepper";
import StepperControls from "../../../common/StepperControls";

const AddProduct = () => {
  const { addProduct } = useContext(ProductContext);
  const { categoriesByParentId } = useContext(CategoryContext);

  const [step, setStep] = useState(1);
  const [images, setImages] = useState([]);
  const [categoryLevels, setCategoryLevels] = useState([]);
  const [selectedCategories, setSelectedCategories] = useState([]);

  const [formData, setFormData] = useState({
    title: "", brand: "", tags: "", color: "", size: "", sku: "",
    hsnCode: "", gstRate: "", description: "", price: "", discount: "",
    stock: "", isTaxable: true, freeDelivery: false,
    status: "pending", visibility: "public", category: ""
  });

  useEffect(() => {
    loadCategories(null, 0); // Load root categories
  }, []);

  const loadCategories = async (parentId = null, index = 0) => {
    const newCategories = await categoriesByParentId(parentId);
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
    if (!selectedId) {
      setCategoryLevels((prev) => prev.slice(0, levelIndex));
      setSelectedCategories((prev) => prev.slice(0, levelIndex));
      return;
    }
    const updatedSelections = [...selectedCategories.slice(0, levelIndex), selectedId];
    setSelectedCategories(updatedSelections);
    setCategoryLevels((prev) => prev.slice(0, levelIndex + 1));
    setFormData((prev) => ({ ...prev, category: selectedId }));
    loadCategories(selectedId, levelIndex + 1);
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
    Object.entries(formData).forEach(([key, value]) => submitData.append(key, value));
    images.forEach((img) => submitData.append("images", img));
    const success = await addProduct(submitData);
    if (success) {
      alert("Product added successfully!");
      setFormData({
        title: "", brand: "", tags: "", color: "", size: "", sku: "",
        hsnCode: "", gstRate: "", description: "", price: "", discount: "",
        stock: "", isTaxable: true, freeDelivery: false,
        status: "pending", visibility: "public", category: ""
      });
      setImages([]);
      setSelectedCategories([]);
      setCategoryLevels([]);
      loadCategories(null, 0);
      setStep(1);
    } else {
      alert("Failed to add product.");
    }
  };

  const nextStep = () => setStep((prev) => Math.min(prev + 1, 3));
  const prevStep = () => setStep((prev) => Math.max(prev - 1, 1));

  return (
    <div className="max-w-2xl mx-auto mt-10 bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-xl font-semibold mb-4">Add New Product</h2>

      <Stepper
        currentStep={step}
        stepLabels={["Select Category", "Basic Info", "Product Details"]}
      />

      <form onSubmit={handleSubmit} className="space-y-4">
        {step === 1 && (
          <>
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
          </>
        )}

        {step === 2 && (
          <>
            {["brand", "title", "tags", "color", "size", "sku", "hsnCode"].map((field) => (
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
          </>
        )}

        {step === 3 && (
          <>
            <textarea
              name="description"
              placeholder="Product Description"
              className="w-full border p-2 rounded"
              value={formData.description}
              onChange={handleInputChange}
              required
            />

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

            <input
              type="file"
              multiple
              accept="image/*"
              onChange={handleImageChange}
              className="w-full"
              required
            />
          </>
        )}

        {/* Navigation Controls */}
        {step < 3 ? (
          <StepperControls
            currentStep={step}
            totalSteps={3}
            onNext={nextStep}
            onBack={prevStep}
          />
        ) : (
          <div className="flex justify-between gap-4 pt-4">
            <button
              type="button"
              onClick={prevStep}
              className="w-full bg-gray-400 text-white py-2 rounded hover:bg-gray-500"
            >
              Back
            </button>
            <button
              type="submit"
              className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
            >
              Upload Product
            </button>
          </div>
        )}
      </form>
    </div>
  );
};

export default AddProduct;
