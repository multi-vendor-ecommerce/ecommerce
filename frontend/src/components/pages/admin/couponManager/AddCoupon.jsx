const AddCoupon = ({ form, errors, handleChange, handleAddCoupon }) => {
  return (
    <div className="bg-white shadow-blue-500 shadow-md rounded-xl border border-gray-200 p-6 mb-8">
      <h3 className="text-lg md:text-xl font-semibold mb-4">Add New Coupon</h3>

      <div className="grid md:grid-cols-5 gap-4">
        {/* Code */}
        <div className="flex flex-col gap-1">
          <label htmlFor="code" className="text-sm font-medium text-gray-600">
            Code
          </label>
          <input
            id="code"
            name="code"
            value={form.code}
            onChange={handleChange}
            placeholder="COUPON2025"
            className="border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
          {errors.code && <span className="text-sm text-red-600">{errors.code}</span>}
        </div>

        {/* Value */}
        <div className="flex flex-col gap-1">
          <label htmlFor="value" className="text-sm font-medium text-gray-600">
            Value (₹)
          </label>
          <input
            id="value"
            name="value"
            type="number"
            min="0"
            step="1"
            value={form.value}
            onChange={handleChange}
            className="border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
          {errors.value && <span className="text-sm text-red-600">{errors.value}</span>}
        </div>

        {/* Min Order */}
        <div className="flex flex-col gap-1">
          <label htmlFor="minOrder" className="text-sm font-medium text-gray-600">
            Min Order (₹)
          </label>
          <input
            id="minOrder"
            name="minOrder"
            type="number"
            min="0"
            step="1"
            value={form.minOrder}
            onChange={handleChange}
            className="border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
          {errors.minOrder && <span className="text-sm text-red-600">{errors.minOrder}</span>}
        </div>

        {/* Expiry */}
        <div className="flex flex-col gap-1">
          <label htmlFor="expiry" className="text-sm font-medium text-gray-600">
            Expiry
          </label>
          <input
            id="expiry"
            name="expiry"
            type="date"
            min={new Date().toISOString().split("T")[0]}
            value={form.expiry}
            onChange={handleChange}
            className="border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
          {errors.expiry && <span className="text-sm text-red-600">{errors.expiry}</span>}
        </div>

        {/* Usage Limit */}
        <div className="flex flex-col gap-1">
          <label htmlFor="usageLimit" className="text-sm font-medium text-gray-600">
            Usage Limit
          </label>
          <input
            id="usageLimit"
            name="usageLimit"
            type="number"
            min="1"
            step="1"
            value={form.usageLimit}
            onChange={handleChange}
            className="border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
          {errors.usageLimit && <span className="text-sm text-red-600">{errors.usageLimit}</span>}
        </div>
      </div>

      <button
        onClick={handleAddCoupon}
        className="mt-6 border-2 border-blue-500 hover:bg-blue-600 text-black font-semibold hover:text-white shadow-md hover:shadow-gray-400 px-6 py-2 rounded-lg transition cursor-pointer"
      >
        Add Coupon
      </button>
    </div>
  )
}

export default AddCoupon;