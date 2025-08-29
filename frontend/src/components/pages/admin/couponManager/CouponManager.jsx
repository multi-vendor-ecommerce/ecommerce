import { useContext, useEffect, useState } from "react";
import AddEditCoupon from "./AddEditCoupon";
import CouponContext from "../../../../context/coupons/CouponContext";
import PaginatedLayout from "../../../common/layout/PaginatedLayout";
import Loader from "../../../common/Loader";
import BackButton from "../../../common/layout/BackButton";
import { RenderCouponRow } from "./RenderCouponRow";
import TabularData from "../../../common/layout/TabularData";

export default function CouponsManager() {
  const { coupons, getAllCoupons, addCoupon, editCoupon, deleteCoupon, loading, totalCount } = useContext(CouponContext);

  const [page, setPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  const [errors, setErrors] = useState({});
  const [form, setForm] = useState({ code: "", discount: "", minPurchase: "", maxDiscount: "", expiryDate: "", usageLimit: "", isActive: true });
  const [editingId, setEditingId] = useState(null); // null = add mode, id = edit mode
  const [originalForm, setOriginalForm] = useState(null); // Track original coupon

  useEffect(() => {
    getAllCoupons(page, itemsPerPage);
  }, [page, itemsPerPage]);

  const handleChange = (name, value) => {
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  // Start editing a coupon
  const handleStartEdit = (coupon) => {
    const formData = {
      code: coupon.code || "",
      discount: coupon.discount || "",
      minPurchase: coupon.minPurchase || "",
      maxDiscount: coupon.maxDiscount || "",
      expiryDate: coupon.expiryDate || "",
      usageLimit: coupon.usageLimit || "",
      isActive: coupon.isActive ?? true,
    };

    setForm(formData);
    setOriginalForm(formData); // Save original for change detection
    setEditingId(coupon._id);
  };

  // Add or Edit handler
  const handleSubmit = async () => {
    const newErrors = {};
    if (!form.code.trim()) newErrors.code = "Coupon code is required";
    if (form.discount === "" || Number(form.discount) <= 0) newErrors.discount = "Enter a valid discount";
    if (form.minPurchase === "" || Number(form.minPurchase) < 0)
      newErrors.minPurchase = "Enter a valid minimum purchase";
    if (!form.expiryDate) newErrors.expiryDate = "Expiry date is required";
    if (form.usageLimit === "" || Number(form.usageLimit) < 1)
      newErrors.usageLimit = "Usage limit must be at least 1";

    setErrors(newErrors);
    if (Object.keys(newErrors).length > 0) return;

    // Build payload only with non-empty and changed fields
    const payload = {};
    Object.keys(form).forEach((key) => {
      if (form[key] !== "" && form[key] !== null) {
        // If editing, only include changed fields
        if (!editingId || form[key] !== originalForm[key]) {
          payload[key] = form[key];
        }
      }
    });

    if (editingId && Object.keys(payload).length === 0) {
      alert("No changes made. Nothing to update.");
      setForm({ code: "", discount: "", minPurchase: "", maxDiscount: "", expiryDate: "", usageLimit: "", isActive: true });
      setEditingId(null);         // Switch to add mode
      setOriginalForm(null);
      return; // Skip API call if nothing changed
    }

    let result;
    if (editingId) result = await editCoupon(editingId, payload); // Edit mode
    else result = await addCoupon(payload); // Add mode

    if (result.success) {
      setForm({ code: "", discount: "", minPurchase: "", maxDiscount: "", expiryDate: "", usageLimit: "", isActive: true });
      setErrors({});
      setEditingId(null);
      setOriginalForm(null);
    } else {
      alert(result.message);
    }
  };

  const handleDelete = async (id) => {
    const confirmation = confirm("Are you sure?");
    if (confirmation) {
      deleteCoupon(id); // Optimistic update
    }
  };

  return (
    <section className="bg-gray-100 min-h-screen w-full p-6 shadow-md">
      <BackButton />

      <h2 className="text-2xl font-bold mt-4 mb-6">Coupon Manager</h2>

      <AddEditCoupon
        form={form}
        setForm={setForm}
        errors={errors}
        handleChange={handleChange}
        handleAddCoupon={handleSubmit}
        isEditing={!!editingId}
      />

      {loading ? (
        <div className="flex justify-center pt-10 mt-6"><Loader /></div>
      ) : coupons.length === 0 ? (
        <p className="text-gray-500 mt-6">No coupons available.</p>
      ) : (
        <div className="mt-6">
          <h3 className="text-lg md:text-xl font-semibold mb-4">All Coupons</h3>

          <PaginatedLayout
            totalItems={totalCount}
            currentPage={page}
            itemsPerPage={itemsPerPage}
            onPageChange={(pg) => setPage(pg)}
            onItemsPerPageChange={(limit) => {
              setItemsPerPage(limit);
              setPage(1);
            }}
          >
            {() => (
              <div className="overflow-hidden bg-white shadow-md shadow-blue-500 rounded-xl border border-gray-200">
                <TabularData
                  headers={["Coupon Code", "Discount", "Min Purchase", "Max Discount", "Status", "Expiry Date", "Actions"]}
                  data={coupons}
                  renderRow={(c, i) => RenderCouponRow(c, i, handleStartEdit, handleDelete)}
                  emptyMessage="No coupons found."
                  widthClass="w-full"
                />
              </div>
            )}
          </PaginatedLayout>
        </div>
      )}
    </section>
  );
}