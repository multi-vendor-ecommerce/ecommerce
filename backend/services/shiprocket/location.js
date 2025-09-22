export const fetchShiprocketPickupLocations = async (token) => {
  const baseURL = process.env.SHIPROCKET_BASE_URL || "https://apiv2.shiprocket.in";
  const url = `${baseURL}/v1/external/settings/company/pickup`;

  try {
    const response = await fetch(url, {
      method: "GET",
      headers: {
        "Authorization": `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      console.error("Shiprocket API error:", response.status, response.statusText);
      return [];
    }

    const result = await response.json();

    // Correct path for pickup addresses
    const arr = result?.data?.shipping_address || [];

    console.log("Shiprocket pickup locations raw:", result);
    console.log("shiprokect pickupaddress: ",arr);
    return arr;
  } catch (err) {
    console.error("Error fetching Shiprocket pickup locations:", err.message);
    return [];
  }
};
