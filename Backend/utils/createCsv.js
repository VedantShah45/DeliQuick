import { PartnerModel } from '../models/partnerModel.js';
import { OrderModel } from '../models/orderModel.js';
import fs from 'fs';
import { createObjectCsvWriter } from 'csv-writer';
import path from 'path';

export async function generatePartnerOrderMetricsCSV(outputPath = 'partner_metrics_report.csv') {
  // 1. Fetch partners
  const partners = await PartnerModel.find({});

  // 2. Create array to hold rows
  const csvData = [];

  for (const partner of partners) {
    // 3. Get order counts for this partner
    const partnerId = partner._id;

    const totalOrders = await OrderModel.countDocuments({ assignedTo: partnerId });
    const deliveredOrders = await OrderModel.countDocuments({ assignedTo: partnerId, status: 'delivered' });
    const pendingOrders = await OrderModel.countDocuments({ assignedTo: partnerId, status: { $ne: 'delivered' } });

    // 4. Build row data
    csvData.push({
      PartnerName: partner.name,
      Email: partner.email,
      Phone: partner.phone,
      Status: partner.status,
      CurrentLoad: partner.currentLoad || 0,
      Rating: partner.metrixs?.rating || 0,
      CompletedOrders: partner.metrixs?.completedOrders || 0,
      CancelledOrders: partner.metrixs?.cancelledOrders || 0,
      AssignedOrders: totalOrders,
      DeliveredOrders: deliveredOrders,
      PendingOrders: pendingOrders,
      ShiftStart: partner.shift?.start || '',
      ShiftEnd: partner.shift?.end || '',
      Areas: partner.areas.join(', ')
    });
  }

  // 5. Write to CSV
  const csvWriter = createObjectCsvWriter({
    path: outputPath,
    header: [
      { id: 'PartnerName', title: 'Partner Name' },
      { id: 'Email', title: 'Email' },
      { id: 'Phone', title: 'Phone' },
      { id: 'Status', title: 'Status' },
      { id: 'CurrentLoad', title: 'Current Load' },
      { id: 'Rating', title: 'Rating' },
      { id: 'CompletedOrders', title: 'Completed Orders' },
      { id: 'CancelledOrders', title: 'Cancelled Orders' },
      { id: 'AssignedOrders', title: 'Assigned Orders' },
      { id: 'DeliveredOrders', title: 'Delivered Orders' },
      { id: 'PendingOrders', title: 'Pending Orders' },
      { id: 'ShiftStart', title: 'Shift Start' },
      { id: 'ShiftEnd', title: 'Shift End' },
      { id: 'Areas', title: 'Areas' }
    ]
  });

  await csvWriter.writeRecords(csvData);
  return path.resolve(outputPath);
}
