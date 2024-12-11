import { motion } from 'framer-motion';
import React, { useState } from 'react';
import OrdersMap from '../components/Map';

const PageProps = {
  orders: [
    {
      _id: "1",
      orderNumber: "ORD001",
      customer: {
        name: "John Doe",
        phone: "123-456-7890",
        address: "Bhiwandi, maharashtra"
      },
    },
    {
      _id: "2",
      orderNumber: "ORD002",
      customer: {
        name: "Jane Smith",
        phone: "987-654-3210",
        address: "Thane west"
      },
    },
    {
      _id: "3",
      orderNumber: "ORD003",
      customer: {
        name: "Alice Johnson",
        phone: "456-789-1234",
        address: "Mulund west, mumbai"
      },
    },
  ],
  filters: {
    status: ["Pending", "Delivered", "Cancelled"],
    areas: ["Downtown", "Uptown", "Midtown"],
    date: "2024-12-09",
  },
};

export default function Orders() {
  const { filters, orders } = PageProps;
  const [openAccordion, setOpenAccordion] = useState(null);

  const toggleAccordion = (id:any) => {
    setOpenAccordion((prev) => (prev === id ? null : id));
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      {/* Filters Section */}
      <div className="mb-6 bg-white shadow-md rounded-lg p-4">
        <h2 className="text-lg font-semibold mb-4 text-gray-800">Filters</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Status Filter */}
          <div>
            <label className="block text-gray-600 mb-2 font-medium">Status</label>
            <select className="w-full border border-gray-300 rounded px-3 py-2">
              {filters.status.map((status) => (
                <option key={status} value={status}>
                  {status}
                </option>
              ))}
            </select>
          </div>
          {/* Area Filter */}
          <div>
            <label className="block text-gray-600 mb-2 font-medium">Area</label>
            <input type="text" className='w-full rounded px-3 py-2 border border-gray-300 ' />
          </div>
          {/* Date Filter */}
          <div>
            <label className="block text-gray-600 mb-2 font-medium">Date</label>
            <input
              type="date"
              className="w-full border border-gray-300 rounded px-3 py-2"
              defaultValue={filters.date}
            />
          </div>
        </div>
      </div>

      {/* Orders List Section */}
      <div className="bg-white shadow-md rounded-lg p-4">
        <h2 className="text-lg font-semibold mb-4 text-gray-800">Orders</h2>
        <ul className="space-y-4">
          {orders.map((order) => (
            <li
              key={order._id}
              className="p-4 border border-gray-200 rounded"
            >
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
                <div className="mb-3 md:mb-0">
                  <h3 className="font-medium text-gray-800">Order #{order.orderNumber}</h3>
                  <p className="text-sm text-gray-600">
                    {order.customer.name} - {order.customer.phone}
                  </p>
                  <p className="text-sm text-gray-600">{order.customer.address}</p>
                </div>
                <div>
                  <button
                    onClick={() => toggleAccordion(order._id)}
                    className="px-4 py-2 mr-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition"
                  >
                    {openAccordion === order._id ? "Hide Details" : "View Details"}
                  </button>
                  <button
                    className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition"
                  >
                    Assign Partner
                  </button>
                </div>
              </div>

              {/* Accordion Section */}
              {openAccordion === order._id && (
                <motion.div initial={{opacity:0,height:0}} animate={{opacity:1,height:"auto"}} className="mt-4 bg-gray-100 p-4 rounded">
                  <h4 className="text-gray-800 font-semibold">Order Details</h4>
                  <p className="text-sm text-gray-600">Order ID: {order._id}</p>
                  <p className="text-sm text-gray-600">Order Number: {order.orderNumber}</p>
                  <p className="text-sm text-gray-600">
                    Customer: {order.customer.name} ({order.customer.phone})
                  </p>
                  <p className="text-sm text-gray-600">Address: {order.customer.address}</p>
                  <p className="text-sm text-gray-600">Status: Pending</p>
                </motion.div>
              )}
            </li>
          ))}
        </ul>
      </div>
      <OrdersMap orders={orders} />
    </div>
  );
}
