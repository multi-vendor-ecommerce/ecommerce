import React, { useContext, useState } from "react";
import OrderContext from "../../../../context/orders/OrderContext";
import { toast } from "react-toastify";
import InputField from "../../../common/InputField";
import { pushOrderFields } from "./data/pushOrderFields";
import Button from "../../../common/Button";

const PushOrder = ({ orderId, setOrderState }) => {
  const { pushOrder, getAllOrders } = useContext(OrderContext);

  const [formData, setFormData] = useState({ packageHeight: null, packageLength: null, packageBreadth: null, packageWeight: null });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!orderId) {
      toast.error("Please provide an order ID");
      return;
    }

    if (!formData.packageLength || !formData.packageBreadth || !formData.packageHeight || !formData.packageWeight) {
      toast.error("Please fill in all required fields.");
      return;
    }

    // ensure numbers are sent as numbers
    const payload = {
      ...formData,
      packageHeight: parseFloat(formData.packageHeight) || 0,
      packageLength: parseFloat(formData.packageLength) || 0,
      packageBreadth: parseFloat(formData.packageBreadth) || 0,
      packageWeight: parseFloat(formData.packageWeight) || 0,
    };

    const result = await pushOrder(orderId, payload);
    if (result?.success) {
      toast.success(result.message || "Order placed successfully");
      setFormData({ packageHeight: "", packageLength: "", packageBreadth: "", packageWeight: "" });
      handleCancel();
      getAllOrders();
    } else {
      toast.error(result?.message || "Failed to place order. Please try again.");
    }
  };

  const handleCancel = () => {
    if (setOrderState) setOrderState({ isButtonClick: false, orderId: "" });
  }

  return (
    <form className="space-y-4">
      <div className="grid grid-cols-4 gap-4">
        {pushOrderFields.map((field) => (
          <InputField
            key={field.name}
            label={`${field.label}${field.required ? " *" : ""}`}
            name={field.name}
            value={formData[field.name]}
            onChange={handleChange}
            placeholder={field.placeholder}
            type={field.type || "text"}
          />
        ))}
      </div>

      <div className="flex gap-2">
        <Button
          text="Submit"
          onClick={handleSubmit}
          className="py-2"
          color="green"
        />
        <Button
          text="Cancel"
          onClick={handleCancel}
          className="py-2"
          color="red"
        />
      </div>
    </form>
  );
};

export default PushOrder;