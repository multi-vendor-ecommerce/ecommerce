/**
 * Build a MongoDB query based on common filters like search, date, status.
 * @param {Object} params - Query parameters from req.query
 * @param {Array} searchFields - Fields to apply the search regex on
 * @returns {Object} Mongoose query object
 */
export const buildQuery = (params, searchFields = []) => {
  const { search, date, status } = params;
  const query = {};

  // Generic Search across given fields
  if (search && searchFields.length > 0) {
    const regex = new RegExp(search, "i");
    query.$or = searchFields.map(field => ({
      [field]: { $regex: regex }
    }));
  }

  // Date filtering
  if (date && !isNaN(Date.parse(date))) {
    const start = new Date(date);
    start.setHours(0, 0, 0, 0);

    const end = new Date(date);
    end.setHours(23, 59, 59, 999);

    query.createdAt = { $gte: start, $lte: end };
  }

  // Status (optional)
  if (status) {
    query.status = status;
  }

  return query;
};

export default buildQuery;
