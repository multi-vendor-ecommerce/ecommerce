// ==========================
// Build MongoDB Query from Parameters
// ==========================
const buildQuery = (params, searchFields = [], statusField = "status") => {
  const { search, date, status } = params;
  const query = {};

  // Only apply $regex to string fields
  if (search && searchFields.length > 0) {
    const regex = new RegExp(search, "i");
    query.$or = searchFields
      .filter(field => !field.includes(".") && !field.endsWith("Id")) // crude filter, adjust as needed
      .map(field => ({
        [field]: { $regex: regex }
      }));
  }

  // Date filter
  if (date && !isNaN(Date.parse(date))) {
    const start = new Date(date);
    start.setHours(0, 0, 0, 0);

    const end = new Date(date);
    end.setHours(23, 59, 59, 999);

    query.createdAt = { $gte: start, $lte: end };
  }

  // Flexible status field
  if (status) {
    query[statusField] = status;
  }

  return query;
};

export default buildQuery;
