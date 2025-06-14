# MotherTrack - Pregnancy Journey Tracking Platform

MotherTrack is a comprehensive web application designed to help pregnant women track their pregnancy journey, document their experiences, and maintain important health information. The platform provides a user-friendly interface for journaling, photo uploads, and health metric tracking.

## Features

- **User Authentication**: Secure registration and login system
- **Pregnancy Journey Tracking**: Document your pregnancy journey week by week
- **Journal Entries**: Create detailed entries with photos, moods, and symptoms
- **Health Metrics**: Track important health data like weight, blood pressure, and more
- **Baby Movement Tracking**: Monitor baby movements and kicks
- **Photo Gallery**: Upload and organize pregnancy photos
- **Medical Information**: Store important medical history and healthcare provider details
- **Emergency Contacts**: Keep emergency contact information readily available

## Tech Stack

### Backend
- Node.js
- Express.js
- MongoDB
- JWT Authentication
- Cloudinary (for image storage)

### Frontend
- React.js
- Material-UI
- Redux Toolkit
- Formik & Yup
- React Router
- Axios

## Prerequisites

- Node.js (v14 or higher)
- MongoDB
- npm or yarn
- Cloudinary account

## Installation

1. Clone the repository
```bash
git clone https://github.com/yourusername/mothertrack.git
cd mothertrack
```

2. Install backend dependencies
```bash
cd backend
npm install
```

3. Create a .env file in the backend directory with the following variables:
```
MONGODB_URI=your_mongodb_uri
JWT_SECRET=your_jwt_secret
PORT=5000
CLOUDINARY_CLOUD_NAME=your_cloudinary_name
CLOUDINARY_API_KEY=your_cloudinary_key
CLOUDINARY_API_SECRET=your_cloudinary_secret
```

4. Install frontend dependencies
```bash
cd ../frontend
npm install
```

5. Create a .env file in the frontend directory:
```
REACT_APP_API_URL=http://localhost:5000
```

## Running the Application

1. Start the backend server
```bash
cd backend
npm run dev
```

2. Start the frontend development server
```bash
cd frontend
npm start
```

The application will be available at `http://localhost:3000`

## Project Structure

```
mothertrack/
├── backend/
│   ├── models/
│   │   ├── User.js
│   │   └── Journal.js
│   ├── routes/
│   │   ├── auth.js
│   │   └── journal.js
│   ├── middleware/
│   │   └── auth.js
│   ├── package.json
│   └── server.js
└── frontend/
    ├── public/
    ├── src/
    │   ├── components/
    │   ├── pages/
    │   ├── store/
    │   │   └── slices/
    │   ├── App.js
    │   └── index.js
    └── package.json
```

## API Endpoints

### Authentication
- POST `/api/auth/register` - Register a new user
- POST `/api/auth/login` - User login
- GET `/api/auth/user` - Get user profile

### Journal Entries
- GET `/api/journal` - Get all journal entries
- GET `/api/journal/:id` - Get specific journal entry
- POST `/api/journal` - Create new journal entry
- PUT `/api/journal/:id` - Update journal entry
- DELETE `/api/journal/:id` - Delete journal entry

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the MIT License.

## Support

For support, please email support@mothertrack.com or create an issue in the GitHub repository. 