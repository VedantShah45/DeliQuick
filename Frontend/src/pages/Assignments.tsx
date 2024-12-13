import React from 'react';
import { Assignment, DeliveryPartner } from '../types/partner';
import { useAssignmentStore } from '../store/assignmentStore';
import { usePartnerStore } from '../store/partnerStore';

export default function Assignments() {
  const { assignments } = useAssignmentStore();
  const { deliveryPartners } = usePartnerStore();

  const getPartnerStatus = (partner: DeliveryPartner) => {
    if (partner.status === 'inactive') return 'Offline';
    return partner.currentLoad < 3 ? 'Available' : 'Busy';
  };

  const statusColors = {
    Available: 'bg-green-100 text-green-700',
    Busy: 'bg-yellow-100 text-yellow-700',
    Offline: 'bg-red-100 text-red-700',
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
              { partner.metrics && 
              <>
                <p className="text-sm">Rating: {partner.metrics?.rating.toFixed(1)}</p>
                <p className="text-sm">Completed Orders: {partner.metrics?.completedOrders}</p>
                <p className="text-sm">Cancelled Orders: {partner.metrics?.cancelledOrders}</p>
              </>
              }
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
