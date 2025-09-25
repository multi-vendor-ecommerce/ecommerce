import { useContext } from "react";
import Loader from "../../../common/Loader"
import CategoryContext from "../../../../context/categories/CategoryContext";
import BackButton from "../../../common/layout/BackButton";

const AdminCategories = () => {
  const { categories, loading } = useContext(CategoryContext);

  return (
    <section className="p-6 min-h-screen bg-gray-50">
      <BackButton />

      <h2 className="text-xl md:text-2xl font-bold text-gray-800 mt-4 mb-6">All Categories</h2>
      
      {loading ? (
        <Loader />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {categories?.map(cat => (
            <div key={cat?._id} className="bg-white rounded-xl shadow-md p-4 flex flex-col items-center">
              {/* Use categoryImage if available, else fallback to image */}
              {(cat?.categoryImage || cat?.image) && (
                <img
                  src={cat.categoryImage || cat.image}
                  alt={cat?.name}
                  className="w-16 h-16 object-cover rounded-full mb-2"
                />
              )}
              <h3 className="font-semibold text-lg">{cat?.name}</h3>
              {/* Optionally show description or actions */}
              {cat?.description && <p className="text-gray-500 text-sm mt-1">{cat?.description}</p>}
              {/* Edit/Delete buttons for admin */}
              <div className="mt-3 flex gap-2">
                <button className="px-3 py-1 rounded bg-blue-500 text-white">Edit</button>
                <button className="px-3 py-1 rounded bg-red-500 text-white">Delete</button>
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  );
};

export default AdminCategories;