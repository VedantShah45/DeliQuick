import React, { useState } from 'react';
import { XMarkIcon } from '@heroicons/react/20/solid';

type PartnerFormProps = {
    setFormOpen: React.Dispatch<React.SetStateAction<boolean>>;
  onSubmit: (data: {
    name: string;
    email: string;
    phone: string;
    status: 'active' | 'inactive';
    currentLoad: number;
    areas: string[];
    shift: {
      start: string;
      end: string;
    };
    metrics: {
      rating: number;
      completedOrders: number;
      cancelledOrders: number;
    };
  }) => void;
};

const PartnerForm: React.FC<PartnerFormProps> = ({ onSubmit,setFormOpen}) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [status, setStatus] = useState<'active' | 'inactive'>('active');
  const [currentLoad, setCurrentLoad] = useState(0);
  const [areas, setAreas] = useState<string[]>([]);
  const [shiftStart, setShiftStart] = useState('');
  const [shiftEnd, setShiftEnd] = useState('');
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  // Validation function
  const validate = () => {
    const errors: { [key: string]: string } = {};
    if (!name) errors.name = 'Name is required';
    if (!email) errors.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(email)) errors.email = 'Email is not valid';
    if (!phone) errors.phone = 'Phone number is required';
    else if (!/^\d{10}$/.test(phone)) errors.phone = 'Phone number must be 10 digits';
    if (areas.length === 0) errors.areas = 'At least one area must be selected';
    if (!shiftStart || !shiftEnd) errors.shift = 'Shift start and end times are required';
    if (isNaN(currentLoad) || currentLoad < 0) errors.currentLoad = 'Current load must be a valid number';
    setErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validate()) {
      try {
        onSubmit({
          name,
          email,
          phone,
          status,
          currentLoad,
          areas,
          shift: {
            start: shiftStart,
            end: shiftEnd,
          },
          metrics: {
            rating: 0,  // Default value for rating
            completedOrders: 0,  // Default value for completed orders
            cancelledOrders: 0,  // Default value for cancelled orders
          },
        });
        setName('');
        setEmail('');
        setPhone('');
        setShiftStart('');
        setShiftEnd('');
        setAreas([]);
        setCurrentLoad(0);
        setStatus('active');
      } catch (error) {
        alert('Error submitting form');
      }
    }
  };

  // const handleAreaChange = (e: React.ChangeEvent<HTMLInputElement>) => {
  //   const area = e.target.value;
  //   setAreas((prevAreas) =>
  //     prevAreas.includes(area) ? prevAreas.filter((a) => a !== area) : [...prevAreas, area]
  //   );
  // };

  return (
    <div className="relative w-full max-w-lg mx-auto p-4 bg-white rounded-md">
    <form onSubmit={handleSubmit} className="w-full max-w-lg mx-auto mb-5 p-4 bg-white shadow-md rounded-md">
      <button
        type="button"
        onClick={() => setFormOpen(false)}
        className="absolute top-4 right-4 text-gray-500 hover:text-gray-800"
      >
        <XMarkIcon className="h-6 w-6" />
      </button>
      <div className="mb-4">
        <label htmlFor="name" className="block text-sm font-medium text-gray-700">Name</label>
        <input
          id="name"
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full p-2 border rounded-md"
        />
        {errors.name && <span className="text-red-500 text-sm">{errors.name}</span>}
      </div>

      <div className="mb-4">
        <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email</label>
        <input
          id="email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full p-2 border rounded-md"
        />
        {errors.email && <span className="text-red-500 text-sm">{errors.email}</span>}
      </div>

      <div className="mb-4">
        <label htmlFor="phone" className="block text-sm font-medium text-gray-700">Phone</label>
        <input
          id="phone"
          type="text"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          className="w-full p-2 border rounded-md"
        />
        {errors.phone && <span className="text-red-500 text-sm">{errors.phone}</span>}
      </div>

      <div className="mb-4">
        <label htmlFor="status" className="block text-sm font-medium text-gray-700">Status</label>
        <select
          id="status"
          value={status}
          onChange={(e) => setStatus(e.target.value as 'active' | 'inactive')}
          className="w-full p-2 border rounded-md"
        >
          <option value="active">Active</option>
          <option value="inactive">Inactive</option>
        </select>
      </div>

      <div className="mb-4">
        <label htmlFor="currentLoad" className="block text-sm font-medium text-gray-700">Current Load</label>
        <input
          id="currentLoad"
          type="number"
          value={currentLoad}
          onChange={(e) => setCurrentLoad(Number(e.target.value))}
          className="w-full p-2 border rounded-md"
        />
        {errors.currentLoad && <span className="text-red-500 text-sm">{errors.currentLoad}</span>}
      </div>

      <div className="mb-4">
        <label htmlFor="areas" className="block text-sm font-medium text-gray-700">Areas</label>
        <input
          id="areas"
          type="text"
          value={areas.join(', ')}
          onChange={(e) => setAreas(e.target.value.split(',').map(a => a.trim()))}
          className="w-full p-2 border rounded-md"
        />
        {errors.areas && <span className="text-red-500 text-sm">{errors.areas}</span>}
      </div>

      <div className="mb-4">
        <label htmlFor="shiftStart" className="block text-sm font-medium text-gray-700">Shift Start</label>
        <input
          id="shiftStart"
          type="time"
          value={shiftStart}
          onChange={(e) => setShiftStart(e.target.value)}
          className="w-full p-2 border rounded-md"
        />
        {errors.shift && <span className="text-red-500 text-sm">{errors.shift}</span>}
      </div>

      <div className="mb-4">
        <label htmlFor="shiftEnd" className="block text-sm font-medium text-gray-700">Shift End</label>
        <input
          id="shiftEnd"
          type="time"
          value={shiftEnd}
          onChange={(e) => setShiftEnd(e.target.value)}
          className="w-full p-2 border rounded-md"
        />
      </div>

      <div className="mb-4">
        <button type="submit" className="w-full p-2 bg-blue-500 text-white rounded-md">Submit</button>
      </div>
    </form>
    </div>
  );
};

export default PartnerForm;
