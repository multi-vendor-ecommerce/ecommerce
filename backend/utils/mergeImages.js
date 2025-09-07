export const mergeImages = (req) => {
  let images = [];

  // Existing images (sent as "existingImages")
  if (req.body.existingImages) {
    const existing = Array.isArray(req.body.existingImages)
      ? req.body.existingImages
      : [req.body.existingImages];

    existing.forEach((img) => {
      try {
        const parsed = typeof img === "string" ? JSON.parse(img) : img;

        if (parsed && parsed.url && parsed.public_id) {
          images.push({
            url: parsed.url,
            public_id: parsed.public_id,
          });
        }
      } catch (e) {
        console.error("Invalid existing image payload:", img, e);
      }
    });
  }

  // New uploaded files
  if (req.files && req.files.length > 0) {
    images.push(
      ...req.files.map((file) => ({
        url: file.path,
        public_id: file.filename || file.public_id, // Cloudinary adapter will usually give public_id
      }))
    );
  }

  return images;
};