import Order from "../models/Order.js";
import buildQuery from "../utils/queryBuilder.js";

// Vendor/Admin invoice list
export const getAllInvoices = async (req, res) => {
  try {
    // Accept query params for search/filter
    let query = buildQuery(req.query, ["invoiceNumber"]);
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;
    const role = req.person?.role;

    // Always show only approved products
    query.status = "approved";

    let baseQuery = Order.find(query)
      .sort({ unitsSold: -1 })
      .skip(skip)
      .limit(limit)
      .populate("vendorInvoices", "vendorId invoiceUrl");

    if (role !== "admin") {
      if (role === "vendor") {
        baseQuery = baseQuery.select("_id invoiceNumber createdAt totalAmount vendorInvoices");
      } else {
        baseQuery = baseQuery.select("_id invoiceNumber createdAt totalAmount vendorInvoices userInvoiceUrl");
      }
    }

    const [invoices, total] = await Promise.all([
      baseQuery,
      Order.countDocuments(query),
    ]);

    res.status(200).json({
      success: true,
      message: "Invoices fetched successfully",
      invoices,
      total,
      limit
    });
  } catch (err) {
    res.status(500).json({ success: false, message: "Unable to load invoices.", error: err.message });
  }
};