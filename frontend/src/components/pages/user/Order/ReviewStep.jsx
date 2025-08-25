import { getFinalPrice, formatPrice } from "../Utils/priceUtils";
import StepperControls from "../../../common/StepperControls";

const ReviewStep = ({ order, step, next, prev }) => {
  if (!order?.orderItems || order.orderItems.length === 0) {
    return <p>No items in your order.</p>;
  }

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-bold">Review Your Order</h2>

      {/* Order Items */}
      <div className="space-y-4">
        {order.orderItems.map((item) => {
          const finalPrice = getFinalPrice(item.product.price, item.product.discount || 0);
          return (
            <div
              key={item._id}
              className="flex items-center border rounded-lg p-3 shadow-sm"
            >
              {/* Image */}
              <img
                src={item.product.images?.[0].url}
                alt={item.product.title}
                className="w-20 h-20 object-cover rounded-md"
              />

              {/* Info */}
              <div className="flex-1 px-3">
                <h3 className="font-semibold">{item.product.title}</h3>
                <p className="text-sm text-gray-500">
                  {item.color ? `Color: ${item.color}` : ""}
                  {item.size ? ` | Size: ${item.size}` : ""}
                </p>
                <p className="text-sm text-gray-600">Qty: {item.quantity}</p>
              </div>

              {/* Price */}
              <div className="text-right">
                {item.product.discount > 0 ? (
                  <>
                    <p className="text-gray-500 line-through text-sm">
                      ₹{formatPrice(item.product.price * item.quantity)}
                    </p>
                    <p className="font-bold text-purple-700">
                      ₹{formatPrice(finalPrice * item.quantity)}
                    </p>
                  </>
                ) : (
                  <p className="font-bold text-purple-700">
                    ₹{formatPrice(item.product.price * item.quantity)}
                  </p>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Summary */}
      <div className="border rounded-lg p-4 space-y-2 bg-gray-50">
        <div className="flex justify-between">
          <span>Subtotal</span>
          <span>₹{formatPrice(order.itemPrice)}</span>
        </div>
        <div className="flex justify-between">
          <span>Tax</span>
          <span>₹{formatPrice(order.tax)}</span>
        </div>
        <div className="flex justify-between">
          <span>Shipping</span>
          <span>
            {order.shippingCharges === 0
              ? "Free"
              : `₹${formatPrice(order.shippingCharges)}`}
          </span>
        </div>
        <div className="flex justify-between font-bold border-t pt-2">
          <span>Total</span>
          <span className="text-lg text-purple-700">
            ₹{formatPrice(order.totalAmount)}
          </span>
        </div>
      </div>

      <StepperControls
        currentStep={step}
        onNext={next}
        onBack={prev}
      />
    </div>
  );
};

export default ReviewStep;
