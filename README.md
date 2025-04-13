
# ARUL JAYAM MACHINERY

An agriculture-based e-commerce web application for selling farm machinery and equipment.

## Project Structure

The project is divided into two main parts:

- **Frontend**: React application using TypeScript, React Router, and Tailwind CSS
- **Backend**: Node.js Express server with MongoDB database

## Features

### User Side
- User authentication (signup, login)
- Product browsing with search and filter options
- Product details view
- Cart management
- Checkout process
- Order history
- User profile management

### Admin Side
- Admin dashboard
- Product management (add, update)
- Order management
- Inventory management

## Technologies Used

### Frontend
- React
- TypeScript
- React Router for navigation
- Tailwind CSS for styling
- shadcn/ui for UI components
- Context API for state management
- React Query for API data fetching

### Backend
- Node.js
- Express.js
- MongoDB
- Mongoose for database modeling
- JWT for authentication
- bcrypt.js for password hashing

## Getting Started

### Prerequisites
- Node.js and npm installed
- MongoDB instance (using MongoDB Atlas)

### Running the Frontend

```sh
# Navigate to the frontend directory
cd arul-jayam-machinery

# Install dependencies
npm install

# Start the development server
npm run dev
```

### Running the Backend

```sh
# Navigate to the backend directory
cd backend

# Install dependencies
npm install

# Start the development server
npm run dev
```

## API Endpoints

### Products
- `GET /api/products` - Get all products
- `GET /api/products/:id` - Get single product
- `POST /api/products` - Create a product (admin only)
- `PUT /api/products/:id` - Update a product (admin only)
- `DELETE /api/products/:id` - Delete a product (admin only)

### Users
- `POST /api/users/register` - Register a new user
- `POST /api/users/login` - Login user
- `GET /api/users/profile` - Get user profile
- `PUT /api/users/profile` - Update user profile
- `GET /api/users` - Get all users (admin only)

### Orders
- `POST /api/orders` - Create a new order
- `GET /api/orders/myorders` - Get user's orders
- `GET /api/orders` - Get all orders (admin only)
- `GET /api/orders/:id` - Get order by ID
- `PUT /api/orders/:id/status` - Update order status (admin only)

## Admin Access

- Email: admin@gmail.com
- Password: admin@123

## Database Schema

### Users Collection
- username
- email
- password (hashed)
- address
- phone
- isAdmin
- profilePicture

### Products Collection
- name
- price
- description
- image
- images (array)
- category
- colors (array)
- specifications (array)
- stock
- rating

### Orders Collection
- user (reference to User)
- products (array of product references with quantity and color)
- shippingAddress
- paymentMethod
- totalAmount
- status
- orderId

## License
All Rights Reserved
