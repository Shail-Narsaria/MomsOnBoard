# MomsOnBoard - Pregnancy Journey Tracking Platform

MomsOnBoard is a comprehensive web application designed to help pregnant women track their pregnancy journey, document their experiences, and maintain important health information. The platform provides a user-friendly interface for managing appointments, recording health metrics, and maintaining a digital pregnancy journal.

## Features

- **User Authentication**: Secure registration and login system
- **Dashboard**: Overview of pregnancy progress and important dates
- **Health Metrics Tracking**: Record and monitor vital signs, weight, blood pressure, and other health indicators
- **Digital Journal**: Document pregnancy experiences, symptoms, and memories with photo uploads
- **Appointment Management**: Schedule and track medical appointments
- **Responsive Design**: Works seamlessly on desktop, tablet, and mobile devices

## Technology Stack

### Frontend
- React.js
- Material-UI (MUI)
- Redux Toolkit for state management
- React Router for navigation
- Axios for API communication

### Backend
- Node.js
- Express.js
- MongoDB with Mongoose
- JWT for authentication
- Multer for file uploads
- Express-validator for input validation

## Installation

### Prerequisites
- Node.js (v14 or higher)
- MongoDB
- npm or yarn

### Setup Instructions

1. Clone the repository:
```bash
git clone https://github.com/yourusername/momsonboard.git
cd momsonboard
```

2. Install dependencies for both frontend and backend:
```bash
# Install backend dependencies
cd backend
npm install

# Install frontend dependencies
cd ../frontend
npm install
```

3. Set up environment variables:
   - Create a `.env` file in the backend directory
   - Add the following variables:
   ```
   MONGODB_URI=your_mongodb_connection_string
   JWT_SECRET=your_jwt_secret_key
   PORT=5000
   ```

4. Start the development servers:
```bash
# Start backend server (from backend directory)
npm run dev

# Start frontend server (from frontend directory, in a new terminal)
npm start
```

The application will be available at:
- Frontend: http://localhost:3000
- Backend API: http://localhost:5000

## Project Structure

```
momsonboard/
├── backend/
│   ├── models/          # MongoDB schemas
│   ├── routes/          # API endpoints
│   ├── middleware/      # Authentication middleware
│   ├── uploads/         # File upload directory
│   └── server.js        # Main server file
├── frontend/
│   ├── src/
│   │   ├── components/  # Reusable UI components
│   │   ├── pages/       # Page components
│   │   ├── redux/       # State management
│   │   └── utils/       # Utility functions
│   └── public/          # Static assets
└── README.md
```

## API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `GET /api/auth/me` - Get current user

### Health Metrics
- `GET /api/health-metrics` - Get user's health metrics
- `POST /api/health-metrics` - Create new health metric
- `PUT /api/health-metrics/:id` - Update health metric
- `DELETE /api/health-metrics/:id` - Delete health metric

### Journal
- `GET /api/journal` - Get user's journal entries
- `POST /api/journal` - Create new journal entry
- `PUT /api/journal/:id` - Update journal entry
- `DELETE /api/journal/:id` - Delete journal entry

### Appointments
- `GET /api/appointments` - Get user's appointments
- `POST /api/appointments` - Create new appointment
- `PUT /api/appointments/:id` - Update appointment
- `DELETE /api/appointments/:id` - Delete appointment

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Support

For support, please email support@momsonboard.com or create an issue in the GitHub repository. 