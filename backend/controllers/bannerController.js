import Banner from "../models/Banner.js";

export const getBanners = async (req, res) => {
  try {
    const banners = await Banner.find({ isActive: true }).sort({ createdAt: -1 });

    if (!banners || banners.length === 0) {
      return res.status(404).json({
        success: false,
        message: "No active banners found",
        banners: [],
      });
    }

    res.status(200).json({
      success: true,
      banners,
      message: "Banners fetched successfully",
    });
  } catch (error) {
    console.error("Error fetching banners:", error.message);
    res.status(500).json({
      success: false,
      message: "Error fetching banners",
      error: error.message,
    });
  }
};
