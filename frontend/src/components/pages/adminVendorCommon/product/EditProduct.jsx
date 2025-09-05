import { useState, useEffect, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import Loader from "../../../common/Loader";
import Button from "../../../common/Button";
import ProductContext from "../../../../context/products/ProductContext";
import CategorySelector from "../../../pages/vendor/vendorProducts/addProduct/CategorySelector";
import UploadImages from "../../../pages/vendor/vendorProducts/addProduct/UploadImages";
import BasicInfo from "../../../pages/vendor/vendorProducts/addProduct/BasicInfo";
import ProductDetails from "../../../pages/vendor/vendorProducts/addProduct/ProductDetails";

const EditProduct = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { getProductById, editProduct, loading } = useContext(ProductContext);

  const [formData, setFormData] = useState({
    title: "", brand: "", tags: "", colors: "", size: "", sku: "",
    hsnCode: "", gstRate: "", description: "", price: "", discount: "",
    stock: "", isTaxable: true, freeDelivery: false,
    visibility: "public", category: ""
  });
  const [images, setImages] = useState([]);
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [productStatus, setProductStatus] = useState("");

  useEffect(() => {
    const fetchProduct = async () => {
      const product = await getProductById(id);
      if (product) {
        setFormData({
          title: product.title || "",
          brand: product.brand || "",
          tags: product.tags?.join(",") || "",
          colors: product.colors?.join(",") || "",
          size: product.sizes?.join(",") || "",
          sku: product.sku || "",
          hsnCode: product.hsnCode || "",
          gstRate: product.gstRate || "",
          description: product.description || "",
          price: product.price || "",
          discount: product.discount || "",
          stock: product.stock || "",
          isTaxable: product.isTaxable ?? true,
          freeDelivery: product.freeDelivery ?? false,
          visibility: product.visibility || "public",
          category: product.category || ""
        });
        setImages(product.images || []);
        setSelectedCategories([product.category]);
        setProductStatus(product.status || "");
      }
    };
    fetchProduct();
  }, [id, getProductById]);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleImageChange = (e) => {
    const newFiles = Array.from(e.target.files);
    const existing = images.map(f => f.name + f.size);
    const filtered = newFiles.filter(f => !existing.includes(f.name + f.size));
    setImages([...images, ...filtered]);
    e.target.value = "";
  };

  const handleImageDelete = (idx) => {
    setImages(images.filter((_, i) => i !== idx));
  };

  const handleCategoryFinalSelect = (id) => {
    setFormData((prev) => ({ ...prev, category: id }));
    setSelectedCategories([id]);
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
        else value.split(",").forEach(v => submitData.append(key, v.trim()));
      }
    });

    images.forEach((img) => submitData.append("images", img));

    try {
      const { success, message } = await editProduct(id, submitData);
      if (success) {
        toast.success(message || "Product updated successfully.");
        navigate("/products");
      } else {
        toast.error(message || "Failed to update product.");
      }
    } catch (err) {
      toast.error(err.message || "Failed to update product.");
    }
  };

  if (loading) return <Loader />;

  return (
    <section className="max-w-2xl mx-auto p-6 bg-white rounded shadow">
      <h2 className="text-2xl font-bold mb-4">Edit Product</h2>
      <form onSubmit={handleSubmit} className="flex flex-col gap-6">
        {/* Category Selector (only if product is rejected) */}
        {productStatus === "rejected" && (
          <CategorySelector
            step={1}
            nextStep={() => {}}
            prevStep={() => {}}
            selectedCategories={selectedCategories}
            setSelectedCategories={setSelectedCategories}
            formData={formData}
            setFormData={setFormData}
            onCategoryFinalSelect={handleCategoryFinalSelect}
          />
        )}

        {/* Upload Images */}
        <UploadImages
          step={2}
          nextStep={() => {}}
          prevStep={() => {}}
          handleImageChange={handleImageChange}
          handleImageDelete={handleImageDelete}
          images={images}
        />

        {/* Basic Info */}
        <BasicInfo
          formData={formData}
          step={3}
          nextStep={() => {}}
          prevStep={() => {}}
          handleInputChange={handleInputChange}
        />

        {/* Product Details */}
        <ProductDetails
          formData={formData}
          step={4}
          nextStep={() => {}}
          prevStep={() => {}}
          handleInputChange={handleInputChange}
          setFormData={setFormData}
          loading={loading}
          handleSubmit={handleSubmit}
        />

        <Button text="Update Product" type="submit" color="blue" />
      </form>
    </section>
  );
};

export default EditProduct;