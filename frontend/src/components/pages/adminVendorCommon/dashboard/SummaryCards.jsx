import { useContext, useState, useEffect, use } from "react";
import { formatNumber } from "../../../../utils/formatNumber";
import OrderContext from "../../../../context/orders/OrderContext";
import ProductContext from "../../../../context/products/ProductContext";
import UserContext from "../../../../context/user/UserContext";

export default function SummaryCards({ summaryData, range }) {
  if (!summaryData) return null;

  const { orders, getAllOrders } = useContext(OrderContext);
  const { getAllProducts } = useContext(ProductContext);
  const { users, getAllCustomers } = useContext(UserContext);

  const [products, setProducts] = useState([]);

  useEffect(() => {
    getAllCustomers({ range });
    getAllOrders({ range });

    const fetchProducts = async () => {
      const data = await getAllProducts({ range });
      setProducts(data?.products);
    };

    fetchProducts();
  }, [range]);

  let cards = [];

  const totalRevenue = orders
    ?.filter(order => ["delivered", "shipped", "processing"].includes(order.orderStatus))
    .reduce((sum, order) => sum + (order.grandTotal || 0), 0);
  const totalOrders = orders?.length || 0;
  const totalProducts = products?.length || 0;
  const totalCustomers = users?.filter(u => u.role === "customer")?.length || 0;

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
