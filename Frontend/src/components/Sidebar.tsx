import { useNavigate } from 'react-router-dom';

export default function Sidebar() {
  const navigation=useNavigate()
  return (
    <div className="h-screen hidden  bg-gray-100 shadow-lg sm:flex flex-col p-4">
      <h1 className="text-xl font-bold mb-6 text-gray-800">Menu</h1>
      <button onClick={()=>navigation('/')}  className="mb-4 px-4 py-2 text-white bg-blue-500 rounded hover:bg-blue-600 transition">
        Home
      </button>
      <button onClick={()=>navigation('/partners')}  className="mb-4 px-4 py-2 text-white bg-blue-500 rounded hover:bg-blue-600 transition">
        Partners
      </button>
      <button onClick={()=>navigation('/orders')} className="mb-4 px-4 py-2 text-white bg-blue-500 rounded hover:bg-blue-600 transition">
        Orders
      </button>
      <button onClick={()=>navigation('/assignments')} className="px-4 py-2 text-white bg-blue-500 rounded hover:bg-blue-600 transition">
        Assignments
      </button>
    </div>
  );
}
