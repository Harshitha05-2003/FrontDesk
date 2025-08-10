# Front Desk System

A comprehensive clinic management system built with NestJS backend and Next.js frontend, designed for front desk staff to manage patient queues, appointments, and doctor profiles.

## Features

### 🔐 Authentication
- Secure JWT-based authentication
- Role-based access control (Staff/Admin)
- Protected routes and API endpoints

### 📋 Queue Management
- Add walk-in patients to queue
- Assign queue numbers automatically
- Update patient status (Waiting, With Doctor, Completed, Cancelled)
- Priority levels (Normal, Urgent, VIP)
- Real-time queue tracking

### 📅 Appointment Management
- Book, reschedule, and cancel appointments
- Doctor availability checking
- Appointment status tracking
- Date and time filtering
- Support for both scheduled and walk-in appointments

### 👨‍⚕️ Doctor Management
- Add, edit, and delete doctor profiles
- Specialization and location tracking
- Availability status management
- Search and filter functionality

### 👥 Staff Management
- Manage front desk staff accounts
- Role-based permissions
- Account status management

### 📊 Dashboard
- Real-time statistics
- Quick actions
- Recent activity overview

## Technology Stack

### Backend
- **NestJS** - Progressive Node.js framework
- **TypeORM** - Object-Relational Mapping
- **MySQL** - Database
- **JWT** - Authentication
- **Passport** - Authentication strategy
- **bcryptjs** - Password hashing

### Frontend
- **Next.js 14** - React framework
- **TypeScript** - Type safety
- **Tailwind CSS** - Styling
- **Axios** - HTTP client
- **React Hook Form** - Form management
- **React Hot Toast** - Notifications
- **Lucide React** - Icons

## Prerequisites

- Node.js 18+ 
- MySQL 8.0+
- npm or yarn

## Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd front-desk-system
   ```

2. **Install dependencies**
   ```bash
   npm run install:all
   ```

3. **Set up the database**
   - Create a MySQL database named `front_desk_db`
   - Update database credentials in `backend/src/app.module.ts` if needed

4. **Environment Setup**
   Create a `.env` file in the backend directory:
   ```env
   DB_HOST=localhost
   DB_PORT=3306
   DB_USERNAME=root
   DB_PASSWORD=your_password
   DB_DATABASE=front_desk_db
   JWT_SECRET=your-secret-key
   ```

5. **Start the development servers**
   ```bash
   # Start both backend and frontend
   npm run dev
   
   # Or start them separately
   npm run dev:backend  # Backend on http://localhost:3001
   npm run dev:frontend # Frontend on http://localhost:3000
   ```

## Default Credentials

- **Username:** admin
- **Password:** password

## API Endpoints

### Authentication
- `POST /auth/login` - User login
- `GET /auth/profile` - Get user profile

### Queue Management
- `GET /queue` - Get all queue items
- `GET /queue/active` - Get active queue
- `POST /queue` - Add patient to queue
- `PATCH /queue/:id/status` - Update queue status
- `DELETE /queue/:id` - Remove from queue

### Appointments
- `GET /appointments` - Get all appointments
- `POST /appointments` - Book appointment
- `PATCH /appointments/:id/status` - Update appointment status
- `DELETE /appointments/:id` - Cancel appointment

### Doctors
- `GET /doctors` - Get all doctors
- `POST /doctors` - Add doctor
- `PATCH /doctors/:id` - Update doctor
- `DELETE /doctors/:id` - Delete doctor

### Staff
- `GET /users` - Get all staff
- `POST /users` - Add staff member
- `PATCH /users/:id` - Update staff
- `DELETE /users/:id` - Delete staff

## Project Structure

```
front-desk-system/
├── backend/                 # NestJS backend
│   ├── src/
│   │   ├── auth/           # Authentication module
│   │   ├── users/          # Staff management
│   │   ├── doctors/        # Doctor management
│   │   ├── appointments/   # Appointment management
│   │   ├── queue/          # Queue management
│   │   └── main.ts         # Application entry point
│   └── package.json
├── frontend/               # Next.js frontend
│   ├── app/               # App router pages
│   ├── components/        # Reusable components
│   ├── contexts/          # React contexts
│   └── package.json
└── package.json           # Root package.json
```

## Features in Detail

### Queue Management
- **Automatic Queue Numbers**: System assigns sequential queue numbers
- **Priority Levels**: Normal, Urgent, VIP patients
- **Status Tracking**: Waiting → With Doctor → Completed
- **Real-time Updates**: Live status updates

### Appointment System
- **Doctor Availability**: Check doctor availability before booking
- **Time Slots**: Configurable appointment durations
- **Conflict Prevention**: Prevents double-booking
- **Status Management**: Booked → In Progress → Completed

### Doctor Profiles
- **Specializations**: Cardiology, Dermatology, etc.
- **Availability**: Track doctor availability
- **Location**: Multiple clinic locations
- **Search & Filter**: Find doctors by specialization/location

### Staff Management
- **Role-based Access**: Staff and Admin roles
- **Account Management**: Add, edit, deactivate staff
- **Security**: Password hashing and JWT tokens

## Development

### Backend Development
```bash
cd backend
npm run start:dev  # Development mode with hot reload
npm run build      # Build for production
npm run test       # Run tests
```

### Frontend Development
```bash
cd frontend
npm run dev        # Development server
npm run build      # Build for production
npm run lint       # Run ESLint
```

## Deployment

### Backend Deployment
1. Build the application: `npm run build`
2. Set up environment variables
3. Configure database connection
4. Deploy to your preferred hosting service

### Frontend Deployment
1. Build the application: `npm run build`
2. Deploy to Vercel, Netlify, or your preferred hosting service
3. Update API endpoint URLs for production

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

This project is licensed under the MIT License.

## Support

For support and questions, please open an issue in the repository.
