// import React, { useEffect, useState } from "react";
// import { GoogleMap, LoadScript, MarkerF, Polyline } from "@react-google-maps/api";
// import { Order } from "../types/partner";
// import { delIcon } from "../assets";
// //import { assignDriversToOrders } from "../Helper/partnerAssignment";

// const Google_Key = import.meta.env.VITE_GOOGLE_API_KEY;

// const mapStyles = {
//   height: "400px",
//   width: "100%",
//   borderRadius: 15,
//   marginTop: 10,
// };

// const defaultCenter = {
//   lat: 19.0760, // Default center (Mumbai)
//   lng: 72.8777,
// };

// // Mock Delivery Partner Data with string addresses
// const deliveryPartners = [
//   { id: "partner_1", name: "Partner 1", address: "Mulund East, Mumbai, Maharashtra", currentLoad: 0 },
//   { id: "partner_2", name: "Partner 2", address: "Thane East, Mumbai, Maharashtra", currentLoad: 0 },
//   { id: "partner_3", name: "Partner 3", address: "Colaba, Mumbai, Maharashtra", currentLoad: 0 },
// ];

// const OrdersMap = ({ orders }: { orders: Order[] }) => {
//   const [positions, setPositions] = useState<{ [key: string]: { lat: number; lng: number } }>({});
//   const [partnerPositions, setPartnerPositions] = useState<{ [key: string]: { lat: number; lng: number } }>({});
//   const [assignments, setAssignments] = useState<{ orderId: string; partnerId: string }[]>([]);
//   const [routes, setRoutes] = useState<any[]>([]);
//   const [mapLoaded, setMapLoaded] = useState<Boolean>(false);


//   const getLatLngFromAddress = async (address: string) => {
//     const url = `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(address)}&key=${Google_Key}`;
//     const response = await fetch(url);
//     const data = await response.json();

//     if (data.results.length > 0) {
//       const location = data.results[0].geometry.location;
//       return { lat: location.lat, lng: location.lng };
//     } else {
//       console.error("Geocoding error: No results found");
//       return { lat: 19.076, lng: 72.8777 }; // Default fallback
//     }
//   };

//   useEffect(() => {
//     const fetchPositions = async () => {
//       const newPositions: { [key: string]: { lat: number; lng: number } } = {};
//       for (const order of orders) {
//         const position = await getLatLngFromAddress(order.customer.address);
//         newPositions[order._id] = position;
//       }
//       setPositions(newPositions);
//       // console.log(newPositions);
//     };

//     const fetchPartnerPositions = async () => {
//       const newPartnerPositions: { [key: string]: { lat: number; lng: number } } = {};
//       for (const partner of deliveryPartners) {
//         const position = await getLatLngFromAddress(partner.address);
//         newPartnerPositions[partner.id] = position;
//       }
//       setPartnerPositions(newPartnerPositions);
//       // console.log(newPartnerPositions);
//     };
    
//     fetchPositions();
//     fetchPartnerPositions();  
//   }, [orders]); // Re-run when `orders` changes

//   // Call fetchDirections when both positions and partnerPositions are available
//   useEffect(() => {
//     if(!mapLoaded) return;    
//     if (Object.keys(positions).length > 0 && Object.keys(partnerPositions).length > 0) {
//       fetchDirections();
//     }
//   }, [positions, partnerPositions,mapLoaded]); // Trigger when positions or partnerPositions change

//   const fetchDirections = () => {
//     if(assignments.length>0) return;
//     // console.log(positions);
//     const assignedDrivers = assignDriversToOrders(positions, partnerPositions, deliveryPartners);
//     // console.log("Drivers: " + assignedDrivers);    
//     setAssignments(assignedDrivers);
//     //testing
//     console.log("Fetching directions...");    
//     const directionsService = new window.google.maps.DirectionsService();
//     const directionsResults: any[] = [];
//     // Loop through each assignment (order-partner pair)
//     for (const { orderId, partnerId } of assignedDrivers) {
//       const orderPosition = positions[orderId];
//       const partnerPosition = partnerPositions[partnerId];
  
//       console.log('Fetching directions for Order ' + orderId + ' and Partner ' + partnerId);
//       // Check if both positions are available before fetching directions
//       if (orderPosition && partnerPosition) { 
//         console.log("Setting polyline");
               
//         const request = {
//           origin: orderPosition, // Start from the order's position
//           destination: partnerPosition, // End at the partner's position
//           travelMode: window.google.maps.TravelMode.DRIVING, // Travel mode set to driving
//         };
  
//         directionsService.route(request, (result, status) => {
//           if (status === "OK") {
//             const route = result?.routes[0]?.overview_path; // Get the overview path for the route
//             if (route) {
//               directionsResults.push(route); // Add the route to the results array
//             }
//           } else {
//             console.error("Directions request failed due to " + status); // Handle any errors
//           }
  
//           // After all requests are processed, update the routes state
          
//             setRoutes([...directionsResults]);
          
//         });
//       }
//     }
//   };

//   return (
//     <LoadScript googleMapsApiKey={Google_Key} onLoad={()=>setMapLoaded(true)}>
//       <GoogleMap mapContainerStyle={mapStyles} zoom={12} center={defaultCenter}>
//         {orders.map((order) => {
//           const position = positions[order._id];
//           return (
//             position && (
//               <MarkerF
//                 key={order._id}
//                 position={position}
//                 title={`Order #${order.orderNumber}`}
//               />
//             )
//           );
//         })}
//         {deliveryPartners.map((partner) => {
//           const position = partnerPositions[partner.id];
//           return (
//             position && (
//               <MarkerF
//                 key={partner.id}
//                 position={position}
//                 title={`Delivery Partner: ${partner.name}`}
//                 icon={{
//                   url: delIcon,
//                   scaledSize: new window.google.maps.Size(40, 40),
//                 }}
//               />
//             )
//           );
//         })}
//         {routes.map((route, index) => (
//           <Polyline
//             key={index}
//             path={route}
//             options={{
//               strokeColor: "#0096FF",
//               strokeOpacity: 0.8,
//               strokeWeight: 3,
//             }}
//           />
//         ))}
//       </GoogleMap>
//     </LoadScript>
//   );
// };

// export default OrdersMap;
