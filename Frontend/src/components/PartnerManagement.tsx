// src/components/PartnerManagement.tsx
import { useState, useEffect } from 'react';
import axios from 'axios';
import { DeliveryPartner } from '../types/partner';
import { host } from '../apiRoutes';
import PartnerForm from './partnerForm';

const PartnerManagement = () => {
  const [partners, setPartners] = useState<DeliveryPartner[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [formOpen,setFormOpen] = useState<boolean>(false)
  // Fetch partners from API
  const fetchPartners = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${host}/api/partners`);
      setPartners(response.data.partners);
    } catch (error) {
      console.error('Error fetching partners:', error);
    } finally {
      setLoading(false);
    }
  };

  // Delete partner
  const deletePartner = async (id: string) => {
    try {
      await axios.delete(`${host}/api/partners/${id}`);
      setPartners(partners.filter((partner) => partner._id !== id));
    } catch (error) {
      console.error('Error deleting partner:', error);
    }
  };

  // Add a new partner
  const addPartner = async (partner: DeliveryPartner) => {
    try {
      console.log('Sending api req');     
      const response = await axios.post(`${host}/api/partners`, partner);
      console.log(response);
      if(partners.length)      
      setPartners([...partners, response.data.partner]);
      setFormOpen(false)
    } catch (error) {
      console.error('Error adding partner:', error);
    }
  };

  useEffect(() => {
    fetchPartners();
  }, []);

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
        {partners.length && partners.map((partner) => (
          <div key={partner._id} className="border p-4 rounded-md">
            <h3 className="font-semibold">{partner.name}</h3>
            <p>Email: {partner.email}</p>
            <p>Status: {partner.status}</p>
            {partner.shift && <p>Shift: {partner.shift.start} - {partner.shift.end}</p>}
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