export const shippingStatusMap = {
  NEW_READY_TO_SHIP: [
    "Processed At Warehouse",
    "Picklist Generated",
    "Ready To Pack",
    "Packed",
    "FC Manifest Generated",
    "Shipment Booked",
    "Box Packing",
    "FC Allocated"
  ],
  PICKUPS_MANIFESTS: [
    "Picked Up",
    "Out For Pickup",
    "Pickup Booked",
    "Pickup Rescheduled"
  ],
  IN_TRANSIT: [
    "In Transit",
    "In Transit Overseas",
    "Connection Aligned",
    "Reached Overseas Warehouse",
    "Custom Cleared Overseas",
    "Handover to Courier",
    "In Flight",
    "Reached at Destination Hub",
    "Misrouted"
  ],
  DELIVERED: [
    "Delivered",
    "Fulfilled",
    "Self Fulfilled"
  ],
  RTO: [
    "RTO Initiated",
    "RTO Delivered",
    "RTO NDR",
    "RTO OFD",
    "RTO In Transit",
    "RTO Acknowledged",
    "RTO Lock"
  ],
  CANCELLED: [
    "Cancelled",
    "Cancelled Before Dispatched",
    "Disposed Off",
    "Destroyed"
  ],
  EXCEPTIONS: [
    "Pickup Error",
    "Pickup Exception",
    "Handover Exception",
    "Packed Exception",
    "QC Failed",
    "Issue Related To The Recipient",
    "Delayed",
    "Undelivered",
    "Box Packing"
  ]
};

// Utility: get high-level status category
export const getHighLevelStatus = (status) => {
  for (const [key, values] of Object.entries(shippingStatusMap)) {
    if (values.includes(status)) return key;
  }
  return "UNKNOWN";
};