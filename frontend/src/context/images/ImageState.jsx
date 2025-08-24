import ImageContext from "./ImageContext";

const ImageState = ({ children }) => {
  const host = "http://localhost:5000";

  // Role + Token utility
  const getRoleInfo = () => {
    const adminToken = localStorage.getItem("adminToken");
    const vendorToken = localStorage.getItem("vendorToken");

    if (adminToken) {
      return { role: "admin" };
    } else if (vendorToken) {
      return { role: "vendor" };
    } else {
      return { role: "customer" };
    }
  };

  const editProfileImage = async (file, targetId) => {
    try {
      const { role } = getRoleInfo();

      const formData = new FormData();
      formData.append("image", file);
      formData.append("type", "profile");
      formData.append("targetId", targetId);

      const headers = {
        "auth-token": role === "customer"
          ? localStorage.getItem("customerToken")
          : role === "admin"
            ? localStorage.getItem("adminToken")
            : localStorage.getItem("vendorToken"),
      };

      const res = await fetch(`${host}/api/images/edit`, {
        method: "PUT",
        headers,
        body: formData,
      });
      return res;
    } catch (err) {
      console.error("Error editing profile image:", err);
      return { ok: false, error: err.message };
    }
  };

  const removeProfileImage = async ({ publicId, targetId }) => {
    try {
      const { role } = getRoleInfo();
      
      const headers = {
        "Content-Type": "application/json",
        "auth-token": role === "customer"
          ? localStorage.getItem("customerToken")
          : role === "admin"
            ? localStorage.getItem("adminToken")
            : localStorage.getItem("vendorToken"),
      };

      const res = await fetch(`${host}/api/images/delete`, {
        method: "DELETE",
        headers,
        body: JSON.stringify({
          publicId,
          type: "profile",
          targetId,
        }),
      });
      return res;
    } catch (err) {
      console.error("Error removing profile image:", err);
      return { ok: false, error: err.message };
    }
  };

  return (
    <ImageContext.Provider value={{ editProfileImage, removeProfileImage }}>
      {children}
    </ImageContext.Provider>
  );
};

export default ImageState;