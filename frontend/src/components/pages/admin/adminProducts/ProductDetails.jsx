import { useEffect, useState, useContext } from "react";
import { useParams, NavLink } from "react-router-dom";
import ProductContext from "../../../../context/products/ProductContext";
import Spinner from "../../../common/Spinner";
import StatGrid from "../helperComponents/StatGrid";
import { FiEdit } from "react-icons/fi";
import {
  FaBoxOpen,
  FaTag,
  FaMoneyBillWave,
  FaWarehouse,
  FaStore,
} from "react-icons/fa";

const ProductDetails = () => {
  const { productId } = useParams();
  const { getProductById } = useContext(ProductContext);
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProduct = async () => {
      setLoading(true);
      const data = await getProductById(productId);
      setProduct(data);
      setLoading(false);
    };

    fetchProduct();
  }, [productId, getProductById]);

  if (loading) {
    return (
      <section className="bg-gray-100 min-h-screen flex items-center justify-center">
        <Spinner />
      </section>
    );
  }

  if (!product) {
    return <div className="text-center mt-10 text-red-600">Product not found.</div>;
  }

  const statCards = [
    {
      icon: FaTag,
      label: "Price",
      value: `₹${product.price ? (product.price).toLocaleString() : "N/A"}`,
      bg: "bg-yellow-100",
    },
    {
      icon: FaBoxOpen,
      label: "Stock",
      value: product.stock ? product.stock : "N/A",
      bg: "bg-pink-100",
    },
    {
      icon: FaWarehouse,
      label: "Units Sold",
      value: product.unitsSold ? product.unitsSold : 0,
      bg: "bg-purple-100",
    },
    {
      icon: FaMoneyBillWave,
      label: "Revenue",
      value: `₹${(product.unitsSold * product.price).toLocaleString()}`,
      bg: "bg-green-100",
    },
    {
      icon: FaStore,
      label: "Product",
      value: product.title || "Unknown",
      bg: "bg-blue-100",
    },
    {
      icon: FaTag,
      label: "Category",
      value: product.category?.name || "N/A",
      bg: "bg-orange-100",
    },
  ];

  return (
    <section className="p-6 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-2">{product.title} - Overview</h2>
        <NavLink
          to={`/admin/vendor/edit-delete/${product._id}`}
          className="flex items-center gap-2 px-3 md:px-6 py-3 md:py-2 border border-blue-500 hover:bg-blue-600 text-black font-semibold hover:text-white shadow-md hover:shadow-gray-400 rounded-full md:rounded-lg transition cursor-pointer"
        >
          <FiEdit size={20} />
          <span className="hidden md:inline-block">Edit Product</span>
        </NavLink>
      </div>

      <div className="w-full h-full bg-white flex items-center justify-center md:justify-start gap-7 md:gap-x-14 flex-wrap rounded-xl shadow-md hover:shadow-blue-500 transition duration-150 px-6 md:px-15 py-6 mb-8">
        <div>
          {product.images[0] && (
            <img
              src={product.images?.[0]}
              alt={product.title}
              className="w-30 h-30 object-cover rounded-xl shadow-md shadow-purple-400 hover:shadow-purple-500 transition duration-150"
            />
          )}
        </div>
      </div>

      {/* Stat Cards */}
      <div className="w-full h-full bg-white rounded-xl shadow-md hover:shadow-blue-500 transition duration-150 px-4 py-6">
        <StatGrid cards={statCards} />
      </div>

      {/* Description */}
      <div className="bg-white p-5 mt-8 rounded-xl shadow-md border border-gray-200">
        <h3 className="text-lg font-semibold mb-2 text-gray-700">
          Product Description
        </h3>
        <p className="text-gray-600 leading-relaxed whitespace-pre-wrap">
          {product.description || "No description provided."}
        </p>
      </div>
    </section>
  );
};

export default ProductDetails;
