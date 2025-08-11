// components/Button.jsx
const Button = ({ icon: Icon, text, onClick, className = "", disabled = false, type = "button", color="blue" }) => {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`flex items-center gap-2 px-4 border font-semibold rounded-lg transition duration-150
        ${disabled ? "opacity-50 cursor-not-allowed" : `hover:bg-${color}-600 hover:text-white cursor-pointer`}
        ${className}`}
    >
      {Icon && <Icon size={20} />}
      {text}
    </button>
  );
};


export default Button;