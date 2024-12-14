import { motion } from 'framer-motion';
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import AddOrderForm from '../components/OrderForm';
import { host } from '../apiRoutes';
import { useOrderStore } from '../store/orderStore';
import { Order } from '../types/partner';

const PageProps = {
  filters: {
    status: ["All", "Pending", "Delivered", "Cancelled"],
    areas: ["Downtown", "Uptown", "Midtown"],
    date: "2024-12-09",
  },
};

export default function Orders() {
  const [showForm, setShowForm] = useState<Boolean>(false);
  const [openAccordion, setOpenAccordion] = useState(null);
  const { orders, setOrders } = useOrderStore();

  // Filters State
  const [statusFilter, setStatusFilter] = useState("All");
  const [areaFilter, setAreaFilter] = useState("");
  const [dateFilter, setDateFilter] = useState(PageProps.filters.date);

  // State to hold filtered orders
  const [filteredOrders, setFilteredOrders] = useState<Order[]>([]);

  // Fetch Orders on Mount
  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await axios.get(`${host}/api/orders`);
        setOrders(response.data); // Set initial orders in the store
      } catch (error) {
        console.error('Error fetching orders:', error);
      }
    };
    fetchOrders();
  }, [setOrders]);

  // Update filteredOrders whenever orders or filters change
  useEffect(() => {
    console.log(orders);    
    if (Array.isArray(orders.orders)) {
      const updatedFilteredOrders = orders.orders.filter((order) => {
        const matchesStatus = statusFilter === "All" || statusFilter.toLowerCase() === order.status; // Dummy "Pending" for demonstration
        const matchesArea = areaFilter === "" || order.customer.address.toLowerCase().includes(areaFilter.toLowerCase());
        // const matchesDate = dateFilter === "" || true; // Update when order.date exists        
        return matchesStatus && matchesArea;
      });
      console.log("Updated filters, ",updatedFilteredOrders);
      
      setFilteredOrders(updatedFilteredOrders);
    }
  }, [orders, statusFilter, areaFilter, dateFilter]); // Re-run whenever any of these change

  // Delete an Order
  const deleteOrder = async (id: string) => {
    try {
      await axios.delete(`${host}/api/orders/${id}`);
      const newOrders = orders.filter((order) => order._id !== id);
      setOrders(newOrders);
    } catch (error) {
      console.error('Error deleting order:', error);
    }
  };

  // Toggle Accordion
  const toggleAccordion = (id: any) => {
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
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full border border-gray-300 rounded px-3 py-2"
            >
              {PageProps.filters.status.map((status) => (
                <option key={status} value={status}>
                  {status}
                </option>
              ))}
            </select>
          </div>
          {/* Area Filter */}
          <div>
            <label className="block text-gray-600 mb-2 font-medium">Area</label>
            <input
              type="text"
              value={areaFilter}
              onChange={(e) => setAreaFilter(e.target.value)}
              className="w-full rounded px-3 py-2 border border-gray-300"
              placeholder="Enter area"
            />
          </div>
          {/* Date Filter */}
          <div>
            <label className="block text-gray-600 mb-2 font-medium">Date</label>
            <input
              type="date"
              value={dateFilter}
              onChange={(e) => setDateFilter(e.target.value)}
              className="w-full border border-gray-300 rounded px-3 py-2"
            />
          </div>
        </div>
      </div>

      <div className="mb-6">
        <button
          onClick={() => setShowForm(!showForm)}
          className="px-6 py-2 bg-green-500 text-white rounded hover:bg-green-600 transition"
        >
          {showForm ? 'Cancel' : 'Add Order'}
        </button>
      </div>
      {showForm && <AddOrderForm />}

      {/* Orders List Section */}
      <div className="bg-white shadow-md rounded-lg p-4">
        <h2 className="text-lg font-semibold mb-4 text-gray-800">Orders</h2>
        <ul className="space-y-4">
          {filteredOrders.map((order) => (
            <li key={order._id} className="p-4 border border-gray-200 rounded">
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
                    {openAccordion === order._id ? 'Hide Details' : 'View Details'}
                  </button>
                  <button
                    onClick={() => deleteOrder(order._id)}
                    className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition"
                  >
                    Delete Order
                  </button>
                </div>
              </div>

              {/* Accordion Section */}
              {openAccordion === order._id && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  className="mt-4 bg-gray-100 p-4 rounded"
                >
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
    </div>
  );
}
