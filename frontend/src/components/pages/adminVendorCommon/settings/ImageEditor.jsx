import React, { useState, useContext } from "react";
import Button from "../../../common/Button";
import { FiTrash2, FiUpload } from "react-icons/fi";
import ImageContext from "../../../../context/images/ImageContext";

const ImageEditor = ({ heading, person, getCurrentPerson }) => {
  const [loading, setLoading] = useState(false);
  const { editProfileImage, removeProfileImage } = useContext(ImageContext);

  const handleImageChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setLoading(true);
    const res = await editProfileImage(file, person._id);
    setLoading(false);
    if (res.ok) getCurrentPerson();
  };

  const handleRemove = async () => {
    setLoading(true);
    const res = await removeProfileImage({
      publicId: person.profileImageId,
      type: "profile", // <-- Add this line
      targetId: person._id,
    });
    setLoading(false);
    if (res.ok) getCurrentPerson();
  };

  return (
    <div className="flex flex-col gap-3">
      <h3 className="text-lg font-semibold">{heading}</h3>
      <div className="flex flex-col md:flex-row gap-7 items-center">
        <div className="relative w-32 h-32 rounded-full overflow-hidden bg-gray-200 border flex items-center justify-center group mb-2">
          {person.profileImage ? (
            <img
              src={person.profileImage}
              alt="Profile"
              className="w-full h-full object-cover"
            />
          ) : (
            <span className="text-gray-600">No Image</span>
          )}
        </div>
        <input
          type="file"
          accept="image/*"
          id="profileImageInput"
          style={{ display: "none" }}
          onChange={handleImageChange}
          disabled={loading}
        />
        <div className="flex gap-4">
          <Button
            icon={FiUpload}
            text="Update Profile"
            color="blue"
            className="py-1.5 border-blue-600 text-blue-600"
            onClick={() => document.getElementById("profileImageInput").click()}
            disabled={loading}
          />
          <Button
            icon={FiTrash2}
            text="Remove Profile"
            color="red"
            className="py-1.5 border-red-600 text-red-600"
            onClick={handleRemove}
            disabled={loading || !person.profileImage}
          />
        </div>
      </div>
    </div>
  );
};

export default ImageEditor;