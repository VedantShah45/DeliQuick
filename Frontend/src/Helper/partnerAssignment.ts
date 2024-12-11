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

// Function to assign drivers to orders based on shortest distance
export const assignDriversToOrders = (
    positions: { [key: string]: { lat: number; lng: number } },
    partnerPositions: { [key: string]: { lat: number; lng: number } },
    deliveryPartners: { id: string; name: string; currentLoad: number; address: string }[]
  ): { orderId: string; partnerId: string }[] => {
    
    const assignments: { orderId: string; partnerId: string }[] = [];
  
    // Filter available drivers based on current load
    const availableDrivers = deliveryPartners.filter((partner) => partner.currentLoad < 3);
  
    for (const orderId in positions) {
      const orderCoords = positions[orderId];
      let bestDriverId: string | null = null;
      let minDistance = Infinity;
  
      // Find the closest available driver
      for (const driverId in partnerPositions) {
        const driverCoords = partnerPositions[driverId];
        const driver = availableDrivers.find((d) => d.id === driverId);
  
        if (driver && driver.currentLoad < 3) {
          const distance = haversineDistance(orderCoords, driverCoords);
          if (distance < minDistance) {
            minDistance = distance;
            bestDriverId = driverId;
          }
        }
      }
  
      // Assign the driver to the order if a suitable one is found
      if (bestDriverId) {
        assignments.push({ orderId, partnerId: bestDriverId });
  
        // Update the driver's current load
        const driver = availableDrivers.find((d) => d.id === bestDriverId);
        if (driver) {
          driver.currentLoad++;
        }
      }
    }
  
    return assignments;
  };
  