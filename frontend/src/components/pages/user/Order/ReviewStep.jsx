import { getFinalPrice, formatPrice } from "../Utils/priceUtils";
import StepperControls from "../../../common/StepperControls";
import { FaShoppingCart, FaMapMarkerAlt } from "react-icons/fa";

const ReviewStep = ({ order, step, next, prev }) => {
  if (!order?.orderItems || order.orderItems.length === 0) {
    return <p>No items in your order.</p>;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <h2 className="text-2xl font-semibold flex items-center gap-2 text-[#2E7D32]">
        <FaShoppingCart className="text-[#2E7D32]" />
        Review Your Order
      </h2>

      {/* Order Items */}
      <div className="space-y-4">
        {order.orderItems.map((item) => {
          const finalPrice = getFinalPrice(item.product.price, item.product.discount || 0);
          console.log(item.product.price, item.product.discount, finalPrice);
          return (
            <div
              key={item._id}
              className="flex items-center border border-gray-200 rounded-xl p-3 shadow-sm bg-white hover:shadow-md transition-all"
            >
              {/* Image */}
              <img
                src={item.product.images?.[0].url}
                alt={item.product.title}
                className="w-20 h-20 object-cover rounded-lg border"
              />

              {/* Info */}
              <div className="flex-1 px-3">
                <h3 className="font-semibold text-gray-800">{item.product.title}</h3>
                <p className="text-sm text-gray-500">
                  {item.color ? `Color: ${item.color}` : ""}
                  {item.size ? ` | Size: ${item.size}` : ""}
                </p>
                <p className="text-sm text-gray-600 mt-1">Qty: {item.quantity}</p>
              </div>

              {/* Price */}
              {/* <div className="text-right">
                {item.product.discount > 0 ? (
                  <>
                    <p className="text-gray-400 line-through text-sm">
                      ₹{formatPrice(item.product.price * item.quantity)}
                    </p>
                    <p className="font-semibold text-[#6A1B9A]">
                      ₹{formatPrice(finalPrice * item.quantity)}
                    </p>
                  </>
                ) : (
                  <p className="font-semibold text-[#6A1B9A]">
                    ₹{formatPrice(item.product.price * item.quantity)}
                  </p>
                )}
              </div> */}

              {/* Price */}
              <div className="text-right">
                {item.discountPercent > 0 ? (
                  <>
                    <p className="text-gray-400 line-through text-sm">
                      ₹{formatPrice(item.originalPrice * item.quantity)}
                    </p>

                    <p className="font-semibold text-[#6A1B9A]">
                      ₹{formatPrice(item.basePrice * item.quantity)}
                    </p>

                    <p className="text-xs text-green-600 font-medium">
                      ({item.discountPercent}% OFF)
                    </p>
                  </>
                ) : (
                  <p className="font-semibold text-[#6A1B9A]">
                    ₹{formatPrice(item.originalPrice * item.quantity)}
                  </p>
                )}
              </div>



            </div>
          );
        })}
      </div>

      {/* Summary */}
      <div className="border border-gray-200 rounded-xl p-4 bg-gray-50 space-y-3 shadow-sm">
        <h3 className="text-lg font-semibold text-gray-800 mb-1">Order Summary</h3>

        <div className="flex justify-between text-sm">
          <span>Subtotal</span>
          <span>₹{formatPrice(order.subTotal)}</span>
        </div>

        <div className="flex justify-between text-sm">
          <span>Shipping</span>
          <span>
            {order.shippingCharges === 0 ? "Free" : `₹${formatPrice(order.shippingCharges)}`}
          </span>
        </div>
        
        <div className="flex justify-between text-sm">
          <span>Tax</span>
          <span>₹{formatPrice(order.totalTax)}</span>
        </div>

        <div className="flex justify-between font-bold text-base border-t border-gray-200 pt-3">
          <span>Total</span>
          <span className="text-[#6A1B9A] text-lg">₹{formatPrice(order.grandTotal)}</span>
        </div>
      </div>

      {/* Shipping Info */}
      <div className="border border-gray-200 rounded-xl p-4 bg-white shadow-sm">
        <h3 className="flex items-center gap-2 font-semibold text-[#2E7D32] mb-2">
          <FaMapMarkerAlt className="text-[#2E7D32]" />
          Shipping Address
        </h3>
        <div className="text-sm text-gray-700 leading-relaxed">
          <p className="font-medium text-gray-900">{order.shippingInfo.recipientName}</p>
          <p>{order.shippingInfo.line1}, {order.shippingInfo.line2}</p>
          <p>
            {order.shippingInfo.locality}, {order.shippingInfo.city} - {order.shippingInfo.pincode}
          </p>
          <p>{order.shippingInfo.state}, {order.shippingInfo.country}</p>
          <p className="mt-1 text-gray-600">
            <span className="font-medium">Phone:</span> {order.shippingInfo.recipientPhone}
          </p>
        </div>
      </div>

      {/* Stepper Controls */}
      <StepperControls
        currentStep={step}
        onNext={next}
        onBack={prev}
      />
    </div>
  );
};

export default ReviewStep;
