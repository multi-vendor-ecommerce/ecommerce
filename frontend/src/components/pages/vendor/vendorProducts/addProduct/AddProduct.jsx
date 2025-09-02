import { useState, useContext } from "react";
import ProductContext from "../../../../../context/products/ProductContext";
import Stepper from "../../../../common/Stepper";
import BackButton from "../../../../common/layout/BackButton";
import CategorySelector from "./CategorySelector";
import { appendCommaSeparatedToFormData } from "../../../../../utils/appendCommaSeparatedToFormData";
import UploadImages from "./UploadImages";
import BasicInfo from "./BasicInfo";
import ProductDetails from "./ProductDetails";
import { toast } from "react-toastify";

const AddProduct = () => {
  const { addProduct, loading } = useContext(ProductContext);

  const [step, setStep] = useState(1);
  const [images, setImages] = useState([]);
  const [selectedCategories, setSelectedCategories] = useState([]);

  const [formData, setFormData] = useState({
    title: "", brand: "", tags: "", colors: "", size: "", sku: "",
    hsnCode: "", gstRate: "", description: "", price: "", discount: "",
    stock: "", isTaxable: true, freeDelivery: false,
    visibility: "public", category: ""
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e) => {
    const newFiles = Array.from(e.target.files);
    setImages((prev) => {
      const existing = prev.map(f => f.name + f.size);
      const filtered = newFiles.filter(f => !existing.includes(f.name + f.size));
      return [...prev, ...filtered];
    });
    e.target.value = "";
  };

  const handleImageDelete = (idx) => {
    setImages(prev => prev.filter((_, i) => i !== idx));
  };

  const nextStep = () => {
    const skuRegex = /^[A-Za-z0-9_-]{4,20}$/;
    const hsnRegex = /^\d{4,8}$/;

    if (step === 1) {
      const lastSelected = selectedCategories[selectedCategories.length - 1];
      const isLastLevel = lastSelected && formData.category === lastSelected;
      if (!isLastLevel) {
        toast.error("Please select the final subcategory before proceeding.");
        return;
      }
    }

    if (step === 2) {
      if (images && images.length === 0) {
        toast.error("Please upload at least one product image.");
        return;
      }
    }

    if (step === 3) {
      const { title, sku, hsnCode } = formData;
      if (!title.trim() || !sku.trim() || !hsnCode.trim()) {
        toast.error("Please fill all required fields.");
        return;
      }
      if (!skuRegex.test(sku.trim())) {
        toast.error("SKU must be 4-20 characters using only letters, numbers, hyphens, or underscores.");
        return;
      }
      if (!hsnRegex.test(hsnCode.trim())) {
        toast.error("HSN Code must be 4 to 8 digits.");
        return;
      }
    }

    setStep((prev) => Math.min(prev + 1, 4));
  };

  const prevStep = () => {
    setStep((prev) => Math.max(prev - 1, 1));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const submitData = new FormData();

    Object.entries(formData).forEach(([key, value]) => {
      if (!["tags", "colors", "size"].includes(key)) {
        submitData.append(key, value);
      }
    });

    [
      { key: "tags", formKey: "tags" },
      { key: "colors", formKey: "colors" },
      { key: "sizes", formKey: "size" }
    ].forEach(({ key, formKey }) => {
      const value = formData[formKey];
      if (value && value.trim()) {
        if (!value.includes(",")) submitData.append(key, value.trim());
      } else appendCommaSeparatedToFormData(submitData, key, value);
    });

    images.forEach((img) => submitData.append("images", img));

    try {
      const { success, message } = await addProduct(submitData);

      if (success) {
        toast.success(message || "Product added successfully.");
        setFormData({
          title: "", brand: "", tags: "", colors: "", size: "", sku: "",
          hsnCode: "", gstRate: "", description: "", price: "", discount: "",
          stock: "", isTaxable: true, freeDelivery: false,
          visibility: "public", category: ""
        });
        setImages([]);
        setSelectedCategories([]);
        setStep(1);
      } else {
        toast.error(message || "Failed to add product.");
      }
    } catch (err) {
      toast.error(err.message || "Failed to add product.");
    }
  };

  return (
    <section className="bg-gray-100 min-h-screen p-6 rounded-lg shadow-md">
      <BackButton />
      <h2 className="text-xl md:text-2xl font-bold text-gray-800 mt-4 mb-6">Add New Product</h2>

      <div className="rounded-xl border border-gray-200 shadow-md shadow-blue-500 bg-white overflow-hidden p-4">
        <Stepper
          className="w-full flex justify-between items-center text-sm md:text-lg font-medium text-gray-700 gap-3 md:gap-1 mb-6"
          currentStep={step}
          highlightCurrentStep={true}
          stepLabels={["Select Category", "Upload Images", "Basic Info", "Product Details"]}
        />

        <form className="space-y-4">
          {step === 1 && (
            <CategorySelector
              step={step}
              nextStep={nextStep}
              prevStep={prevStep}
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
            <UploadImages
              step={step}
              nextStep={nextStep}
              prevStep={prevStep}
              handleImageChange={handleImageChange}
              handleImageDelete={handleImageDelete}
              images={images}
            />
          )}

          {step === 3 && (
            <BasicInfo
              formData={formData}
              step={step}
              nextStep={nextStep}
              prevStep={prevStep}
              handleInputChange={handleInputChange}
            />
          )}

          {step === 4 && (
            <ProductDetails
              formData={formData}
              step={step}
              nextStep={nextStep}
              prevStep={prevStep}
              handleInputChange={handleInputChange}
              setFormData={setFormData}
              loading={loading}
              handleSubmit={handleSubmit}
            />
          )}
        </form>
      </div>
    </section>
  );
};

export default AddProduct;
