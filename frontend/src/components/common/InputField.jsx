const InputField = ({ label, name, type = "text", placeholder, value, onChange, required = false, title = "", disabled = false, textarea = false, className = "" }) => {
  const baseClasses = "w-full rounded-xl px-3 py-3.5 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition duration-150";

  // If disabled, make it look obvious
  const disabledClasses = disabled ? "bg-gray-100 cursor-not-allowed text-gray-500" : "bg-gray-200";

  return (
    <div>
      {label && <label htmlFor={name} className="block mb-2 font-medium">{label}</label>}
      {textarea ? (
        <textarea
          id={name}
          name={name}
          value={value}
          placeholder={placeholder}
          title={title}
          onChange={onChange}
          rows={3}
          disabled={disabled}
          className={`${baseClasses} ${disabledClasses} ${className}`}
          required={required}
        />
      ) : (
        <input
          id={name}
          name={name}
          type={type}
          value={value}
          placeholder={placeholder}
          title={title}
          onChange={onChange}
          disabled={disabled}
          className={`${baseClasses} ${disabledClasses} ${className}`}
          required={required}
        />
      )}
    </div>
  );
};

export default InputField;
