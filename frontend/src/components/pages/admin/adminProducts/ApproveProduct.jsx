import { useState, useEffect, useContext } from "react";
import ProductContext from "../../../../context/products/ProductContext";
import Loader from "../../../common/Loader";
import BackButton from "../../../common/layout/BackButton";
import Button from "../../../common/Button";
import { NavLink } from "react-router-dom";
import { FiCheckCircle, FiEye } from "react-icons/fi";

const ApproveProduct = () => {
  const { getAllProducts, approveProduct, loading } = useContext(ProductContext);
  const [error, setError] = useState(null);
  const [products, setProducts] = useState([]);

  useEffect(() => {
    const fetchProducts = async () => {
      setError(null);
      const data = await getAllProducts({ status: "pending" });
      if (data.success) setProducts(data.products);
      else setError(data.message);
    };

    fetchProducts();
  }, []);


  const handleApprove = async (id) => {
    const data = await approveProduct(id);
    if (data.success) {
      setProducts(products.filter(product => product._id !== id));
    } else {
      setError(data.message);
    }
  }

  if (loading && products.length === 0) {
    return (
      <section className="bg-gray-100 min-h-screen flex items-center justify-center">
        <Loader />
      </section>
    );
  }

  return (
    <section aria-label="Admin Dashboard" className="p-6 min-h-screen bg-gray-50">
      <BackButton />

      <h2 className="text-2xl font-bold mt-4 mb-6">Approve Products</h2>

      <div className="bg-white shadow-md shadow-blue-500 rounded-xl p-6">
        {products.length === 0 ? (
          <div className="text-center text-gray-600 font-medium flex flex-col items-center gap-4">
            <p>No products to approve</p>
            <NavLink
              to="/admin/all-products"
              className=" flex items-center gap-2 px-3 md:px-4 py-3 md:py-2 border border-blue-500 hover:bg-blue-600 text-blue-600 font-semibold hover:text-white shadow-md hover:shadow-gray-400 rounded-full md:rounded-lg transition cursor-pointer"
            >
              <FiEye className="text-lg md:text-2xl" />
              <span className="hidden md:inline-block">View All Products</span>
            </NavLink>
          </div>
        )
          : (
            <>
              {error && <p className="text-red-500 mb-4 text-center">{error}</p>}
              <ul className="flex flex-col gap-8">
                {products.map(product => (
                  <li
                    key={product._id}
                    className="flex flex-col md:flex-row items-center gap-6 p-4 rounded-lg border-[0.5px] border-gray-50 hover:shadow-sm hover:shadow-purple-500 transition duration-200 bg-gray-50"
                  >
                    <img
                      src={product.images?.[0].url}
                      alt={product.title}
                      className="w-30 h-30 object-cover rounded-lg border border-gray-300 shadow"
                    />
                    <div className="flex-1 text-center md:text-start">
                      <NavLink to={`/admin/product-details/${product._id}`}>
                        <div className="font-semibold text-lg text-gray-900">{product.title}</div>
                      </NavLink>
                      <div className="text-gray-700 mt-1">
                        <span className="font-medium">Vendor:</span>{" "}
                        {product.createdBy?.shopName || product.createdBy?.name || 'Unknown'}
                      </div>
                      <div className="text-gray-700 mt-1">
                        <span className="font-medium">Category:</span>{" "}
                        {product.category?.name || 'Unknown'}
                      </div>
                      <div className="text-gray-700 mt-1">
                        <span className="font-medium">Price:</span>{" "}
                        <span className="text-blue-600 font-bold">${product.price.toLocaleString()}</span>
                      </div>
                      <div className="text-gray-500 mt-2 text-sm line-clamp-2">{product.description}</div>
                    </div>


                    <div className="flex flex-row md:flex-col gap-3 md:gap-2 text-sm md:text-base">
                      <NavLink to={`/admin/product-details/${product._id}`} className="flex gap-2 items-center font-semibold text-blue-600 px-3 py-2 rounded-lg border border-blue-500 hover:bg-blue-500 hover:text-white transition duration-150">
                        <FiEye size={20} />
                        <div>
                          <span>View</span>{" "}
                        <span className="hidden md:inline-block">Product</span>
                        </div>
                      </NavLink>

                      <Button
                        icon={FiCheckCircle}
                        text="Approve"
                        onClick={() => handleApprove(product._id)}
                        className="py-2"
                        color="green"
                      />
                    </div>
                  </li>
                ))}
              </ul>
            </>
          )}
      </div>
    </section>
  )
}

export default ApproveProduct