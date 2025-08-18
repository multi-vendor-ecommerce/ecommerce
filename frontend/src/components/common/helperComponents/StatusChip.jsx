import { 
  FaCheckCircle, 
  FaHourglassHalf, 
  FaTimesCircle, 
  FaTruck, 
  FaThumbsUp, 
  FaBan, 
  FaUserCheck, 
  FaUserSlash 
} from "react-icons/fa";

const StatusChip = ({ status }) => {
  const map = {
    pending: {
      text: "Pending",
      icon: <FaHourglassHalf size={13} className="text-yellow-600" />,
      cls: "text-yellow-800 bg-yellow-100",
    },
    approved: {
      text: "Approved",
      icon: <FaThumbsUp size={13} className="text-green-600" />,
      cls: "text-green-700 bg-green-100",
    },
    rejected: {
      text: "Rejected",
      icon: <FaBan size={13} className="text-red-600" />,
      cls: "text-red-700 bg-red-100",
    },
    delivered: {
      text: "Delivered",
      icon: <FaCheckCircle size={13} className="text-green-600" />,
      cls: "text-green-700 bg-green-100",
    },
    cancelled: {
      text: "Cancelled",
      icon: <FaTimesCircle size={13} className="text-red-600" />,
      cls: "text-red-700 bg-red-100",
    },
    shipped: {
      text: "Shipped",
      icon: <FaTruck size={13} className="text-blue-600" />,
      cls: "text-blue-700 bg-blue-100",
    },
    processing: {
      text: "Processing",
      icon: <FaHourglassHalf size={13} className="text-purple-600" />,
      cls: "text-purple-700 bg-purple-100",
    },
    active: {
      text: "Active",
      icon: <FaUserCheck size={13} className="text-green-600" />,
      cls: "text-green-700 bg-green-100",
    },
    suspended: {
      text: "Suspended",
      icon: <FaUserSlash size={13} className="text-red-600" />,
      cls: "text-red-700 bg-red-100",
    },
  };

  const cfg = map[status.toLowerCase()] || {
    text: status,
    icon: null,
    cls: "text-gray-700 bg-gray-100",
  };

  return (
    <span
      className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-semibold ${cfg.cls}`}
      title={status}
    >
      {cfg.icon}
      {cfg.text}
    </span>
  );
};

export default StatusChip;