// ==========================
// Build MongoDB Query from Parameters
// ==========================
const buildQuery = (params, searchFields = []) => {
  const { search, date, status } = params;
  const query = {};

  // Generic Search
  if (search && searchFields.length > 0) {
    const regex = new RegExp(search, "i");
    query.$or = searchFields.map(field => ({
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

  // Handle both boolean-style "status" and string "status"
  if (status) {
    query.status = status;
  }

  return query;
};

export default buildQuery;
