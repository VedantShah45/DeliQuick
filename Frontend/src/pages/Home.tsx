import React, { useEffect, useState } from 'react';
import { GoogleMap, MarkerF, Polyline, InfoWindow } from '@react-google-maps/api';
import { usePartnerStore } from '../store/partnerStore';
import { useOrderStore } from '../store/orderStore';
import { getLatLngFromAddress } from '../Helper/partnerAssignment';
import { delIcon } from '../assets';
import { Assignment, AssignmentMetrics, DeliveryPartner, Order } from '../types/partner';
import axios from 'axios';
import { host } from '../apiRoutes';
import { Download } from 'lucide-react';
import { useAssignmentStore } from '../store/assignmentStore';

type Coordinates = {
  orderId: string;
  orderCoords: { lat: number; lng: number };
  partnerCoords: { lat: number; lng: number };
  partner: DeliveryPartner | null;
  order: Order;
};

const AssignmentsMap: React.FC = () => {
  const { deliveryPartners, setDeliveryPartners } = usePartnerStore();
  const { orders } = useOrderStore();
  const { setOrders } = useOrderStore();
  const { setAssignments, assignments } = useAssignmentStore();
  const [loading, setLoading] = useState<boolean>(false);
  const [coordinates, setCoordinates] = useState<Coordinates[]>([]);
  const [selectedOrderId, setSelectedOrderId] = useState<string | null>(null);

  const fetchPartners = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${host}/api/partners`);
      setDeliveryPartners(response.data.partners);
    } catch (error) {
      console.log('Error fetching partners:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchOrders = async () => {
    try {
      const response = await axios.get(`${host}/api/orders`);
      // console.log(response.data.orders);  
      const orders=response.data.orders    
      setOrders(orders);
    } catch (error) {
      console.log('Error fetching orders:', error);
    }
  };

  const fetchAssignments = async () => {
    try {
      const response = await axios.get(`${host}/api/assignments`);
      setAssignments(response.data.assignments);
    } catch (error) {
      console.log('Error fetching assignments:', error);
    }
  };

  useEffect(() => {
    fetchPartners();
    fetchAssignments();
    fetchOrders();
  }, []);
  
  useEffect(() => {
    const fetchCoordinates = async () => {
      const coords = await Promise.all(
        orders.map(async (order: Order) => {
          const partner = deliveryPartners.find((partner) => partner._id === order.assignedTo);
          const orderCoords = await getLatLngFromAddress(order.customer.address);
          const partnerCoords = partner
            ? await getLatLngFromAddress(partner.areas[0])
            : { lat: 0, lng: 0 };
          return {
            orderId: order._id,
            orderCoords,
            partnerCoords,
            partner: partner || null,
            order,
          };
        })
      );
      setCoordinates(coords);
    };

    fetchCoordinates();
  }, [orders, deliveryPartners]);

  const calculateMetrics = (assignments: Assignment[]): AssignmentMetrics => {
    const totalAssigned = assignments.length;
    const successCount = assignments.filter((assignment) => assignment.status === 'success').length;
    const successRate = totalAssigned > 0 ? parseFloat(((successCount / totalAssigned) * 100).toFixed(2)) : 0;

    const failedAssignments = assignments.filter((assignment) => assignment.status === 'failed');
    const failureReasons: { reason: string; count: number }[] = [];

    failedAssignments.forEach((assignment) => {
      const existingReason = failureReasons.find((reason) => reason.reason === assignment.reason);
      if (existingReason) {
        existingReason.count++;
      } else {
        failureReasons.push({ reason: assignment.reason || 'Unknown', count: 1 });
      }
    });

    const totalTime = assignments
      .filter((assignment) => assignment.status === 'success')
      .reduce((acc, assignment) => {
        const timeTaken = new Date().getTime() - new Date(assignment.timeStamp).getTime();
        return acc + timeTaken;
      }, 0);

    const averageTime = successCount > 0 ? totalTime / successCount : 0;

    return {
      totalAssigned,
      successRate,
      averageTime: averageTime / 1000 / 60, // Convert to minutes
      failureReasons,
    };
  };

  const handleDownload = async () => {
    try {
      const res = await axios.get(`${host}/api/partners/metrics`, {
        responseType: 'blob' // Important: treat response as binary data
      });

      const blob = new Blob([res.data], { type: 'text/csv' });
      const url = window.URL.createObjectURL(blob);

      const a = document.createElement('a');
      a.href = url;
      a.download = 'partner_metrics_report.csv'; // Desired file name
      document.body.appendChild(a);
      a.click();
      a.remove();

      // Optional: Clean up the object URL after use
      window.URL.revokeObjectURL(url);
    } catch (err) {
      console.error('Download failed:', err);
      alert('Failed to download report');
    }
  };

  const metrics = calculateMetrics(assignments);

  if(loading) return <div>Loading...</div>;

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Assignment Metrics Card */}
      <section className="p-8 mt-8 bg-white shadow-lg overflow-x-auto">
        <div className="flex items-center mb-4">
          <h3 className="text-xl font-semibold text-gray-800 px-3">Key Assignment Metrics</h3>
          <button 
            className="text-gray-600 hover:text-blue-600"
            onClick={handleDownload} // Add this handler to trigger CSV download
            title="Download report"
          >
            <Download size={20} />
          </button>
        </div>

        <div className="flex space-x-8">
          <div className="bg-blue-50 p-4 rounded-lg shadow-sm w-64">
            <h4 className="text-lg font-semibold">Total Assignments</h4>
            <p className="text-3xl font-bold">{metrics.totalAssigned}</p>
          </div>
          <div className="bg-blue-50 p-4 rounded-lg shadow-sm w-64">
            <h4 className="text-lg font-semibold">Success Rate</h4>
            <p className="text-3xl font-bold">{metrics.successRate}%</p>
          </div>
          <div className="bg-blue-50 p-4 rounded-lg shadow-sm w-64">
            <h4 className="text-lg font-semibold">Average Time (Minutes)</h4>
            <p className="text-3xl font-bold">{metrics.averageTime.toFixed(2)}</p>
          </div>
        </div>
        {metrics.failureReasons.length > 0 && (
          <div className="mt-6">
            <h4 className="text-lg font-semibold mb-4">Failure Reasons</h4>
            <ul className="space-y-2">
              {metrics.failureReasons.map((failure, index) => (
                <li key={index} className="flex justify-between">
                  <span>{failure.reason}</span>
                  <span className="font-bold">{failure.count}</span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </section>

      <h2 className="text-xl font-semibold p-4">Assignments Dashboard</h2>

      <div className="flex-wrap sm:flex p-8">
        {/* Sidebar */}        
        <div className="w-80 bg-white p-6 rounded-lg shadow-lg mr-8">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Delivery Partners</h2>
          {deliveryPartners.map((partner) => (
            <div className="bg-white p-4 rounded-lg shadow-sm mb-3" key={partner._id}>
              <h3 className="text-lg font-semibold text-gray-800">{partner.name}</h3>
              <p>
                <strong>Email:</strong> {partner.email}
              </p>
              <p>
                <strong>Status:</strong> {partner.status}
              </p>
              <p>
                <strong>Rating:</strong> {partner.metrics ? partner.metrics.rating : 'Unavailable'}
              </p>
            </div>
          ))}
        </div>

        {/* Map Container */}
        <section className="flex-1 h-[500px] rounded-lg shadow-lg">
          <p className="font-bold text-xl">Click on an Order for Insights</p>
          <GoogleMap
            id="assignments-map"
            mapContainerStyle={{ height: '100%', width: '100%' }}
            center={coordinates[0]?.partnerCoords}
            zoom={10}
          >
            {coordinates.map((coord) => (
              <React.Fragment key={coord.orderId}>
                {/* Marker for Order */}
                <MarkerF
                  position={coord.orderCoords}
                  onClick={() => setSelectedOrderId(coord.orderId)}
                />

                {/* Marker for Partner */}
                <MarkerF
                  position={coord.partnerCoords}
                  icon={{
                    url: delIcon,
                    scaledSize: new window.google.maps.Size(40, 40),
                  }}
                  title={coord.partner?.name}
                />

                {/* Polyline between Order and Partner */}
                <Polyline
                  path={[coord.orderCoords, coord.partnerCoords]}
                  options={{
                    strokeColor: '#FF0000',
                    strokeOpacity: 1,
                    strokeWeight: 2,
                  }}
                />

                {/* Info Window */}
                {selectedOrderId === coord.orderId && (
                  <InfoWindow
                    position={coord.orderCoords}
                    onCloseClick={() => setSelectedOrderId(null)}
                  >
                    <div className="p-2 text-sm">
                      <h3 className="font-semibold text-lg mb-2">Order #{coord.order.orderNumber}</h3>
                      <p><strong>Customer:</strong> {coord.order.customer.name}</p>
                      <p><strong>Partner:</strong> {coord.partner?.name}</p>
                      <p><strong>Phone:</strong> {coord.order.customer.phone}</p>
                      <p><strong>Address:</strong> {coord.order.customer.address}</p>
                      <p><strong>Status:</strong> {coord.order.status}</p>
                      <p><strong>Total Amount:</strong> ₹{coord.order.totalAmount}</p>
                      <p><strong>Scheduled For:</strong> {coord.order.scheduledFor}</p>
                      <h4 className="mt-2 font-semibold">Items:</h4>
                      <ul className="list-disc ml-4">
                        {coord.order.items.map((item, index) => (
                          <li key={index}>{item.name} - {item.quantity} x ₹{item.price}</li>
                        ))}
                      </ul>
                    </div>
                  </InfoWindow>
                )}
              </React.Fragment>
            ))}
          </GoogleMap>
        </section>
      </div>      
    </div>
  );
};

export default AssignmentsMap;
