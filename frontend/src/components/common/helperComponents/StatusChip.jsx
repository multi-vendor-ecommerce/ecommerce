import {
  FaCheckCircle,
  FaHourglassHalf,
  FaTimesCircle,
  FaTruck,
  FaThumbsUp,
  FaBan,
  FaUserCheck,
  FaUserSlash,
} from "react-icons/fa";
import { FiTrash2 } from "react-icons/fi";
import { toTitleCase } from "../../../utils/titleCase";

const StatusChip = ({ status }) => {
  if (!status) return null; // Prevent error if status is undefined

  const map = {
    pending: {
      text: toTitleCase("pending"),
      icon: <FaHourglassHalf size={13} className="text-yellow-600" />,
      cls: "text-yellow-800 bg-yellow-100",
    },
    approved: {
      text: toTitleCase("approved"),
      icon: <FaThumbsUp size={13} className="text-green-600" />,
      cls: "text-green-700 bg-green-100",
    },
    rejected: {
      text: toTitleCase("rejected"),
      icon: <FaBan size={13} className="text-red-600" />,
      cls: "text-red-700 bg-red-100",
    },
    delivered: {
      text: toTitleCase("delivered"),
      icon: <FaCheckCircle size={13} className="text-green-600" />,
      cls: "text-green-700 bg-green-100",
    },
    cancelled: {
      text: toTitleCase("cancelled"),
      icon: <FaTimesCircle size={13} className="text-red-600" />,
      cls: "text-red-700 bg-red-100",
    },
    shipped: {
      text: toTitleCase("shipped"),
      icon: <FaTruck size={13} className="text-blue-600" />,
      cls: "text-blue-700 bg-blue-100",
    },
    processing: {
      text: toTitleCase("processing"),
      icon: <FaHourglassHalf size={13} className="text-purple-600" />,
      cls: "text-purple-700 bg-purple-100",
    },
    active: {
      text: toTitleCase("active"),
      icon: <FaUserCheck size={13} className="text-green-600" />,
      cls: "text-green-700 bg-green-100",
    },
    inactive: {
      text: toTitleCase("inactive"),
      icon: <FaUserSlash size={13} className="text-slate-600" />,
      cls: "text-slate-700 bg-slate-100",
    },
    suspended: {
      text: toTitleCase("suspended"),
      icon: <FaBan size={13} className="text-red-600" />,
      cls: "text-red-700 bg-red-100",
    },
    pendingdeletion: {
      text: toTitleCase("del pending"),
      icon: <FiTrash2 size={13} className="text-red-600" />,
      cls: "text-red-700 bg-red-100",
    },
  };

  const cfg = map[status.toLowerCase()] || {
    text: toTitleCase(status),
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