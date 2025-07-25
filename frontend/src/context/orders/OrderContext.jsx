import { createContext } from "react";

const OrderContext = createContext({
    orders: [],
    adminOrders: [],
    vendorOrders: [],
    placeOrder: () => { },
    getMyOrders: () => { },
    getAllOrders: () => { },
    getVendorOrders: () => { },
    loading: false,
});

export default OrderContext;