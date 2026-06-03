# Job Finder Frontend

A modern React application for job searching and posting with user authentication and role-based features.

## Features

- **User Authentication**: JWT-based login and registration
- **Role-based Access**: Different features for job seekers and companies
- **Job Management**: Browse, search, and filter jobs
- **Application System**: Apply for jobs and track application status
- **Company Features**: Post jobs, manage applications, toggle between user/company modes
- **Responsive Design**: Mobile-friendly interface with Tailwind CSS

## Getting Started

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn

### Installation

1. Install dependencies:
```bash
npm install
```

2. Start the development server:
```bash
npm start
```

The application will open at `http://localhost:3000`.

### Backend Integration

Make sure your Spring Boot backend is running on `http://localhost:8080` for the API calls to work properly.

## Project Structure

```
src/
├── components/          # Reusable UI components
├── contexts/           # React contexts (Auth)
├── pages/              # Page components
├── services/           # API service functions
├── App.js              # Main app component
└── index.js            # Entry point
```

## Available Scripts

- `npm start` - Start development server
- `npm build` - Build for production
- `npm test` - Run tests

## User Roles

### Job Seekers (USER)
- Browse and search jobs
- Apply for positions
- Track application status
- Vote on job posts

### Companies (COMPANY)
- Toggle between user and company modes
- Post and manage job listings
- Review and manage applications
- Update application statuses

## Technologies Used

- React 18
- React Router DOM
- Tailwind CSS
- Axios for API calls
- React Hook Form
- React Hot Toast
- Lucide React (icons)