# DeliQuick - Delivery Fleet Management System

Welcome to **DeliQuick**, a robust and efficient **Delivery Fleet Management** system designed to streamline the process of assigning orders, tracking deliveries, and managing fleet partners. The system is built to offer smooth operations for delivery businesses by utilizing modern technologies for real-time tracking, optimized route assignments, and insightful partner metrics.

## Features

### 1. **Delivery Partner Management**
- **Partner Creation**: Easily create and manage delivery partners within the system.
- **Partner Metrics**: Display key metrics for each partner, such as their current load, rating, completed orders, and cancelled orders, to monitor performance effectively.
- **Shift Management**: Track the shift timings for each delivery partner to optimize assignments during working hours.

### 2. **Order Management**
- **Order Creation**: Create and manage orders, including customer details, items, and delivery information.
- **Order Assignment**: Automatically assign orders to the most suitable delivery partner based on their current load and area coverage.
- **Optimal Order Assignment**: Use Haversine Distance formula to calculate the optimal order assignment by finding the nearest partner based on coordinates.

### 3. **Order Tracking on Google Maps**
- **Real-time Tracking**: View the current location of delivery partners and track orders in real-time using Google Maps integration.
- **Marker and Polyline**: Visualize the journey between the order and partner locations with markers and polyline paths on the map.
- **Google Maps API Integration**: Utilizes Google Maps API to display interactive maps and track order deliveries effectively.

### 4. **Delivery Partner Metrics**
- Display comprehensive performance metrics for each partner, including:
  - **Rating**: Average customer rating for each partner.
  - **Completed Orders**: Number of successfully delivered orders.
  - **Cancelled Orders**: Number of cancelled orders, useful for partner performance evaluation.

## Tech Stack
- **Frontend**: React.js, TailwindCSS for styling
- **Backend**: Node.js, Express.js
- **Database**: MongoDB for storing partner and order data
- **API**: Google Maps API for real-time order tracking
- **Haversine Formula**: For calculating optimal distances between order and partner locations

## Installation

### 1. Clone the repository
```bash
git clone https://github.com/yourusername/deliquick.git
cd deliquick
```

### 2. Install dependencies

#### Backend
Go to the backend directory and install dependencies:
```bash
cd backend
npm install
```

#### Frontend
Go to the frontend directory and install dependencies:
```bash
cd frontend
npm install
```

### 3. Set up environment variables

Create a `.env` file in both the frontend and backend directories and add the required environment variables:

#### For Backend:
```env
MONGODB_URI=your_mongodb_connection_string
GOOGLE_API_KEY=your_google_maps_api_key
```

#### For Frontend:
```env
REACT_APP_GOOGLE_API_KEY=your_google_maps_api_key
```

### 4. Start the server

#### Backend:
```bash
cd backend
npm run dev
```

#### Frontend:
```bash
cd frontend
npm start
```

### 5. Open the app in your browser
Go to `http://localhost:3000` to view the app in action.

## Usage

- **Partner Creation**: Navigate to the "Partners" section to add new delivery partners. Assign relevant details such as name, phone number, areas of operation, and shift timings.
- **Order Management**: In the "Orders" section, create new orders by providing customer details, item list, and delivery information.
- **Order Assignment**: The system will automatically calculate the optimal delivery partner based on proximity using the Haversine Distance formula.
- **Order Tracking**: View real-time tracking of deliveries using the Google Maps integration. Track orders by selecting them from the list and visualizing the path on the map.

## Contributing

Contributions are welcome! To contribute, please follow these steps:

1. Fork the repository
2. Clone your fork
3. Create a new branch
4. Make your changes
5. Commit and push your changes
6. Create a pull request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

Feel free to modify the README as per your project’s specific details and requirements. Let me know if you need further enhancements or sections!
