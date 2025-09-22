import Order from "../models/Order.js";
import buildQuery from "../utils/queryBuilder.js";

// Vendor/Admin invoice list
export const getAllInvoices = async (req, res) => {
  try {
    const role = req.person?.role;

    // Accept query params for search/filter
    let query = buildQuery(req.query, ["invoiceNumber", "paymentMethod"]);

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
      .limit(limit);

    // Select fields
    if (role === "vendor") {
      baseQuery = baseQuery.select(
        "_id invoiceNumber createdAt totalTax totalDiscount paymentMethod grandTotal vendorInvoices"
      );
    } else {
      baseQuery = baseQuery.populate("vendorInvoices.vendorId", "name email shopName")
        .select("_id invoiceNumber createdAt totalTax totalDiscount paymentMethod grandTotal vendorInvoices userInvoiceUrl");
    }

    let [invoices, total] = await Promise.all([
      baseQuery.lean(),
      Order.countDocuments(query),
    ]);

    // For vendors, map each order to include only their vendorInvoices
    if (role === "vendor") {
      invoices.forEach(order => {
        order.vendorInvoices = order.vendorInvoices.filter(
          vi => vi.vendorId?.toString() === req.person.id
        );
      });

      // Remove orders that have no matching vendorInvoices
      invoices = invoices.filter(order => order.vendorInvoices.length > 0);
    }

    res.status(200).json({
      success: true,
      message: "Invoices fetched successfully",
      invoices,
      total,
      page,
      limit,
    });
  } catch (err) {
    console.error("Error fetching invoices:", err);
    res.status(500).json({
      success: false,
      message: "Unable to load invoices.",
      error: err.message,
    });
  }
};

// Admin invoice detail
export const getInvoiceById = async (req, res) => {
  try {
    const invoice = await Order.findById(req.params.id)
      .populate("vendorInvoices.vendorId", "name email shopName")
      .select(
        "_id invoiceNumber createdAt totalTax totalDiscount paymentMethod grandTotal vendorInvoices userInvoiceUrl"
      );

    if (!invoice) {
      return res.status(404).json({ success: false, message: "Invoice not found" });
    }

    res.status(200).json({
      success: true,
      message: "Invoice fetched successfully",
      invoice,
    });
  } catch (err) {
    console.error("Error fetching invoice:", err);
    res.status(500).json({
      success: false,
      message: "Unable to load invoice.",
      error: err.message,
    });
  }
};