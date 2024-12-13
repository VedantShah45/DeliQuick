import React, { useEffect, useState } from 'react';
import { assignDeliveryPartnerToOrder, getLatLngFromAddress } from '../Helper/partnerAssignment';
import axios from 'axios';
import { host } from '../apiRoutes';
import { usePartnerStore } from '../store/partnerStore';
import { ToastContainer, toast } from 'react-toastify';

export type Order = {
  _id: string;
  orderNumber: string;
  customer: {
    name: string;
    phone: string;
    address: string;
  };
  area: string;
  items: { name: string; quantity: number; price: number }[];
  status: 'pending' | 'assigned' | 'picked' | 'delivered';
  scheduledFor: string; // HH:mm
  assignedTo?: string; // partner
  totalAmount: number;
  createdAt: Date;
  updatedAt: Date;
};

const AddOrderForm = () => {
  const {deliveryPartners,setDeliveryPartners}=usePartnerStore();  
  const [showModal, setShowModal] = useState(false);
  const [partnerDetails, setPartnerDetails] = useState<any>(null);
  const [partnerCoords,setPartnerCoords]=useState<Record<string, { lat: number; lng: number }>>();

  // Mock Delivery Partner Data with string addresses
//   const deliveryPartners = [
//     { id: "partner_1", name: "Partner 1", address: "Mulund East, Mumbai, Maharashtra", currentLoad: 0 },
//     { id: "partner_2", name: "Partner 2", address: "Thane East, Mumbai, Maharashtra", currentLoad: 0 },
//     { id: "partner_3", name: "Partner 3", address: "Colaba, Mumbai, Maharashtra", currentLoad: 0 },
//   ];

  // Mock order coordinates (This would typically come from the form)
  const orderCoords = { lat: 19.2403, lng: 73.1305 }; // Example coordinates for the order

  // Mock positions of partners
  // const partnerPositions = {
  //   partner_1: { lat: 19.1070, lng: 72.8877 },
  //   partner_2: { lat: 19.1260, lng: 72.8760 },
  //   partner_3: { lat: 19.0500, lng: 72.8500 },
  // };


  const [order, setOrder] = useState<Order>({
    _id: '',
    orderNumber: '',
    customer: { name: '', phone: '', address: '' },
    area: '',
    items: [{ name: '', quantity: 0, price: 0 }],
    status: 'pending',
    scheduledFor: '',
    totalAmount: 0,
    createdAt: new Date(),
    updatedAt: new Date(),
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value, type } = e.target;

    if (type === 'text' || type === 'number') {
      if (name === 'name' || name === 'phone' || name === 'address') {
        setOrder((prevOrder) => ({
          ...prevOrder,
          customer: { ...prevOrder.customer, [name]: value },
        }));
      } else if (
        name === 'area' ||
        name === 'orderNumber' ||
        name == 'scheduledFor' ||
        name === 'assignedTo' ||
        name === 'totalAmount'
      ) {
        setOrder((prevOrder) => ({
          ...prevOrder,
          [name]: value,
        }));
      }
    } else if (type === 'select-one') {
      setOrder((prevOrder) => ({
        ...prevOrder,
        [name]: value,
      }));
    }
  };

  const handleItemChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    index: number,
    field: 'name' | 'quantity' | 'price'
  ) => {
    const newItems = [...order.items];
    newItems[index] = { ...newItems[index], [field]: e.target.value };
    setOrder((prevOrder) => ({
      ...prevOrder,
      items: newItems,
    }));
  };

  const handleAddItem = () => {
    setOrder((prevOrder) => ({
      ...prevOrder,
      items: [...prevOrder.items, { name: '', quantity: 0, price: 0 }],
    }));
  };

  const handleRemoveItem = (index: number) => {
    const newItems = order.items.filter((_, i) => i !== index);
    setOrder((prevOrder) => ({
      ...prevOrder,
      items: newItems,
    }));
  };

  const handleSubmit = async(e: React.FormEvent) => {
    e.preventDefault();  
    // Calculate the best partner for the order
    const result = assignDeliveryPartnerToOrder(orderCoords, partnerCoords!, deliveryPartners);
    if (result.partnerId) {    
      setPartnerDetails({...result});
      setShowModal(true); // Show the modal with the partner details
    }
    order.assignedTo=result.partnerId!

    try {
      const response = await axios.post(`${host}/api/orders/assign`, order);
      console.log(response.data);      
      const assignment={
        partnerId: result.partnerId,
        orderId:response.data.order._id,
      }
      const posted= await axios.post(`${host}/api/assignments/run`,assignment)
      if(!posted){
        console.log("Assignment Not Posted");        
      }
      else console.log("Assignment Created ",posted.data)
      let idx;
      console.log(response.data);
      if (response.data) {
        try {
          // Find the partner and its index
          const delPartner = deliveryPartners.find((partner, index) => {
            if (partner._id === result.partnerId) {
              idx = index;
              return true;
            }
            return false;
          });
    
          if (delPartner) {
            // Increment the currentLoad attribute of the partner
            const updatedPartners = [...deliveryPartners];
            updatedPartners[idx!] = {
              ...delPartner,
              currentLoad: delPartner.currentLoad + 1,
            };
    
            // Update Zustand state
            setDeliveryPartners(updatedPartners);
    
            // Update the partner in the backend
            const patchResponse = await axios.patch(
              `${host}/api/partners/${result.partnerId}`,
              {
                currentLoad: updatedPartners[idx!].currentLoad,
              }
            );
            console.log("Partner Edited: ", patchResponse.data);
          } else {
            console.log("Delivery partner not found");
          }
        } catch (error) {
          console.log(response.data.message + "");
        }
      }
    } catch (error) {
      console.log(error);
    }
  }
    

  useEffect(()=>{
    const assignPartnerCoords=async()=>{
      const partnerCoordsObj: Record<string, { lat: number; lng: number }> = {};     
      for(const partner of deliveryPartners){
        const {lat,lng}=await getLatLngFromAddress(partner.areas[0]);
        partnerCoordsObj[partner._id!]={lat,lng};
      }
      setPartnerCoords(partnerCoordsObj)    
    }
    assignPartnerCoords();
  },[deliveryPartners])

  return (
    <div>
    <ToastContainer />
    <form onSubmit={handleSubmit} className='mb-4'>
      <div className="mb-4">
        <label
          htmlFor="orderNumber"
          className="block text-gray-600 mb-2 font-medium"
        >
          Order Number
        </label>
        <input
          type="text"
          id="orderNumber"
          name="orderNumber"
          value={order.orderNumber}
          onChange={handleChange}
          className="w-full border border-gray-300 rounded px-3 py-2"
          required
        />
      </div>

      <div className="mb-4">
        <label
          htmlFor="name"
          className="block text-gray-600 mb-2 font-medium"
        >
          Customer Name
        </label>
        <input
          type="text"
          id="name"
          name="name"
          value={order.customer.name}
          onChange={handleChange}
          className="w-full border border-gray-300 rounded px-3 py-2"
          required
        />
      </div>

      <div className="mb-4">
        <label
          htmlFor="phone"
          className="block text-gray-600 mb-2 font-medium"
        >
          Customer Phone
        </label>
        <input
          type="text"
          id="phone"
          name="phone"
          value={order.customer.phone}
          onChange={handleChange}
          className="w-full border border-gray-300 rounded px-3 py-2"
          required
        />
      </div>

      <div className="mb-4">
        <label
          htmlFor="address"
          className="block text-gray-600 mb-2 font-medium"
        >
          Customer Address
        </label>
        <input
          type="text"
          id="address"
          name="address"
          value={order.customer.address}
          onChange={handleChange}
          className="w-full border border-gray-300 rounded px-3 py-2"
          required
        />
      </div>

      <div className="mb-4">
        <label htmlFor="area" className="block text-gray-600 mb-2 font-medium">
          Area
        </label>
        <input
          type="text"
          id="area"
          name="area"
          value={order.area}
          onChange={handleChange}
          className="w-full border border-gray-300 rounded px-3 py-2"
          required
        />
      </div>

      {/* Items */}
      <div className="mb-4">
        <label htmlFor="items" className="block text-gray-600 mb-2 font-medium">
          Items
        </label>
        {order.items.map((item, index) => (
          <div key={index} className="flex space-x-4 mb-2">
            <input
              type="text"
              placeholder="Item Name"
              value={item.name}
              onChange={(e) => handleItemChange(e, index, 'name')}
              className="w-1/3 border border-gray-300 rounded px-3 py-2"
              required
            />
            <input
              type="number"
              placeholder="Quantity"
              value={item.quantity}
              onChange={(e) => handleItemChange(e, index, 'quantity')}
              className="w-1/3 border border-gray-300 rounded px-3 py-2"
              required
            />
            <input
              type="number"
              placeholder="Price"
              value={item.price}
              onChange={(e) => handleItemChange(e, index, 'price')}
              className="w-1/3 border border-gray-300 rounded px-3 py-2"
              required
            />
            <button
              type="button"
              onClick={() => handleRemoveItem(index)}
              className="ml-2 px-2 py-1 bg-red-500 text-white rounded hover:bg-red-700"
            >
              Remove
            </button>
          </div>
        ))}
        <button
          type="button"
          onClick={handleAddItem}
          className="px-4 py-2 mt-2 bg-green-500 text-white rounded hover:bg-green-700"
        >
          + Add Item
        </button>
      </div>

      <div className="mb-4">
        <label htmlFor="status" className="block text-gray-600 mb-2 font-medium">
          Status
        </label>
        <select
          id="status"
          name="status"
          value={order.status}
          onChange={handleChange}
          className="w-full border border-gray-300 rounded px-3 py-2"
          required
        >
          <option value="pending">Pending</option>
          <option value="assigned">Assigned</option>
          <option value="picked">Picked</option>
          <option value="delivered">Delivered</option>
        </select>
      </div>

      <div className="mb-4">
        <label
          htmlFor="scheduledFor"
          className="block text-gray-600 mb-2 font-medium"
        >
          Scheduled For (HH:mm)
        </label>
        <input
          type="text"
          id="scheduledFor"
          name="scheduledFor"
          value={order.scheduledFor}
          onChange={handleChange}
          className="w-full border border-gray-300 rounded px-3 py-2"
          required
        />
      </div>

      {/* <div className="mb-4">
        <label
          htmlFor="assignedTo"
          className="block text-gray-600 mb-2 font-medium"
        >
          Assigned To (Partner)
        </label>
        <input
          type="text"
          id="assignedTo"
          name="assignedTo"
          value={order.assignedTo || ''}
          onChange={handleChange}
          className="w-full border border-gray-300 rounded px-3 py-2"
        />
      </div> */}

      <div className="mb-4">
        <label
          htmlFor="totalAmount"
          className="block text-gray-600 mb-2 font-medium"
        >
          Total Amount
        </label>
        <input
          type="number"
          id="totalAmount"
          name="totalAmount"
          value={order.totalAmount}
          onChange={handleChange}
          className="w-full border border-gray-300 rounded px-3 py-2"
          required
        />
      </div>

      <div className="mb-4">
        <button
          type="submit"
          className="w-full py-2 px-4 bg-blue-500 text-white rounded hover:bg-blue-700"
        >
          Submit Order
        </button>

        {showModal && partnerDetails && (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex justify-center items-center z-50">
            <div className="bg-white rounded-lg shadow-lg p-6 max-w-sm w-full">
            <h2 className="text-xl font-semibold text-center mb-4">Optimal Delivery Partner</h2>
            <p className="mb-2"><strong>Name:</strong> {partnerDetails.partnerName}</p>
            <p className="mb-2"><strong>Address:</strong> {partnerDetails.address}</p>
            <p className='mb-4'><strong>Check The Map!</strong></p>
            <div className="text-center">
                <button 
                onClick={() => setShowModal(false)} 
                className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 focus:outline-none"
                >
                Close
                </button>
            </div>
            </div>
        </div>
        )}
      </div>
    </form>
    </div>
  );
};

export default AddOrderForm
