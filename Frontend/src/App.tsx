import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import PartnerManagement from './components/PartnerManagement';
import Orders from './pages/Orders';
import Sidebar from './components/Sidebar';
import Assignments from './pages/Assignments';
import Home from './pages/Home';
import Navbar from './components/Navbar';
import { LoadScript } from '@react-google-maps/api';

const Google_Key = import.meta.env.VITE_GOOGLE_API_KEY;

export default function App() {
  return (
    <Router>
      <LoadScript googleMapsApiKey={Google_Key}>
      <div>
        <Navbar />
      </div>
      <div className='mt-16 w-full'>
        <div className='h-screen fixed left-0 w-[150px] '>
          <Sidebar />
        </div>
        <div className='ml-[155px] h-full'>
          <Routes>
            <Route path="/" element={<Home/>} />
            <Route path="/orders" element={<Orders/>} />
            <Route path="/assignments" element={<Assignments/>} />
            <Route path="/partners" element={<PartnerManagement/>} />
          </Routes>
        </div>
      </div>
      </LoadScript>
    </Router>
  )
}
