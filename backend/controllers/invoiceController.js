import Order from "../models/Order.js";
import buildQuery from "../utils/queryBuilder.js";

// Vendor/Admin invoice list
export const getAllInvoices = async (req, res) => {
  try {
    const role = req.person?.role;
    if (!["vendor", "admin"].includes(role)) {
      return res.status(403).json({ success: false, message: "Access denied." });
    }

    // Accept query params for search/filter
    let query = buildQuery(req.query, ["invoiceNumber"]);

    const page = Math.max(parseInt(req.query.page) || 1, 1);
    const limit = Math.max(parseInt(req.query.limit) || 10, 1);
    const skip = (page - 1) * limit;

    // Vendor-specific query: only orders that include this vendor
    if (role === "vendor") {
      query["vendorInvoices"] = { $elemMatch: { vendorId: req.person.id } };
    }

    // Base query
    let baseQuery = Order.find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .populate("vendorInvoices.vendorId", "name email shopName");

    // Select fields
    if (role === "vendor") {
      baseQuery = baseQuery.select(
        "_id invoiceNumber createdAt totalTax totalDiscount paymentMethod grandTotal vendorInvoices"
      );
    } else {
      baseQuery = baseQuery.select(
        "_id invoiceNumber createdAt totalTax totalDiscount paymentMethod grandTotal vendorInvoices userInvoiceUrl"
      );
    }

    const [invoices, total] = await Promise.all([
      baseQuery.lean(),
      Order.countDocuments(query),
    ]);

    // For vendors, map each order to include only their vendorInvoices
    if (role === "vendor") {
      invoices.forEach(order => {
        order.vendorInvoices = order.vendorInvoices.filter(
          vi => vi.vendorId?._id?.toString() === req.person.id
        );
      });
    }

    res.status(200).json({
      success: true,
      message: "Invoices fetched successfully",
      invoices,
      total,
      page,
      limit
    });
  } catch (err) {
    console.error("Error fetching invoices:", err);
    res.status(500).json({
      success: false,
      message: "Unable to load invoices.",
      error: err.message
    });
  }
};