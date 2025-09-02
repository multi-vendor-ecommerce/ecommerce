import React, { useState, useContext } from "react";
import { FiTrash2, FiUpload } from "react-icons/fi";
import ImageContext from "../../context/images/ImageContext";
import Button from "./Button";
import { toast } from "react-toastify";

const ImageEditor = ({ heading, person, getCurrentPerson, type = "profile" }) => {
  const [loading, setLoading] = useState(false);
  const { editProfileImage, removeProfileImage } = useContext(ImageContext);

  // Use correct fields based on type
  const imageUrl = type === "shopLogo" ? person.shopLogo : person.profileImage;
  const imageId = type === "shopLogo" ? person.shopLogoId : person.profileImageId;
  const inputId = `${type}ImageInput`;

  const handleImageChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setLoading(true);
    const res = await editProfileImage(file, person._id, type);
    setLoading(false);

    e.target.value = "";
    if (res.ok) {
      toast.success(`${heading} updated successfully!`);
      getCurrentPerson();
    } else {
      toast.error(res.message || `Failed to update ${heading}.`);
    }
  };

  const handleRemove = async () => {
    setLoading(true);
    const res = await removeProfileImage({
      publicId: imageId,
      targetId: person._id,
      type,
    });
    setLoading(false);
    if (res.ok) {
      toast.success(`${heading} removed successfully!`);
      getCurrentPerson();
    } else {
      toast.error(res.message || `Failed to remove ${heading}.`);
    }
  };

  return (
    <div className="flex flex-col gap-3">
      <h3 className="text-lg font-semibold">{heading}</h3>
      <div className="flex flex-col md:flex-row gap-7 items-center">
        <div className="relative w-32 h-32 rounded-full overflow-hidden bg-gray-200 border flex items-center justify-center group mb-2">
          {imageUrl ? (
            <img
              src={imageUrl}
              alt={heading}
              className="w-full h-full object-cover"
            />
          ) : (
            <span className="text-gray-600">No Image</span>
          )}
        </div>
        <input
          type="file"
          accept="image/*"
          id={inputId}
          style={{ display: "none" }}
          onChange={handleImageChange}
          disabled={loading}
        />
        <div className="flex flex-col md:flex-row gap-4">
          {[{ icon: FiUpload, text: `Upload ${heading}`, color: "blue", onClick: () => document.getElementById(inputId).click(), disabled: loading },
            { icon: FiTrash2, text: `Remove ${heading}`, color: "red", onClick: handleRemove, disabled: loading || !imageUrl }
          ].map(({ icon, text, color, onClick, disabled }, index) => (
            <Button
              key={index}
              icon={icon}
              text={text}
              color={color}
              className={`py-2 border-${color}-600 text-${color}-600`}
              onClick={onClick}
              disabled={disabled}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default ImageEditor;