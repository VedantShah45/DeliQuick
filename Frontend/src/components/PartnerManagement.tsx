// src/components/PartnerManagement.tsx
import { useState, useEffect } from 'react';
import axios from 'axios';
import { DeliveryPartner } from '../types/partner';
import { host } from '../apiRoutes';
import PartnerForm from './partnerForm';
import { usePartnerStore } from '../store/partnerStore';
import { useOrderStore } from '../store/orderStore';
import { useAssignmentStore } from '../store/assignmentStore';

const PartnerManagement = () => {
  // const [partners, setPartners] = useState<DeliveryPartner[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [formOpen,setFormOpen] = useState<boolean>(false)
  const {setDeliveryPartners,deliveryPartners}=usePartnerStore();
  const {setOrders}=useOrderStore();
  const {setAssignments}=useAssignmentStore();
  // Fetch partners from API
  // const fetchPartners = async () => {
  //   setLoading(true);
  //   try {
  //     const response = await axios.get(`${host}/api/partners`);
  //     setPartners(response.data.partners);
  //     // console.log(response.data.partners);      
  //     setDeliveryPartners(response.data.partners)
  //   } catch (error) {
  //     console.log('Error fetching partners:', error);
  //   } finally {
  //     setLoading(false);
  //   }
  // };

  // Delete partner
  const deletePartner = async (id: string) => {
    try {
      await axios.delete(`${host}/api/partners/${id}`);
      setDeliveryPartners(deliveryPartners.filter((partner) => partner._id !== id));
    } catch (error) {
      console.log('Error deleting partner:', error);
    }
  };

  // Add a new partner
  const addPartner = async (partner: DeliveryPartner) => {
    try {
      console.log('Sending api req');     
      const response = await axios.post(`${host}/api/partners`, partner);
      console.log(response);
      if(deliveryPartners.length)      
      setDeliveryPartners([...deliveryPartners, response.data.partner]);
      setFormOpen(false)
    } catch (error) {
      console.log('Error adding partner:', error);
    }
  };

  // const fetchOrders = async () => {
  //   try {
  //     const response = await axios.get(`${host}/api/orders`);
  //     console.log(response.data);
  //     setOrders(response.data.orders);
  //   } catch (error) {
  //     console.log(error);
  //   }
  // };

  // const fetchAssignments=async()=>{
  //   try {
  //     const response = await axios.get(`${host}/api/assignments`);
  //     console.log("Assignments ",response.data.assignments);
  //     setAssignments(response.data.assignments);
  //   } catch (error) {
  //     console.log(error);
  //   }
  // }

  // useEffect(() => {
  //   fetchPartners();
  //   fetchOrders();
  //   fetchAssignments();
  // }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="p-4">
      <h2 className="text-xl font-semibold mb-4">Partner Management</h2>
      <button
        className="mb-4 px-4 py-2 bg-blue-500 text-white"
        onClick={() =>
          setFormOpen(true)
        }
      >
        Add New Partner
      </button>
      {formOpen && 
      <PartnerForm onSubmit={addPartner} setFormOpen={setFormOpen} />}
      <div className="space-y-4">
        {deliveryPartners.length && deliveryPartners.map((partner) => (
          <div key={partner?._id} className="border p-4 rounded-md">
            <h3 className="font-semibold">{partner?.name}</h3>
            <p>Email: {partner?.email}</p>
            <p>Status: {partner?.status}</p>
            {partner?.shift && <p>Shift: {partner.shift.start} - {partner.shift.end}</p>}
            <button
              onClick={() => deletePartner(partner._id!)}
              className="mt-2 text-red-500"
            >
              Delete
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PartnerManagement;
