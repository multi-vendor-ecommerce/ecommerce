export const StatCard = ({ icon: Icon, label, value, bg = "", shadow = "" }) => {
  return (
    <div className={`w-full p-5 rounded-xl flex items-center gap-4 shadow-sm transition-shadow duration-200 hover:shadow-md ${bg} ${shadow}`} title="Stat Card">
      <Icon className="text-3xl" />
      <div className="w-3/4">
        <p className="text-sm font-semibold uppercase tracking-wide">
          {label}
        </p>
        <p className="text-lg md:text-xl font-bold text-gray-900 mt-1 truncate">{value}</p>
      </div>
    </div>
  );
};
