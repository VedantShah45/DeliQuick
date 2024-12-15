import { Link } from 'react-router-dom';

export default function Navbar() {
  return (
    <div className="bg-white shadow-md fixed top-0 w-full overflow-x-auto px-2">
      <nav className="flex justify-start items-center p-4 max-w-screen-xl">
        {/* Logo Section */}
        <div className="text-xl font-semibold text-gray-800 mr-4">
          DeliQuick
        </div>

        {/* Navigation Links */}
        <div className="space-x-4 flex items-center">
          <Link to="/" className="text-gray-700 hover:text-gray-900 transition-colors">Home</Link>
          <Link to="/orders" className="text-gray-700 hover:text-gray-900 transition-colors">Orders</Link>
          <Link to="/assignments" className="text-gray-700 hover:text-gray-900 transition-colors">Assignments</Link>
          <Link to="/partners" className="text-gray-700 hover:text-gray-900 transition-colors">Partners</Link>
        </div>

        {/* Profile Icon or Actions */}
        <div className="flex items-center space-x-4">
          <button className="text-gray-700 hover:text-gray-900 focus:outline-none">
            <i className="fas fa-user-circle"></i> {/* Add icon for profile */}
          </button>
          <button className="text-gray-700 hover:text-gray-900 focus:outline-none">
            <i className="fas fa-sign-out-alt"></i> {/* Add icon for logout */}
          </button>
        </div>
      </nav>
    </div>
  );
}
