import React, { useEffect, useState } from "react";
import { GoogleMap, LoadScript, MarkerF, Polyline } from "@react-google-maps/api";
import { Order } from "../types/partner";
import { delIcon } from "../assets";
import { assignDriversToOrders } from "../Helper/partnerAssignment";

const Google_Key = import.meta.env.VITE_GOOGLE_API_KEY;

const mapStyles = {
  height: "400px",
  width: "100%",
  borderRadius: 15,
  marginTop: 10,
};

const defaultCenter = {
  lat: 19.0760, // Default center (Mumbai)
  lng: 72.8777,
};

// Mock Delivery Partner Data with string addresses
const deliveryPartners = [
  { id: "partner_1", name: "Partner 1", address: "Mulund East, Mumbai, Maharashtra", currentLoad: 0 },
  { id: "partner_2", name: "Partner 2", address: "Thane East, Mumbai, Maharashtra", currentLoad: 0 },
  { id: "partner_3", name: "Partner 3", address: "Colaba, Mumbai, Maharashtra", currentLoad: 0 },
];

const OrdersMap = ({ orders }: { orders: Order[] }) => {
  const [positions, setPositions] = useState<{ [key: string]: { lat: number; lng: number } }>({});
  const [partnerPositions, setPartnerPositions] = useState<{ [key: string]: { lat: number; lng: number } }>({});
  const [assignments, setAssignments] = useState<{ orderId: string, partnerId: string }[]>([]); // Map of orderId to partnerId
  const [routes, setRoutes] = useState<any[]>([]); // Store directions (routes)

  const getLatLngFromAddress = async (address: string) => {
    const apiKey = Google_Key;
    const url = `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(address)}&key=${apiKey}`;
    const response = await fetch(url);
    const data = await response.json();

    if (data.results.length > 0) {
      const location = data.results[0].geometry.location;
      return { lat: location.lat, lng: location.lng };
    } else {
      console.error("Geocoding error: No results found");
      return { lat: 19.0760, lng: 72.8777 }; // Default fallback
    }
  };

  useEffect(() => {
    const fetchPositions = async () => {
      const newPositions: { [key: string]: { lat: number; lng: number } } = {};
      for (const order of orders) {
        const position = await getLatLngFromAddress(order.customer.address);
        newPositions[order._id] = position;
      }
      setPositions(newPositions);
    };

    const fetchPartnerPositions = async () => {
      const newPartnerPositions: { [key: string]: { lat: number; lng: number } } = {};
      for (const partner of deliveryPartners) {
        const position = await getLatLngFromAddress(partner.address);
        newPartnerPositions[partner.id] = position;
      }
      setPartnerPositions(newPartnerPositions);
    };

    const assignOrders = () => {
      const assignedDrivers = assignDriversToOrders(positions, partnerPositions, deliveryPartners);
      setAssignments(assignedDrivers);
    };

    fetchPositions();
    fetchPartnerPositions();
    assignOrders();
  }, [orders]);

  // Fetch directions (routes) between orders and assigned partners
  useEffect(() => {
    const fetchDirections = async () => {
      const directionsService = new window.google.maps.DirectionsService();
      const directionsResults: any[] = [];

      for (const { orderId, partnerId } of assignments) {
        const orderPosition = positions[orderId];
        const partnerPosition = partnerPositions[partnerId];

        if (orderPosition && partnerPosition) {
          const request = {
            origin: orderPosition,
            destination: partnerPosition,
            travelMode: window.google.maps.TravelMode.DRIVING, // You can change this to WALKING, BICYCLING, etc.
          };

          directionsService.route(request, (result, status) => {
            if (status === "OK") {
              directionsResults.push(result?.routes[0].overview_path); // Store the path of the route
              setRoutes([...directionsResults]);
              console.log(directionsResults);              
            } else {
              console.error("Directions request failed due to " + status);
            }
          });
        }
      }
    };

    fetchDirections();
  }, [assignments, positions, partnerPositions]);

  const mapRef = React.useRef(null);

  return (
    <LoadScript googleMapsApiKey={Google_Key}>
      <GoogleMap
        mapContainerStyle={mapStyles}
        zoom={12}
        center={defaultCenter}
        ref={mapRef}
      >
        {/* Display Order Markers */}
        {orders.map((order) => {
          const position = positions[order._id];
          return (
            position && (
              <MarkerF
                key={order._id}
                position={position}
                title={`Order #${order.orderNumber}`}
              />
            )
          );
        })}

        {/* Display Delivery Partner Markers with Custom Icon */}
        {deliveryPartners.map((partner) => {
          const position = partnerPositions[partner.id];
          return (
            position && (
              <MarkerF
                key={partner.id}
                position={position}
                title={`Delivery Partner: ${partner.name}`}
                icon={{
                  url: delIcon,
                  scaledSize: new window.google.maps.Size(40, 40),
                }}
              />
            )
          );
        })}

        {/* Draw the actual route paths */}
        {routes.map((route, index) => (
          <Polyline
            key={index}
            path={route}
            options={{
              strokeColor: "#0096FF",
              strokeOpacity: 2,
              strokeWeight: 2.5,
            }}
          />
        ))}
      </GoogleMap>
    </LoadScript>
  );
};

export default OrdersMap;
