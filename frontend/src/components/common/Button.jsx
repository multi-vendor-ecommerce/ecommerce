// components/Button.jsx
const COLORS = {
  blue: "border-blue-600 text-blue-600 hover:bg-blue-600",
  green: "border-green-600 text-green-600 hover:bg-green-600",
  red: "border-red-600 text-red-600 hover:bg-red-600",
  gray: "border-gray-600 text-gray-600 hover:bg-gray-600",
};

const Button = ({ 
  icon: Icon, 
  text, 
  onClick, 
  className = "", 
  disabled = false, 
  type = "button", 
  color = "blue" 
}) => {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`flex items-center gap-2 px-2.5 md:px-4 border font-semibold rounded-lg transition duration-150
        ${disabled ? "opacity-50 cursor-not-allowed" : `${COLORS[color]} hover:text-white cursor-pointer`}
        ${className}`}
    >
      {Icon && <Icon size={20} />}
      {text}
    </button>
  );
};

export default Button;