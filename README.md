# Zoronal

A full-stack application for managing company reviews. This project consists of a Node.js/Express backend API and a React frontend with Vite.

## Project Structure

```
Zoronal/
├── backend/          # Node.js Express server
│   ├── models/      # Database models (Company, Review)
│   ├── routes/      # API routes
│   ├── server.js    # Server entry point
│   ├── seed.js      # Database seeding script
│   └── package.json
├── frontend/        # React + Vite application
│   ├── src/
│   │   ├── components/  # Reusable components
│   │   ├── pages/       # Page components
│   │   ├── App.jsx
│   │   └── main.jsx
│   └── package.json
└── package.json     # Root package.json
```

## Prerequisites

- Node.js (v14 or higher)
- npm or yarn

## Installation

### Backend Setup

1. Navigate to the backend directory:
```bash
cd backend
npm install
```

2. Create a `.env` file with necessary environment variables

3. Start the server:
```bash
npm start
```

The backend will run on `http://localhost:5000` (or your configured port)

### Frontend Setup

1. Navigate to the frontend directory:
```bash
cd frontend
npm install
```

2. Start the development server:
```bash
npm run dev
```

The frontend will be available at `http://localhost:5173` (default Vite port)

## Features

- **Company Management** - Add and view companies
- **Company Reviews** - Submit and view reviews for companies
- **Star Ratings** - Rate companies with star ratings
- **Authentication** - User authentication system
- **Responsive Design** - Mobile-friendly interface

## Available Scripts

### Backend

- `npm start` - Start the server
- `npm run seed` - Seed the database with initial data

### Frontend

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build

## API Endpoints

- `GET /api/companies` - Get all companies
- `POST /api/companies` - Create a new company
- `GET /api/companies/:id` - Get a specific company
- `GET /api/reviews` - Get all reviews
- `POST /api/reviews` - Create a new review

## Technologies Used

### Backend
- Express.js
- Node.js

### Frontend
- React
- Vite
- CSS

## Deployment

This project is ready for production deployment on:
- **Database**: MongoDB Atlas (Cloud MongoDB)
- **Backend**: Render (Node.js Server)
- **Frontend**: Vercel (React App)

### Quick Start Deployment

For complete step-by-step deployment instructions, see [DEPLOYMENT.md](DEPLOYMENT.md)

**Quick Summary:**
1. Set up MongoDB Atlas cluster
2. Deploy backend to Render
3. Deploy frontend to Vercel
4. Connect services with environment variables

See [DEPLOYMENT.md](DEPLOYMENT.md) for detailed instructions.

## Contributing

1. Create a feature branch
2. Make your changes
3. Submit a pull request

## License

This project is licensed under the MIT License.
