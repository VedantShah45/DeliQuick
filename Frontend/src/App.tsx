import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import PartnerManagement from './components/PartnerManagement';
import Orders from './pages/Orders';
import Sidebar from './components/Sidebar';
import Assignments from './pages/Assignments';
import Home from './pages/Home';
import Navbar from './components/Navbar';


export default function App() {
  return (
    <Router>
      <div>
        <Navbar />
      </div>
      <div className='mt-2'>
        <div className='h-screen fixed left-0 w-[150px] '>
          <Sidebar />
        </div>
        <div className='ml-[155px]'>
          <Routes>
            <Route path="/" element={<PartnerManagement/>} />
            <Route path="/orders" element={<Orders/>} />
            <Route path="/assignments" element={<Assignments/>} />
            <Route path="/partners" element={<Home/>} />
          </Routes>
        </div>
      </div>
    </Router>
  )
}
