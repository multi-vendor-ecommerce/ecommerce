import { FaCheckCircle, FaHourglassHalf, FaTimesCircle } from "react-icons/fa";

const StatusChip = ({ status }) => {
  const map = {
    delivered: {
      text: "Delivered",
      icon: <FaCheckCircle size={13} className="text-green-600" />,
      cls: "text-green-700 bg-green-100",
    },
    pending: {
      text: "Pending",
      icon: <FaHourglassHalf size={13} className="text-yellow-600" />,
      cls: "text-yellow-800 bg-yellow-100",
    },
    cancelled: {
      text: "Cancelled",
      icon: <FaTimesCircle size={13} className="text-red-600" />,
      cls: "text-red-700 bg-red-100",
    },
  };

  const cfg = map[status.toLowerCase()] || {
    text: status,
    icon: null,
    cls: "text-gray-700 bg-gray-100",
  };

  return (
    <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-semibold ${cfg.cls}`}>
      {cfg.icon}
      {cfg.text}
    </span>
  );
};

export default StatusChip;