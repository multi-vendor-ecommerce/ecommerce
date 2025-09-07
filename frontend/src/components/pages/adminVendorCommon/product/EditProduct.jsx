import { useState, useEffect, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Loader from "../../../common/Loader";
import ProductContext from "../../../../context/products/ProductContext";
import CategorySelector from "./addEditCommon/CategorySelector";
import UploadImages from "./addEditCommon/UploadImages";
import BasicInfo from "./addEditCommon/BasicInfo";
import ProductDetails from "./addEditCommon/ProductDetails";
import useProductUpdate from "../../../../hooks/useProductUpdate";
import ActionButtons from "../../../common/ActionButtons";
import { toast } from "react-toastify";
import BackButton from "../../../common/layout/BackButton";
import Button from "../../../common/Button";
import { FiTrash2 } from "react-icons/fi";
import PersonContext from "../../../../context/person/PersonContext";

const EditProduct = () => {
  const { person } = useContext(PersonContext);
  const { productId } = useParams();
  const navigate = useNavigate();
  const { getProductById, editProduct, deleteProduct } = useContext(ProductContext);

  const role = person?.role

  const [product, setProduct] = useState(null);
  const [editing, setEditing] = useState(false);

  useEffect(() => {
    if (!productId) return;
    const fetchProduct = async () => {
      const prod = await getProductById(productId);

      // ✅ Normalize images to { url, public_id }
      const normalized = {
        ...prod,
        images:
          prod.images?.map((img) =>
            typeof img === "string" ? { url: img } : img
          ) || [],
      };

      setProduct(normalized);
    };
    fetchProduct();
  }, [productId]);

  const {
    form,
    setForm,
    handleChange,
    handleSave,
    isLoading,
    hasChanges,
  } = useProductUpdate(product, editProduct, setEditing, getProductById);

  // === Image Handlers (form.images is single source of truth) ===
  const handleImageChange = (e) => {
    const newFiles = Array.from(e.target.files);
    setForm((prev) => ({
      ...prev,
      images: [...(prev.images || []), ...newFiles],
    }));
    e.target.value = "";
  };

  const handleImageDelete = (idx) => {
    setForm((prev) => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== idx),
    }));
  };

  // === Category Handling ===
  const [selectedCategories, setSelectedCategories] = useState([]);
  useEffect(() => {
    if (form?.category) setSelectedCategories([form.category]);
  }, [form]);

  const handleCategoryFinalSelect = (id) => {
    setForm((prev) => ({ ...prev, category: id }));
    setSelectedCategories([id]);
  };

  // === Save Handler ===
  const handleSaveFunction = async () => {
    if (!hasChanges) {
      toast.info("No changes to save.");
      setEditing(false);
      return;
    }

    const result = await handleSave();
    if (result?.success) {
      setEditing(false);
      navigate(`/${role}/all-products`); // ✅ absolute path
    } else if (result?.message) {
      toast.error(result.message);
    }
  };

  // === Delete Handler ===
  const handleDelete = async () => {
    const confirmed = confirm("Are you sure you want to delete this product? This action cannot be undone.");
    if (!confirmed) return;
    const res = await deleteProduct(productId);
    if (res.success) {
      toast.success(res.message || "Product deleted successfully.");
      navigate(`/${role}/all-products`);
    } else {
      toast.error(res.message || "Failed to delete product.");
    }
  };

  if (!form) {
    return (
      <section className="bg-gray-100 min-h-screen flex items-center justify-center">
        <Loader />
      </section>
    );
  }

  return (
    <section className="p-6 min-h-screen bg-gray-50">
      <BackButton />

      <div className="flex justify-between items-center mb-3">
        <h2 className="text-xl md:text-2xl font-bold text-gray-800">
          Edit Product
        </h2>

        <div className="mb-4">
          <ActionButtons
            editing={editing}
            isLoading={isLoading}
            onEdit={() => setEditing(true)}
            onCancel={() => {
              // Reset form back to original product data
              setForm(JSON.parse(JSON.stringify(product)));
              setEditing(false);
            }}
            onSave={handleSaveFunction}
          />
        </div>
      </div>

      <div>
        <form className="flex flex-col gap-6">
          {/* Category Selector (only if rejected) */}
          {form?.status === "rejected" && (
            <div className="rounded-xl border border-gray-200 shadow-md shadow-blue-500 bg-white overflow-hidden p-4">
              <h2 className="text-lg font-semibold mb-4">
                Please select a category
              </h2>
              <CategorySelector
                selectedCategories={selectedCategories}
                setSelectedCategories={setSelectedCategories}
                formData={form}
                setFormData={setForm}
                onCategoryFinalSelect={handleCategoryFinalSelect}
                isEditing={editing}
                showStepper={false}
              />
            </div>
          )}

          {/* Upload Images */}
          <div className="rounded-xl border border-gray-200 shadow-md shadow-blue-500 bg-white overflow-hidden p-4">
            <h2 className="text-lg font-semibold mb-4">Upload Images</h2>
            <UploadImages
              handleImageChange={handleImageChange}
              handleImageDelete={handleImageDelete}
              images={form.images || []}
              isEditing={editing}
              showStepper={false}
            />
          </div>

          {/* Basic Info & Product Details */}
          <div className="rounded-xl border border-gray-200 shadow-md shadow-blue-500 bg-white overflow-hidden p-4 space-y-4">
            <h2 className="text-lg font-semibold">Product Details</h2>
            <BasicInfo
              formData={form}
              handleInputChange={handleChange}
              isEditing={editing}
              showStepper={false}
            />

            <ProductDetails
              formData={form}
              handleInputChange={handleChange}
              setFormData={setForm}
              loading={isLoading}
              handleSubmit={handleSave}
              isEditing={editing}
              showStepper={false}
            />
          </div>
        </form>

        <Button
          icon={FiTrash2}
          text="Delete Product"
          className="mt-6 py-3"
          color="red"
          onClick={handleDelete}
        />
      </div>
    </section>
  );
};

export default EditProduct;