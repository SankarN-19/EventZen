import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
import Dashboard from './pages/dashboard/Dashboard';
import VenuesPage from './pages/venues/VenuesPage';
import EventsPage from './pages/events/EventsPage';
import BookingsPage from './pages/bookings/BookingsPage';
import BudgetPage from './pages/budget/BudgetPage';
import BrowsePage from './pages/browse/BrowsePage';
import MyBookingsPage from './pages/browse/MyBookingsPage';
import VendorsPage from './pages/vendors/VendorsPage';
import AttendeesPage from './pages/attendees/AttendeesPage';
import HomePage from './pages/home/HomePage';

const App = () => (
  <AuthProvider>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        <Route path="/dashboard" element={<ProtectedRoute adminOnly><Dashboard /></ProtectedRoute>} />
        <Route path="/venues" element={<ProtectedRoute adminOnly><VenuesPage /></ProtectedRoute>} />
        <Route path="/events" element={<ProtectedRoute adminOnly><EventsPage /></ProtectedRoute>} />
        <Route path="/bookings" element={<ProtectedRoute adminOnly><BookingsPage /></ProtectedRoute>} />
        <Route path="/budget" element={<ProtectedRoute adminOnly><BudgetPage /></ProtectedRoute>} />
        <Route path="/vendors" element={<ProtectedRoute adminOnly><VendorsPage /></ProtectedRoute>} />
        <Route path="/attendees" element={<ProtectedRoute adminOnly><AttendeesPage /></ProtectedRoute>} />

        <Route path="/browse" element={<ProtectedRoute><BrowsePage /></ProtectedRoute>} />
        <Route path="/my-bookings" element={<ProtectedRoute><MyBookingsPage /></ProtectedRoute>} />
      </Routes>
    </BrowserRouter>
  </AuthProvider>
);

export default App;