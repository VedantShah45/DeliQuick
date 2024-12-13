import { del } from "framer-motion/client";
import { DeliveryPartner } from "../types/partner";

const Google_Key = import.meta.env.VITE_GOOGLE_API_KEY;

// Haversine formula to calculate the distance between two coordinates
export const haversineDistance = (
  coords1: { lat: number; lng: number },
  coords2: { lat: number; lng: number }
): number => {
  const R = 6371; // Earth's radius in kilometers
  const toRad = (angle: number) => (angle * Math.PI) / 180;
  const dLat = toRad(coords2.lat - coords1.lat);
  const dLng = toRad(coords2.lng - coords1.lng);
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(coords1.lat)) * Math.cos(toRad(coords2.lat)) * Math.sin(dLng / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
};

// Function to assign a delivery partner to a single order based on the shortest distance
export const assignDeliveryPartnerToOrder = (
  orderCoords: { lat: number; lng: number },
  partnerPositions: { [key: string]: { lat: number; lng: number } },
  deliveryPartners: DeliveryPartner[]
): { partnerId: string | null, partnerName: string | null ,address:string | null} => {
  
  // Filter available drivers based on current load
  const availableDrivers = deliveryPartners.filter((partner) => partner.currentLoad < 3);
  
  let bestDriverId: string | null = null;
  let bestDriverName: string | null = null;
  let minDistance = Infinity;
  let bestDriverAddress:string|null=null

  // Find the closest available driver
  for (const driverId in partnerPositions) {  
    const driverCoords = partnerPositions[driverId];
    const driver = availableDrivers.find((d) => d._id === driverId);
  
    if (driver && driver.currentLoad < 3) {
      const distance = haversineDistance(orderCoords, driverCoords);
      if (distance < minDistance) {
        minDistance = distance;
        bestDriverId = driverId;
        bestDriverName = driver.name;
        bestDriverAddress=driver.areas[0]
          // Store the driver's name for display
      }
    }
  }

  // Return the best delivery partner's ID and Name
  return { partnerId: bestDriverId, partnerName: bestDriverName,address:bestDriverAddress };
};

export  const getLatLngFromAddress = async (address: string) => {
    const url = `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(address)}&key=${Google_Key}`;
    const response = await fetch(url);
    const data = await response.json();

    if (data.results.length > 0) {
      const location = data.results[0].geometry.location;
      return { lat: location.lat, lng: location.lng };
    } else {
      console.error("Geocoding error: No results found");
      return { lat: 19.076, lng: 72.8777 }; // Default fallback
    }
  };