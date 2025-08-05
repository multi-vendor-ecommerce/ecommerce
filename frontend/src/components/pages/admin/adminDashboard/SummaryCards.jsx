import { useContext, useEffect, useState } from "react";
import { getCards } from "./data/summaryData";
import ProductContext from "../../../../context/products/ProductContext";
import OrderContext from "../../../../context/orders/OrderContext";
import UserContext from "../../../../context/user/UserContext";
import { formatNumber } from "../../../../utils/formatNumber";

export default function SummaryCards() {
  const { users } = useContext(UserContext);
  const { adminOrders } = useContext(OrderContext);
  const { getAllProducts } = useContext(ProductContext);

  const [products, setProducts] = useState([]);

  useEffect(() => {
    const fetchAllProducts = async () => {
      const result = await getAllProducts();
      if (result?.products) {
        setProducts(result.products);
      }
    };
    fetchAllProducts();
  }, []);

  // Calculate values
  const totalRevenue = products?.reduce(
    (sum, p) => sum + (p.revenue || p.price * p.unitsSold || 0),
    0
  );
  const totalOrders = adminOrders?.length || 0;
  const totalProducts = products?.length || 0;
  const totalCustomers = users?.filter(u => u.role === "customer").length || 0;

  const cards = getCards({
    totalRevenue: formatNumber(totalRevenue),
    totalOrders,
    totalProducts,
    totalCustomers,
  });

  return (
    <section>
      {/* Summary cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {cards.map((card) => {
          const Icon = card.icon;
          return (
            <div
              key={card.label}
              className={`p-5 rounded-xl shadow-sm transition duration-200 flex items-center ${card.bgColor} hover:shadow-md ${card.shadowColor}`}
            >
              {/* Icon */}
              <Icon className="text-3xl mr-4" />

              {/* Label + value */}
              <div>
                <p className="text-sm font-semibold uppercase tracking-wide">
                  {card.label}
                </p>
                <p className="text-2xl font-bold mt-1">{card.value}</p>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
