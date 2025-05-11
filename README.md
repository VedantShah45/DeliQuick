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
- **Frontend**: React.js, Zustand, TailwindCSS 
- **Backend**: Node.js, Express.js
- **Database**: MongoDB 
- **API**: Google Maps API for real-time order tracking, Google Geocoding API for coordinate generation 
- **Haversine Formula**: For calculating optimal distances between order and partner locations

## Docker & Nginx Integration

### 1. **Dockerization**
The entire application (frontend, backend, and database) is containerized using Docker for simplified deployment.

#### To build and run containers:
```bash
docker-compose up --build
version: '3.8'

services:
  frontend:
    build:
      context: ./Frontend  # Path to your frontend directory
    ports:
      - "5173:5173"  # Expose the frontend on port 5173
    volumes:
      - ./frontend:/app 
    environment:
      - VITE_GOOGLE_API_KEY= #Your API key from the google cloud console
    networks:
      - app-network
    depends_on:
      - nginx  # Ensure nginx is started before the frontend

  backend:
    build:
      context: ./backend  # Path to your backend directory
    ports:
      - "3000:3000"  # Expose backend on port 3000
      - "3001:3001"  # Expose additional backend instances if required
      - "3002:3002"
    volumes:
      - ./backend:/app  # Volume to mount the backend directory into the container
    networks:
      - app-network
    environment:
      - MONGO_URI=# Your mongo uri

  nginx:
    image: nginx:latest
    container_name: nginx-container
    build:
      context: .  # This assumes the nginx.conf is at the root of the project
      dockerfile: Dockerfile  # Ensure you have a Dockerfile for nginx setup
    volumes:
      - ./nginx.conf:/etc/nginx/nginx.conf  # Mount the NGINX configuration file
    ports:
      - "8080:80"  # Expose NGINX on port 8080
    networks:
      - app-network
    depends_on:
      - backend

networks:
  app-network:
    driver: bridge

