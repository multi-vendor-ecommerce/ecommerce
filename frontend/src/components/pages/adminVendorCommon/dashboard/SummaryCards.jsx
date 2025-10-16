import { useContext, useEffect, useState } from "react";
import { formatNumber } from "../../../../utils/formatNumber";
import OrderContext from "../../../../context/orders/OrderContext";
import ProductContext from "../../../../context/products/ProductContext";
import UserContext from "../../../../context/user/UserContext";

export default function SummaryCards({ summaryData, range }) {
  if (!summaryData) return null;

  const { totalCount: totalOrders, getAllOrders } = useContext(OrderContext);
  const { totalCount: totalProducts, getAllProducts } = useContext(ProductContext);
  const { totalCount: totalCustomers, getAllCustomers } = useContext(UserContext);

  const [totalRevenue, setTotalRevenue] = useState(0);

  useEffect(() => {
    getAllCustomers({ range });
    getAllProducts({ range });

    const fetchOrders = async () => {
      const result = getAllOrders({ range });
      if (result.success) setTotalRevenue(result?.totalRevenue || 0);
      else setTotalRevenue(0);
    };

    fetchOrders();
  }, [range]);

  let cards = [];

  cards = summaryData({
    totalRevenue: formatNumber(totalRevenue),
    totalOrders: formatNumber(totalOrders),
    totalProducts: formatNumber(totalProducts),
    totalCustomers: formatNumber(totalCustomers),
  });

  return (
    <section>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {cards && cards.map((card) => {
          const Icon = card.icon;
          return (
            <div key={card.label} className={`p-5 rounded-xl shadow-sm flex items-center ${card.bgColor} hover:shadow-md ${card.shadowColor}`}>
              <Icon className="text-3xl mr-4" />
              <div>
                <p className="text-sm font-semibold uppercase tracking-wide">{card.label}</p>
                <p className="text-2xl font-bold mt-1">{card.value}</p>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
