export const shippingStatusMap = {
  pushed_order: [
    "new"
  ],
  new_ready_to_ship: [
    "processed at warehouse",
    "picklist generated",
    "ready to pack",
    "packed",
    "fc manifest generated",
    "shipment booked",
    "box packing",
    "fc allocated",
    "invoiced"
  ],
  pickups_manifests: [
    "picked up",
    "out for pickup",
    "pickup booked",
    "pickup rescheduled"
  ],
  in_transit: [
    "in transit",
    "in transit overseas",
    "connection aligned",
    "reached overseas warehouse",
    "custom cleared overseas",
    "handover to courier",
    "in flight",
    "reached at destination hub",
    "misrouted"
  ],
  delivered: [
    "delivered",
    "fulfilled",
    "self fulfilled"
  ],
  rto: [
    "rto initiated",
    "rto delivered",
    "rto ndr",
    "rto ofd",
    "rto in transit",
    "rto acknowledged",
    "rto lock"
  ],
  cancelled: [
    "cancelled",
    "cancelled before dispatched",
    "disposed off",
    "destroyed"
  ],
  exceptions: [
    "pickup error",
    "pickup exception",
    "handover exception",
    "packed exception",
    "qc failed",
    "issue related to the recipient",
    "delayed",
    "undelivered",
    "box packing"
  ]
};

// Utility: get high-level status category
export const getHighLevelStatus = (status) => {
  if (!status) return "unknown";
  const lowerStatus = status.toLowerCase();
  for (const [key, values] of Object.entries(shippingStatusMap)) {
    if (values.includes(lowerStatus)) return key;
  }
  return "unknown";
};