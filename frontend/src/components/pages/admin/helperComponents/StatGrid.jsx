import { StatCard } from "./StatCard";

const StatGrid = ({ cards = [] }) => (
  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
    {cards.map((card) => (
      <StatCard key={card.label} {...card} />
    ))}
  </div>
);

export default StatGrid;
