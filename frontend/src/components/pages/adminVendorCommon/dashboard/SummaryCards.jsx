import { formatNumber } from "../../../../utils/formatNumber";

export default function SummaryCards({ summaryData, orders, users, products }) {
  const totalRevenue = orders
    ?.filter(order => ["delivered", "shipped", "processing"].includes(order.orderStatus))
    .reduce((sum, order) => sum + (order.grandTotal || 0), 0);
  const totalOrders = orders?.length || 0;
  const totalProducts = products?.length || 0;
  const totalCustomers = users?.filter(u => u.role === "customer").length || 0;

  const cards = summaryData({
    totalRevenue: formatNumber(totalRevenue),
    totalOrders: formatNumber(totalOrders),
    totalProducts: formatNumber(totalProducts),
    totalCustomers: formatNumber(totalCustomers),
  });

  return (
    <section>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {cards.map((card) => {
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
