import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import PartnerManagement from './components/PartnerManagement';
import Orders from './pages/Orders';
import Sidebar from './components/Sidebar';


export default function App() {
  return (
    <Router>
      <div className='h-screen fixed left-0 w-[150px] '>
        <Sidebar />
      </div>
      <div className='ml-[155px]'>
        <Routes>
          <Route path="/" element={<PartnerManagement/>} />
          <Route path="/orders" element={<Orders/>} />
        </Routes>
      </div>
    </Router>
  )
}
