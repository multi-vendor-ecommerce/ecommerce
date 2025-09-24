import ReactQuill from "react-quill-new";
import "react-quill-new/dist/quill.snow.css";

const InputField = ({
  label,
  name,
  type = "text",
  min = 0,
  placeholder,
  value,
  onChange,
  required = false,
  title = "",
  disabled = false,
  richtext = false, // toggle for product description
  className = "",
}) => {
  const baseClasses =
    "w-full rounded-xl px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition duration-150";

  const disabledClasses = disabled
    ? "bg-gray-100 cursor-not-allowed text-gray-500"
    : "bg-gray-200";

  const quillModules = {
    toolbar: [
      [{ header: [1, 2, 3, false] }],        // Headings (H1, H2, H3, normal)
      ["bold", "italic", "underline"],   // Formatting
      [{ list: "ordered" }, { list: "bullet" }], // Lists
      ["link"],                          // Hyperlinks
    ],
  };

  return (
    <div>
      {label && (
        <label htmlFor={name} className="block mb-2 font-medium">
          {label}
        </label>
      )}

      {richtext ? (
        <div className={`custom-quill-wrapper ${disabled ? 'disabled' : ''}`}>
          <ReactQuill
            theme="snow"
            value={value}
            onChange={val => onChange({ target: { name, value: val } })}
            modules={quillModules}
            placeholder={placeholder}
            readOnly={disabled}
            className="custom-quill"
          />
        </div>
      ) : (
        <input
          id={name}
          name={name}
          type={type}
          value={value}
          placeholder={placeholder}
          title={title}
          min={min}
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