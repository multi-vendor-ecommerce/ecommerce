import { useState, useContext } from "react";
import ProductContext from "../../../../../context/products/ProductContext";
import Stepper from "../../../../common/Stepper";
import StepperControls from "../../../../common/StepperControls";
import BackButton from "../../../../common/layout/BackButton";
import CategorySelector from "./CategorySelector";

const AddProduct = () => {
  const { addProduct } = useContext(ProductContext);

  const [step, setStep] = useState(1);
  const [errorMsg, setErrorMsg] = useState("");
  const [images, setImages] = useState([]);
  const [selectedCategories, setSelectedCategories] = useState([]);

  const [formData, setFormData] = useState({
    title: "", brand: "", tags: "", color: "", size: "", sku: "",
    hsnCode: "", gstRate: "", description: "", price: "", discount: "",
    stock: "", isTaxable: true, freeDelivery: false,
    status: "pending", visibility: "public", category: ""
  });

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    const val = type === "checkbox" ? checked : value;
    setFormData((prev) => ({ ...prev, [name]: val }));
  };

  const handleImageChange = (e) => {
    setImages([...e.target.files]);
  };

  const nextStep = () => {
    setErrorMsg("");
    const skuRegex = /^[A-Za-z0-9_-]{4,20}$/;
    const hsnRegex = /^\d{4,8}$/;

    if (step === 1) {
      const lastSelected = selectedCategories[selectedCategories.length - 1];
      const isLastLevel = lastSelected && formData.category === lastSelected;
      if (!isLastLevel) {
        setErrorMsg("Please select the final subcategory before proceeding.");
        return;
      }
    }

    if (step === 2) {
      const { title, sku, hsnCode } = formData;
      if (!title.trim() || !sku.trim() || !hsnCode.trim()) {
        setErrorMsg("Please fill all required fields.");
        return;
      }
      if (!skuRegex.test(sku.trim())) {
        setErrorMsg("SKU must be 4-20 characters using only letters, numbers, hyphens, or underscores.");
        return;
      }
      if (!hsnRegex.test(hsnCode.trim())) {
        setErrorMsg("HSN Code must be 4 to 8 digits.");
        return;
      }
    }

    setStep((prev) => Math.min(prev + 1, 3));
  };

  const prevStep = () => {
    setErrorMsg("");
    setStep((prev) => Math.max(prev - 1, 1));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg("");

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
      setStep(1);
    } else {
      setErrorMsg("Failed to add product.");
    }
  };

  return (
    <section className="bg-gray-100 min-h-screen p-6 rounded-lg shadow-md">
      <BackButton />
      <h2 className="text-xl md:text-2xl font-bold text-gray-800 mt-4 mb-6">Add New Product</h2>

      <div className="rounded-xl border border-gray-200 shadow-md shadow-blue-500 bg-white overflow-hidden p-4">
        {errorMsg && <p className="text-red-600 text-sm md:text-[16px] text-center mb-4">{errorMsg}</p>}

        <Stepper
          className="flex justify-between items-center text-sm md:text-lg font-medium text-gray-700 gap-3 md:gap-1 mb-6"
          currentStep={step}
          highlightCurrentStep={true}
          stepLabels={["Select Category", "Basic Info", "Product Details"]}
        />

        <form onSubmit={handleSubmit} className="space-y-4">
          {step === 1 && (
            <CategorySelector
              selectedCategories={selectedCategories}
              setSelectedCategories={setSelectedCategories}
              formData={formData}
              setFormData={setFormData}
              onCategoryFinalSelect={(id) =>
                setFormData((prev) => ({ ...prev, category: id }))
              }
            />
          )}

          {step === 2 && (
            <>
              {["brand", "title", "tags", "color", "size", "sku", "hsnCode"].map((field) => {
                const labels = {
                  brand: "Brand",
                  title: "Product Title",
                  tags: "Tags (comma-separated)",
                  color: "Color",
                  size: "Size (e.g. M, L, XL)",
                  sku: "SKU (4-20 characters)",
                  hsnCode: "HSN Code (4-8 digits)",
                };

                const placeholders = {
                  brand: "e.g. Nike",
                  title: "e.g. Running Shoes",
                  tags: "e.g. shoes, running, men",
                  color: "e.g. Red",
                  size: "e.g. L",
                  sku: "e.g. RUN1234",
                  hsnCode: "e.g. 6403",
                };

                return (
                  <div key={field}>
                    <label htmlFor={field} className="block font-medium text-gray-700 mb-1">
                      {labels[field]}
                    </label>
                    <input
                      id={field}
                      name={field}
                      type="text"
                      placeholder={placeholders[field]}
                      title={placeholders[field]}
                      className="w-full bg-gray-200 rounded-xl px-3 py-3.5 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      value={formData[field]}
                      onChange={handleInputChange}
                      required={["title", "sku", "hsnCode"].includes(field)}
                    />
                  </div>
                );
              })}
            </>
          )}

          {step === 3 && (
            <>
              <div>
                <label htmlFor="description" className="block font-medium text-gray-700 mb-1">
                  Product Description
                </label>
                <textarea
                  name="description"
                  placeholder="e.g. High-quality running shoes with breathable material and durable sole."
                  className="w-full bg-gray-200 rounded-xl px-3 py-3.5 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={formData.description}
                  onChange={handleInputChange}
                  required
                />
              </div>

              {["price", "discount", "stock", "gstRate"].map((field) => (
                <div key={field}>
                  <label htmlFor={field} className="block font-medium text-gray-700 mb-1">
                    {field.replace(/([A-Z])/g, " $1")}
                  </label>
                  <input
                    id={field}
                    name={field}
                    type="number"
                    placeholder={`Enter ${field.replace(/([A-Z])/g, " $1").toLowerCase()}`}
                    className="w-full bg-gray-200 rounded-xl px-3 py-3.5 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    value={formData[field]}
                    onChange={handleInputChange}
                    required={["price", "stock", "gstRate"].includes(field)}
                  />
                </div>
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
                  {field.replace(/([A-Z])/g, " $1")}
                </label>
              ))}

              <div className="space-y-2">
                <label htmlFor="status" className="block font-medium text-gray-700">Status</label>
                <select
                  name="status"
                  className="w-full bg-gray-200 rounded-xl px-3 py-3.5 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={formData.status}
                  onChange={handleInputChange}
                >
                  <option value="pending">Pending</option>
                  <option value="approved">Approved</option>
                  <option value="rejected">Rejected</option>
                </select>

                <label htmlFor="visibility" className="block font-medium text-gray-700">Visibility</label>
                <select
                  name="visibility"
                  className="w-full bg-gray-200 rounded-xl px-3 py-3.5 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={formData.visibility}
                  onChange={handleInputChange}
                >
                  <option value="public">Public</option>
                  <option value="private">Private</option>
                </select>
              </div>

              <div className="w-full mb-2">
                <label htmlFor="images" className="block font-medium text-gray-700 mb-1">
                  Upload Product Images
                </label>
                <input
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={handleImageChange}
                  className="cursor-pointer"
                  id="images"
                  required
                  title="Upload at least one clear image"
                />
              </div>

              {images.length > 0 && (
                <div className="flex flex-wrap gap-3 mt-3">
                  {images.map((file, idx) => (
                    <div key={idx} className="w-24 h-24 rounded-lg overflow-hidden border">
                      <img
                        src={URL.createObjectURL(file)}
                        alt={`preview-${idx}`}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  ))}
                </div>
              )}
            </>
          )}

          <StepperControls
            currentStep={step}
            totalSteps={3}
            onNext={nextStep}
            onBack={prevStep}
            isLastStep={step === 3}
            showSubmit={
              step === 3 &&
              formData.description.trim() &&
              formData.price.trim() &&
              formData.stock.trim() &&
              formData.gstRate.trim() &&
              images.length > 0
            }
            submitButton={['Add Product', 'Adding']}
          />
        </form>
      </div>
    </section>
  );
};

export default AddProduct;
