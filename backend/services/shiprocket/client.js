const SHIPROCKET_BASE = "https://apiv2.shiprocket.in/v1/external";
let authToken = null;
let tokenExpiry = null;

// Login & cache token
export const shiprocketLogin = async () => {
  if (authToken && tokenExpiry && tokenExpiry > Date.now()) {
    return authToken;
  }

  const res = await fetch(`${SHIPROCKET_BASE}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      email: process.env.SHIPROCKET_EMAIL,
      password: process.env.SHIPROCKET_PASSWORD,
    }),
  });

  const data = await res.json();
  if (!res.ok) {
    console.error("Shiprocket Login Failed:", data);
    throw new Error(data.message || "Shiprocket login failed");
  }

  authToken = data.token;
  tokenExpiry = Date.now() + 9 * 60 * 60 * 1000; 

  return authToken;
};

// Base request
export const shiprocketRequest = async (endpoint, options = {}) => {
  const token = await shiprocketLogin();

  const res = await fetch(`${SHIPROCKET_BASE}${endpoint}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
      ...(options.headers || {}),
    },
  });

  const data = await res.json();
  if (!res.ok) {
    console.error("Shiprocket API Error:", data);
    throw new Error(data.message || "Shiprocket API request failed");
  }

  return data;
};
