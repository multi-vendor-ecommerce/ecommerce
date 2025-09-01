import { FiClock } from "react-icons/fi";

const PendingApproval = () => (
  <div className="flex items-center justify-center min-h-screen bg-gray-900">
    <div className="mx-6 md:mx-0 max-w-lg bg-[#0d1833] p-8 shadow-lg shadow-gray-500 border border-gray-700 transition duration-200 rounded-xl text-center">
      <FiClock className="text-yellow-500 mx-auto mb-4" size={40} />
      <h2 className="text-2xl font-bold mb-4 text-yellow-500">Account Pending Approval</h2>
      <p className="text-gray-300 mb-6 flex flex-col justify-center items-center gap-2">
        <span>Your vendor account is awaiting admin approval.</span>
        <span>You will be notified once your account is approved.</span>
        <span>Please check back later.</span>
      </p>
      <p className="text-gray-400 mt-4">
        If you have questions, please contact{" "}
        <a href="mailto:noahplanet20@gmail.com" className="text-blue-600 underline hover:text-blue-700">here</a>.
      </p>
    </div>
  </div>
);

export default PendingApproval;