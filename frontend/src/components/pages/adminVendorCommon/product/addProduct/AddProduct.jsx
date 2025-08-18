import { useState, useContext } from "react";
import ProductContext from "../../../../../context/products/ProductContext";
import Stepper from "../../../../common/Stepper";
import StepperControls from "../../../../common/StepperControls";
import BackButton from "../../../../common/layout/BackButton";
import CategorySelector from "./CategorySelector";
import { FiExternalLink, FiPlusCircle } from "react-icons/fi";
import CustomSelect from "../../../../common/layout/CustomSelect";
import InputField from "../../../../common/InputField";
import { addProductFields } from "../data/addProductFields";
import * as Checkbox from "@radix-ui/react-checkbox";
import { FaCheck } from "react-icons/fa";

const AddProduct = () => {
  const visibilityOptions = [
    { value: "public", label: "Public" },
    { value: "private", label: "Private" }
  ];

  const { addProduct } = useContext(ProductContext);

  const [step, setStep] = useState(1);
  const [errorMsg, setErrorMsg] = useState("");
  const [images, setImages] = useState([]);
  const [selectedCategories, setSelectedCategories] = useState([]);

  const [formData, setFormData] = useState({
    title: "", brand: "", tags: "", colors: "", size: "", sku: "",
    hsnCode: "", gstRate: "", description: "", price: "", discount: "",
    stock: "", isTaxable: true, freeDelivery: false,
    status: "pending",
    visibility: "public", category: ""
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e) => {
    setImages((prev) => [...prev, ...Array.from(e.target.files)]);
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

    // Append non-array fields
    Object.entries(formData).forEach(([key, value]) => {
      if (!["tags", "colors", "size"].includes(key)) {
        submitData.append(key, value);
      }
    });

    // Handle tags (comma or single value)
    const tagsArray = formData.tags
      .split(",")
      .map((tag) => tag.trim())
      .filter((tag) => tag);
    tagsArray.forEach((tag) => submitData.append("tags", tag));

    // Handle colors (comma or single value)
    const colorsArray = formData.colors
      .split(",")
      .map((colors) => colors.trim())
      .filter((colors) => colors);
    colorsArray.forEach((colors) => submitData.append("colors", colors));

    // Handle sizes (comma or single value)
    const sizesArray = formData.size
      .split(",")
      .map((size) => size.trim())
      .filter((size) => size);
    sizesArray.forEach((size) => submitData.append("sizes", size));

    // Append images
    images.forEach((img) => submitData.append("images", img));

    try {
      const success = await addProduct(submitData);

      if (success) {
        alert("Product added successfully!");
        setFormData({
          title: "", brand: "", tags: "", colors: "", size: "", sku: "",
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
    } catch (err) {
      setErrorMsg(err.message || "Failed to add product.");
    }
  };

  return (
    <section className="bg-gray-100 min-h-screen p-6 rounded-lg shadow-md">
      <BackButton />
      <h2 className="text-xl md:text-2xl font-bold text-gray-800 mt-4 mb-6">Add New Product</h2>

      <div className="rounded-xl border border-gray-200 shadow-md shadow-blue-500 bg-white overflow-hidden p-4">
        {errorMsg && <p className="text-red-600 text-sm md:text-[16px] text-center mb-4">{errorMsg}</p>}

        <Stepper
          className="w-full flex justify-between items-center text-sm md:text-lg font-medium text-gray-700 gap-3 md:gap-1 mb-6"
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

          <div className="space-y-4">
            {(addProductFields[step] || []).map((field, idx) => (
              <div key={idx} className="col-span-2">
                <InputField
                  label={`${field.label}${field.required ? " *" : ""}`}
                  name={field.name}
                  type={field.type || "text"}
                  placeholder={field.placeholder}
                  title={field.title}
                  required={field.required}
                  value={formData[field.name]}
                  onChange={handleInputChange}
                />
                {field.name === "hsnCode" && (
                  <a
                    href={field.link.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="md:ml-1.5 text-blue-600 hover:text-blue-800 truncate"
                  >
                    <span className="inline-flex gap-1 mt-1 items-center">
                      <span className="hover:underline hover:decoration-dotted hover:font-medium">
                        {field.link.text}
                      </span>
                      <FiExternalLink size={16} />
                    </span>
                  </a>
                )}
              </div>
            ))}
          </div>

          {step === 3 && (
            <>
              {["isTaxable", "freeDelivery"].map((field) => (
                <label key={field} className="flex items-center gap-2 cursor-pointer">
                  <Checkbox.Root
                    id={field}
                    checked={formData[field]}
                    onCheckedChange={(checked) =>
                      setFormData((prev) => ({ ...prev, [field]: checked }))
                    }
                    className="w-5 h-5 bg-white border-2 border-gray-300 rounded flex items-center justify-center cursor-pointer"
                  >
                    <Checkbox.Indicator>
                      <FaCheck size={14} className="text-blue-600" />
                    </Checkbox.Indicator>
                  </Checkbox.Root>
                  <span className="text-gray-700">
                    {field.replace(/([A-Z])/g, " $1")}
                  </span>
                </label>
              ))}

              <div className="space-y-2">
                <label htmlFor="visibility" className="block font-medium text-gray-700">Visibility</label>
                <CustomSelect
                  options={visibilityOptions}
                  value={formData.visibility}
                  onChange={(value) => setFormData((prev) => ({ ...prev, visibility: value }))}
                  menuPlacement="auto"
                />
              </div>

              <div className="w-full mb-2">
                <label htmlFor="images" className="flex font-medium text-gray-700 mb-1 items-center gap-2 cursor-pointer" title="Upload at least one clear image">
                  <FiPlusCircle size={20} className="text-blue-600" />
                  <span>Upload Product Images</span>
                </label>
                <input
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={handleImageChange}
                  className="hidden"
                  id="images"
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
