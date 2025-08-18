import React, { useState, useEffect, useContext } from "react";
import OrderContext from "../../../../context/orders/OrderContext";

const ShippingStep = ({ order, onNext }) => {
  const { createOrderDraft, getUserDraftOrderById } = useContext(OrderContext);

  const [shippingInfo, setShippingInfo] = useState(order.shippingInfo || {});
  const [isEditing, setIsEditing] = useState(!order.shippingInfo); // if no info, start editing

  useEffect(() => {
    // fetch fresh draft if shippingInfo missing
    let cancelled = false;

    if (!order?.shippingInfo?._id) {
      (async () => {
        const res = await getUserDraftOrderById(order._id);
        if (!cancelled && res) setShippingInfo(res.shippingInfo || {});
      })();
    }
    return () => {
      cancelled = true;
    }
  }, [order._id, getUserDraftOrderById]);

  const handleChange = (e) => {
    setShippingInfo({ ...shippingInfo, [e.target.name]: e.target.value });
  };

  const handleSave = async () => {
    const res = await createOrderDraft({ ...order, shippingInfo });
    if (res.success) {
      setIsEditing(false);
      // backend may not return full order, so update locally
      setShippingInfo(shippingInfo);
    } else {
      alert(res.message || "Failed to save shipping info");
    }
  };

  const handleNext = () => {
    if (shippingInfo?.line1 && shippingInfo?.pincode) onNext();
    else alert("Please fill required fields");
  };

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-bold">Shipping Address</h2>

      {!isEditing ? (
        <div className="border p-3 rounded bg-gray-100">
          <p><strong>{shippingInfo.recipientName}</strong> ({shippingInfo.recipientPhone})</p>
          <p>{shippingInfo.line1}</p>
          {shippingInfo.line2 && <p>{shippingInfo.line2}</p>}
          <p>{shippingInfo.locality}, {shippingInfo.city}, {shippingInfo.state} - {shippingInfo.pincode}</p>
          <p>{shippingInfo.country}</p>

          <button className="mt-2 text-sm text-purple-600 underline" onClick={() => setIsEditing(true)}>Edit</button>
        </div>
      ) : (
        <div className="space-y-2">
          <input type="text" name="recipientName" placeholder="Recipient Name" value={shippingInfo.recipientName || ""} onChange={handleChange} className="w-full border p-2 rounded"/>
          <input type="text" name="recipientPhone" placeholder="Phone" value={shippingInfo.recipientPhone || ""} onChange={handleChange} className="w-full border p-2 rounded"/>
          <input type="text" name="line1" placeholder="Address Line 1" value={shippingInfo.line1 || ""} onChange={handleChange} className="w-full border p-2 rounded"/>
          <input type="text" name="line2" placeholder="Address Line 2" value={shippingInfo.line2 || ""} onChange={handleChange} className="w-full border p-2 rounded"/>
          <input type="text" name="locality" placeholder="Locality" value={shippingInfo.locality || ""} onChange={handleChange} className="w-full border p-2 rounded"/>
          <input type="text" name="city" placeholder="City" value={shippingInfo.city || ""} onChange={handleChange} className="w-full border p-2 rounded"/>
          <input type="text" name="state" placeholder="State" value={shippingInfo.state || ""} onChange={handleChange} className="w-full border p-2 rounded"/>
          <input type="text" name="pincode" placeholder="Pincode" value={shippingInfo.pincode || ""} onChange={handleChange} className="w-full border p-2 rounded"/>
          <input type="text" name="country" placeholder="Country" value={shippingInfo.country || ""} onChange={handleChange} className="w-full border p-2 rounded"/>

          <div className="flex gap-2">
            <button className="bg-green-600 text-white px-4 py-2 rounded" onClick={handleSave}>Save</button>
            <button className="bg-gray-400 text-white px-4 py-2 rounded" onClick={() => setIsEditing(false)}>Cancel</button>
          </div>
        </div>
      )}

      <button className="bg-purple-600 text-white px-4 py-2 rounded" onClick={handleNext} disabled={!shippingInfo?.line1 || !shippingInfo?.pincode}>Next</button>
    </div>
  );
};

export default ShippingStep;
