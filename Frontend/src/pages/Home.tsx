import React, { useEffect, useState } from 'react';
import { GoogleMap, LoadScript, MarkerF, Polyline, InfoWindow } from '@react-google-maps/api';
import { usePartnerStore } from '../store/partnerStore';
import { useOrderStore } from '../store/orderStore';
import { getLatLngFromAddress } from '../Helper/partnerAssignment';
import { delIcon } from '../assets';

const Google_Key = import.meta.env.VITE_GOOGLE_API_KEY;

type Coordinates = {
  orderId: string;
  orderCoords: { lat: number; lng: number };
  partnerCoords: { lat: number; lng: number };
  partner: DeliveryPartner | null;
  order: Order;
};

type Order = {
  _id: string;
  orderNumber: string;
  customer: { name: string; phone: string; address: string };
  items: { name: string; quantity: number; price: number }[];
  status: 'pending' | 'assigned' | 'picked' | 'delivered';
  scheduledFor: string; // HH:mm
  assignedTo?: string; // partner's _id
  totalAmount: number;
  createdAt: Date;
  updatedAt: Date;
};

type DeliveryPartner = {
  _id?: string;
  name: string;
  email: string;
  phone: string;
  status: 'active' | 'inactive';
  currentLoad: number;
  areas: string[];
  shift: { start: string; end: string };
  metrics: { rating: number; completedOrders: number; cancelledOrders: number };
};

const AssignmentsMap: React.FC = () => {
  const { deliveryPartners } = usePartnerStore();
  const { orders } = useOrderStore();

  const [coordinates, setCoordinates] = useState<Coordinates[]>([]);
  const [selectedMarker, setSelectedMarker] = useState<Coordinates | null>(null);

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

  return (
    <div className="min-h-screen bg-gray-100">
      <h2 className="text-xl font-semibold p-4">Assignments Dashboard</h2>

      <div className="flex p-8">
        {/* Sidebar */}
        <aside className="w-80 bg-white p-6 rounded-lg shadow-lg mr-8">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Delivery Partners</h2>
          {deliveryPartners.map((partner) => (
            <div className="bg-white p-4 rounded-lg shadow-sm mb-6" key={partner._id}>
              <h3 className="text-lg font-semibold text-gray-800">{partner.name}</h3>
              <p><strong>Email:</strong> {partner.email}</p>
              <p><strong>Status:</strong> {partner.status}</p>
              <p><strong>Rating:</strong> {partner.metrics?partner.metrics.rating:'Unavailable'}</p>
            </div>
          ))}
        </aside>

        {/* Map Container */}
        <section className="flex-1 h-[500px] rounded-lg shadow-lg bg-white">
          <LoadScript googleMapsApiKey={Google_Key}>
            <GoogleMap
              id="assignments-map"
              mapContainerStyle={{ height: '100%', width: '100%' }}
              center={{ lat: 12.9716, lng: 77.5946 }} // Default center (use your own center)
              zoom={3}
            >
              {coordinates.map((coord) => (
                <React.Fragment key={coord.orderId}>
                  {/* Marker for Order */}
                  <MarkerF
                    position={coord.orderCoords}
                    onClick={() => setSelectedMarker(coord)}
                  />

                  {/* Marker for Partner */}
                  <MarkerF
                    position={coord.partnerCoords}
                    icon={{
                      url: delIcon,
                      scaledSize: new window.google.maps.Size(40, 40),
                    }}
                    onClick={() => setSelectedMarker(coord)}
                  />

                  {/* Optional Polyline between Order and Partner */}
                  <Polyline
                    path={[coord.orderCoords, coord.partnerCoords]}
                    options={{
                      strokeColor: '#FF0000',
                      strokeOpacity: 1,
                      strokeWeight: 2,
                    }}
                  />

                  {/* Info Window for Order and Partner */}
                  {selectedMarker?.orderId === coord.orderId && (
                    <InfoWindow
                      position={coord.orderCoords}
                      onCloseClick={() => setSelectedMarker(null)}
                    >
                      <div className="p-4">
                        <h3 className="font-semibold text-lg">Order #{coord.order.orderNumber}</h3>
                        <p><strong>Customer:</strong> {coord.order.customer.name}</p>
                        <p><strong>Phone:</strong> {coord.order.customer.phone}</p>
                        <p><strong>Address:</strong> {coord.order.customer.address}</p>
                        <p><strong>Status:</strong> {coord.order.status}</p>
                        <p><strong>Total Amount:</strong> ₹{coord.order.totalAmount}</p>
                        <p><strong>Scheduled For:</strong> {coord.order.scheduledFor}</p>
                        <h4 className="mt-2 font-semibold">Items:</h4>
                        <ul>
                          {coord.order.items.map((item, index) => (
                            <li key={index}>
                              {item.name} - {item.quantity} x ₹{item.price}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </InfoWindow>
                  )}

                  {/* {selectedMarker?.partner?._id === coord.partner?._id && (
                    <InfoWindow
                      position={coord.partnerCoords}
                      onCloseClick={() => setSelectedMarker(null)}
                    >
                      <div className="p-4">
                        <h3 className="font-semibold text-lg">Partner: {coord.partner?.name}</h3>
                        <p><strong>Email:</strong> {coord.partner?.email}</p>
                        <p><strong>Phone:</strong> {coord.partner?.phone}</p>
                        <p><strong>Status:</strong> {coord.partner?.status}</p>
                        <p><strong>Shift:</strong> {coord.partner?.shift.start} - {coord.partner?.shift.end}</p>
                        {coord.partner?.metrics &&
                        <>
                            <p><strong>Rating:</strong> {coord.partner?.metrics.rating}</p>
                            <p><strong>Completed Orders:</strong> {coord.partner?.metrics.completedOrders}</p>
                            <p><strong>Cancelled Orders:</strong> {coord.partner?.metrics.cancelledOrders}</p>
                        </> 
                        }
                      </div>
                    </InfoWindow>
                  )} */}
                </React.Fragment>
              ))}
            </GoogleMap>
          </LoadScript>
        </section>
      </div>
    </div>
  );
};

export default AssignmentsMap;
