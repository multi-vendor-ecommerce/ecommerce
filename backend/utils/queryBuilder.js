import { getDateRange } from "./getDateRange.js"; // your helper function

const buildQuery = (params, searchFields = [], statusFields = ["status"]) => {
  const { search, date, status,  range } = params;
  const query = {};

  // -------------------
  // Search by text fields
  // -------------------
  if (search && searchFields.length > 0) {
    const regex = new RegExp(search, "i");
    query.$or = searchFields
      .filter(field => !field.includes(".") && !field.endsWith("Id"))
      .map(field => ({ [field]: { $regex: regex } }));
  }

  // -------------------
  // Date filter (specific date or range)
  // -------------------
  if (date && !isNaN(Date.parse(date))) {
    const start = new Date(date);
    start.setHours(0, 0, 0, 0);

    const end = new Date(date);
    end.setHours(23, 59, 59, 999);

    query.createdAt = { $gte: start, $lte: end };
  } else if (range) {
    const { startDate, endDate } = getDateRange(range); // your helper
    query.createdAt = { $gte: startDate, $lte: endDate };
  }

  // -------------------
  // Flexible status field(s)
  // -------------------
  if (status && Array.isArray(statusFields)) {
    if (statusFields.length === 1) {
      query[statusFields[0]] = status;
    } else {
      query.$or = statusFields.map(field => ({ [field]: status }));
    }
  }

  return query;
};

export default buildQuery;