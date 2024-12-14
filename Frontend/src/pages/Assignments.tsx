import React from 'react';
import { Assignment, DeliveryPartner, Order } from '../types/partner';
import { useAssignmentStore } from '../store/assignmentStore';
import { usePartnerStore } from '../store/partnerStore';
import axios from 'axios';
import { host } from '../apiRoutes';
import { useOrderStore } from '../store/orderStore';

export default function Assignments() {
  const { assignments,setAssignments } = useAssignmentStore();
  const { deliveryPartners,setDeliveryPartners } = usePartnerStore();
  const {orders,setOrders} = useOrderStore();

  const getPartnerStatus = (partner: DeliveryPartner) => {
    if (partner.status === 'inactive') return 'Offline';
    return partner.currentLoad < 3 ? 'Available' : 'Busy';
  };

  const statusColors = {
    Available: 'bg-green-100 text-green-700',
    Busy: 'bg-yellow-100 text-yellow-700',
    Offline: 'bg-red-100 text-red-700',
  };

  const assnStatusUpdate=async(assignmentId: String,status:String)=>{
    try {
      await axios.patch(`${host}/api/assignments/${assignmentId}`,{status})
      const newAssns=assignments.filter((assn)=>assn._id!=assignmentId)
      setAssignments(newAssns)
      console.log(newAssns);      
    } catch (error) {
      console.log(error);      
    }
  }

  const editOrder=async(orderId:String,status:String)=>{
    try {
      const res=await axios.patch(`${host}/api/orders/${orderId}/status`,{status})
      const newOrders: Order[] = orders
      .filter((order): order is Order => order !== undefined) 
      .map((order) => {
        if (order._id === orderId) {
          return { ...order, status }; 
        }
        return order; 
      });
      console.log(newOrders);      
      setOrders(newOrders);
      console.log(res.data);      
    } catch (error) {
      console.log(error);
    }
  }

  const decLoad=async(partnerId:String)=>{
    try {
      const patchResponse = await axios.patch(
        `${host}/api/partners/${partnerId}`,
        {
          currentLoad: -1
        }
    );
    console.log(patchResponse.data);    
    } catch (error) {
      console.log(error);    
      return false  
    }
  }

  // Handle Complete Assignment
  const handleComplete = async(assignmentId: String,orderId:String,partnerId:String) => {
    // Logic to mark the assignment as complete
    console.log(`Assignment ${assignmentId} completed`);
    assnStatusUpdate(assignmentId,"success").then(()=>
      editOrder(orderId,"delivered").then(()=>{
        decLoad(partnerId)
      })
    )    
    // Add your update logic here (e.g., API call or store update)
  };

  // Handle Cancel Assignment
  const handleCancel = (assignmentId: string) => {
    // Logic to cancel the assignment
    console.log(`Assignment ${assignmentId} cancelled`);
    assnStatusUpdate(assignmentId,"failed")
    // Add your update logic here (e.g., API call or store update)
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Assignments</h1>

      {/* Assignments Section */}
      <div className="mb-8 bg-white shadow-md rounded-lg p-4">
        <h2 className="text-lg font-semibold mb-4 text-gray-800">All Assignments</h2>
        <ul className="space-y-4">
          {assignments.map((assignment: Assignment) => (
            <li
              key={assignment.orderId}
              className="p-4 border border-gray-200 rounded shadow-sm bg-gray-50"
            >
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="text-gray-800 font-medium">Order ID: {assignment.orderId}</h3>
                  <p className="text-sm text-gray-600">Partner ID: {assignment.partnerId}</p>
                  <p className="text-sm text-gray-600">
                    Timestamp: {new Date(assignment.timeStamp).toLocaleString()}
                  </p>
                </div>
                <span
                  className={`px-3 py-1 rounded text-sm font-medium ${
                    assignment.status === 'success' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'
                  }`}
                >
                  {assignment.status === 'success' ? 'Success' : 'Pending'}
                </span>
              </div>
              {assignment.reason && (
                <p className="mt-2 text-sm text-red-500">Reason: {assignment.reason}</p>
              )}
              <div className="mt-4 flex space-x-4">
                <button
                  onClick={() => handleComplete(assignment._id,assignment.orderId,assignment.partnerId)}
                  className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
                >
                  Complete
                </button>
                <button
                  onClick={() => handleCancel(assignment.orderId)}
                  className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
                >
                  Cancel
                </button>
              </div>
            </li>
          ))}
        </ul>
      </div>

      {/* Delivery Partners Section */}
      <div className="bg-white shadow-md rounded-lg p-4">
        <h2 className="text-lg font-semibold mb-4 text-gray-800">Delivery Partners</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {deliveryPartners.map((partner: DeliveryPartner) => (
            <div
              key={partner._id}
              className={`p-4 border rounded-lg shadow-sm ${statusColors[getPartnerStatus(partner)]}`}
            >
              <h3 className="text-lg font-medium">{partner.name}</h3>
              <p className="text-sm">Email: {partner.email}</p>
              <p className="text-sm">Phone: {partner.phone}</p>
              <p className="text-sm">Status: {getPartnerStatus(partner)}</p>
              <p className="text-sm">Current Load: {partner.currentLoad}</p>
              <p className="text-sm">Areas: {partner.areas.join(', ')}</p>
              {partner.metrics && (
                <>
                  <p className="text-sm">Rating: {partner.metrics?.rating.toFixed(1)}</p>
                  <p className="text-sm">Completed Orders: {partner.metrics?.completedOrders}</p>
                  <p className="text-sm">Cancelled Orders: {partner.metrics?.cancelledOrders}</p>
                </>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
