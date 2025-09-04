import { useContext } from "react";
import Button from "../../../common/Button";
import { statusMessages } from "./data/statusMessages";
import { toast } from "react-toastify";
import VendorContext from "../../../../context/vendors/VendorContext";

const VendorStatus = ({ status }) => {
  const { reactivateVendorAccount } = useContext(VendorContext);
  const { title, message, icon, color } =
    statusMessages[status] || statusMessages.pending;

  const handleReactivate = async () => {
    const result = await reactivateVendorAccount();
    if (result.success) {
      toast.success(result.message || "Account reactivation request sent.");
    } else {
      toast.error(result.message || "Failed to send account reactivation request.");
    }
  };

  // Render icon as a React component
  const Icon = icon;

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-900">
      <div className="mx-6 md:mx-0 max-w-lg bg-[#0d1833] p-8 shadow-lg shadow-gray-500 border border-gray-700 transition duration-200 rounded-xl text-center">
        {Icon && <Icon className={`${color} mx-auto mb-4`} size={40} />}
        <h2 className={`text-2xl font-bold mb-4 ${color}`}>{title}</h2>
        <p className="text-gray-300 mb-6 flex flex-col justify-center items-center gap-2">
          {message.map((line, i) => (
            <span key={i}>{line}</span>
          ))}
        </p>

        {status === "inactive" && (
          <div className="w-full md:w-auto flex justify-center">
            <Button
            text="Reactivate Account"
            onClick={handleReactivate}
            className="py-2.5"
            color="green"
          />
          </div>
        )}

        <p className="text-gray-400 mt-6">
          If you have questions, please contact{" "}
          <a
            href="mailto:noahplanet20@gmail.com"
            className="text-blue-600 underline hover:text-blue-700"
          >
            here
          </a>.
        </p>
      </div>
    </div>
  );
};

export default VendorStatus;