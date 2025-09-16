import { useEffect, useState, useContext } from "react";
import { useParams, NavLink } from "react-router-dom";
import ProductContext from "../../../../context/products/ProductContext";
import Loader from "../../../common/Loader";
import StatGrid from "../../../common/helperComponents/StatGrid";
import { FiEdit } from "react-icons/fi";
import { getProfileCardData } from "./data/productStatCards";
import BackButton from "../../../common/layout/BackButton";
import { toTitleCase } from "../../../../utils/titleCase";
import PersonContext from "../../../../context/person/PersonContext";

const ProductDetails = ({ role = "admin" }) => {
  const { productId } = useParams();
  const { person } = useContext(PersonContext);
  const { getProductById, loading } = useContext(ProductContext);
  const [product, setProduct] = useState(null);

  useEffect(() => {
    const fetchProduct = async () => {
      const data = await getProductById(productId);
      setProduct(data);
    };

    fetchProduct();
  }, [productId]);

  if (loading || !product) {
    return (
      <section className="bg-gray-100 min-h-screen flex items-center justify-center">
        <Loader />
      </section>
    );
  }

  if (!product) {
    return <div className="text-center mt-10 text-red-600">Product not found.</div>;
  }

  const productAttributes = [
    { label: "Tags", key: "tags" },
    { label: "Colors", key: "colors" },
    { label: "Sizes", key: "sizes" },
  ];

  return (
    <section className="p-6 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="flex justify-between items-center mb-3">
        <BackButton />

        <NavLink
          to={`/${role}/product/edit-delete/${product._id}`}
          className="flex items-center gap-2 px-3 md:px-6 py-3 md:py-2 border border-blue-500 hover:bg-blue-600 text-black font-semibold hover:text-white shadow-md hover:shadow-gray-400 rounded-full md:rounded-lg transition cursor-pointer"
        >
          <FiEdit className="text-lg md:text-2xl" />
          <span className="hidden md:inline-block">Edit Product</span>
        </NavLink>
      </div>

      <h2 className="text-xl md:text-2xl font-bold text-gray-800 mb-6">{toTitleCase(product.title)} - Overview</h2>

      <div className="w-full bg-white rounded-xl shadow-md hover:shadow-blue-500 transition duration-200 mb-8 overflow-hidden">
        <div className="flex items-center flex-nowrap overflow-x-auto overflow-y-hidden rounded-xl gap-4 md:gap-x-8 px-6 md:px-15 py-6">
          {product.images?.map((img, index) => (
            <div key={index} className="min-w-[120px]">
              <img
                src={img.url}
                alt={`${toTitleCase(product.title)} - ${index + 1}`}
                className="w-30 h-30 object-cover rounded-xl shadow-md shadow-purple-400 hover:shadow-purple-500 transition duration-200"
              />
            </div>
          ))}
        </div>
      </div>

      {/* Stat Cards */}
      <div className="w-full h-full bg-white rounded-xl shadow-md hover:shadow-blue-500 transition duration-200 px-4 py-6">
        <StatGrid cards={getProfileCardData(product)} />
      </div>

      {/* Extra Info */}
      <div className="bg-white p-5 mt-8 rounded-xl shadow-md border border-gray-200 hover:shadow-blue-500 transition duration-200">
        <h3 className="text-lg font-semibold mb-4 text-gray-700">Details</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
          <ul className="text-gray-600">
            <li><span className="font-semibold my-1">SKU:</span> {product.sku || "N/A"}</li>
            <li><span className="font-semibold my-1">Brand:</span> {product.brand || "N/A"}</li>
            <li><span className="font-semibold my-1">GST Rate:</span> {product.gstRate ? `${product.gstRate}%` : "N/A"}</li>
            <li>
              <span className="font-semibold my-1">Dimensions (L x W x H):</span>{" "}
              {product.dimensions
                ? `${product?.dimensions?.length || "?"} x ${product?.dimensions?.width || "?"} x ${product?.dimensions?.height || "?"} cm`
                : "N/A"}
            </li>
            <li>
              <span className="font-semibold my-1">Weight:</span>{" "}
              {product?.weight ? `${(product.weight).toLocaleString()} g` : "N/A"}
            </li>

            {person?.role === "admin" && (
              <li className="col-span-1 md:col-span-2">
                <span className="font-semibold my-1">Created By:</span>
                <NavLink
                  to={`/admin/vendor/profile/${product.createdBy?._id}`}
                  className="text-blue-500 ml-2 hover:underline"
                >
                  {toTitleCase(product.createdBy?.name) || "Unknown"} (
                  {toTitleCase(product.createdBy?.shopName) || "Unknown"})
                </NavLink>
              </li>
            )}
          </ul>

          <ul className="text-gray-600">
            {productAttributes.map(({ label, key }) => (
              <li key={key}>
                <strong>{label}:</strong>{" "}
                {product[key]?.length > 0 ? (
                  product[key].map((item, index) => (
                    <span
                      key={index}
                      className="inline-block bg-gray-200 rounded-lg px-2 py-[1px] my-1 mx-1 text-sm"
                    >
                      {label === "Sizes" ? item : toTitleCase(item)}
                    </span>
                  ))
                ) : (
                  `No ${label.toLowerCase()} available`
                )}
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Description */}
      <div className="bg-white p-5 mt-8 rounded-xl shadow-md border border-gray-200 hover:shadow-blue-500 transition duration-200">
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