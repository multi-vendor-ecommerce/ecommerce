import React from 'react';

const mockOrders = [
  { id: '#00123', user: 'Palchhin', total: '₹1,200', status: 'Delivered' },
  { id: '#00124', user: 'Alex', total: '₹850', status: 'Pending' },
  { id: '#00125', user: 'Mira', total: '₹3,150', status: 'Cancelled' }
];

const RecentOrders = () => {
  return (
    <div className="bg-white p-4 rounded shadow">
      <h2 className="text-lg font-semibold mb-3">Recent Orders</h2>
      <table className="w-full text-sm">
        <thead>
          <tr className="bg-gray-100">
            <th className="text-left p-2">Order ID</th>
            <th className="text-left p-2">Customer</th>
            <th className="text-left p-2">Total</th>
            <th className="text-left p-2">Status</th>
          </tr>
        </thead>
        <tbody>
          {mockOrders.map((order) => (
            <tr key={order.id} className="border-t">
              <td className="p-2">{order.id}</td>
              <td className="p-2">{order.user}</td>
              <td className="p-2">{order.total}</td>
              <td className="p-2">{order.status}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default RecentOrders;
