import clsx from "clsx";

export const StatCard = ({ icon: Icon, label, value, bg = "", shadow = "" }) => {
  return (
    <div
      className={clsx(
        "p-5 rounded-xl flex items-center gap-4 shadow-sm transition-shadow duration-200 hover:shadow-md",
        bg,
        `hover:${shadow}`
      )}
    >
      <Icon className="text-3xl" />
      <div>
        <p className="text-sm font-semibold uppercase tracking-wide">
          {label}
        </p>
        <p className="text-xl md:text-2xl font-bold text-gray-900 mt-1">{value}</p>
      </div>
    </div>
  );
};
