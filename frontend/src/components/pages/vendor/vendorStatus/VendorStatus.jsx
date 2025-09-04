import { useContext } from "react";
import Button from "../../../common/Button";
import { statusMessages } from "./data/statusMessages";
import { toast } from "react-toastify";
import VendorContext from "../../../../context/vendors/VendorContext";
import { HiOutlineLogout } from "react-icons/hi";
import AuthContext from "../../../../context/auth/AuthContext";
import PersonContext from "../../../../context/person/PersonContext";

const VendorStatus = ({ status }) => {
  const { person } = useContext(PersonContext);
  const { logout } = useContext(AuthContext);
  const { reactivateVendorAccount } = useContext(VendorContext);
  const { title, message, icon, color } =
    statusMessages[status] || statusMessages.pending;

  const handleReactivate = async () => {
    const result = await reactivateVendorAccount();
    if (result.success) {
      toast.success(result.message || "Account reactivation request sent.");
      setTimeout(() => {
        handleLogOut();
      }, 2000);
    } else {
      toast.error(result.message || "Failed to send account reactivation request.");
    }
  };

  const handleLogOut = () => {
    logout(person?.role || "vendor");
  };

  // Render icon as a React component
  const Icon = icon;

  return (
    <div className="flex flex-col gap-5 items-center justify-center min-h-screen bg-gray-900">
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

      <Button 
        icon={HiOutlineLogout}
        text="Sign out"
        onClick={handleLogOut}
        className="mt-4 py-2"
        color="red"
      />
    </div>
  );
};

export default VendorStatus;