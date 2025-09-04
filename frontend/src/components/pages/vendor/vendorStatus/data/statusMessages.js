import { FiClock } from "react-icons/fi";
import { MdBlock, MdOutlineCancel, MdDelete } from "react-icons/md";
import { BiUserX } from "react-icons/bi";

export const statusMessages = {
  pending: {
    title: "Account Pending Approval",
    message: [
      "Your vendor account is awaiting admin approval.",
      "You will be notified once your account is approved.",
      "Please check back later.",
    ],
    icon: FiClock,
    color: "text-yellow-500",
  },
  suspended: {
    title: "Account Suspended",
    message: [
      "Your account has been suspended by the admin.",
      "You cannot access the vendor dashboard at this time.",
      "Please contact support for assistance.",
    ],
    icon: MdBlock,
    color: "text-red-500",
  },
  inactive: {
    title: "Account Inactive",
    message: [
      "Your vendor account is currently inactive.",
      "Click below to reactivate your account.",
    ],
    icon: BiUserX,
    color: "text-gray-400",
  },
  rejected: {
    title: "Account Rejected",
    message: [
      "Your vendor application has been rejected.",
      "You cannot access the vendor dashboard.",
      "Please contact support if you’d like more details.",
    ],
    icon: MdOutlineCancel,
    color: "text-red-600",
  },
  deleted: {
    title: "Account Deleted",
    message: [
      "Your vendor account has been deleted by the admin.",
      "You no longer have access to the vendor dashboard.",
      "If you believe this is a mistake, please contact support.",
    ],
    icon: MdDelete,
    color: "text-red-700",
  },
};