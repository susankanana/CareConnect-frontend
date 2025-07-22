import { createBrowserRouter, RouterProvider } from 'react-router'
import './App.css'
import LandingPage from './pages/LandingPage'
import Register from './pages/auth/Register'
import Login from './pages/auth/Login'
import AboutPage from './pages/AboutPage'
import Appointment from './pages/Appointment'
import PaymentSuccess from './pages/payment/PaymentSuccess'
import PaymentCancelled from './pages/payment/PaymentCancelled'
import AdminDashboard from './dashboard/adminDashboard/AdminDashboard'
import Error from './components/error/Error'
import VerifyUser from './pages/auth/VerifyUser'
import { Toaster } from 'sonner'
import Users from './dashboard/adminDashboard/main/users/Users'
import AdminProfile from './dashboard/adminDashboard/main/profile/AdminProfile'
import { type RootState } from './app/store'
import { useSelector } from 'react-redux'
import AdminDoctors from './dashboard/adminDashboard/main/doctors/AdminDoctors'
import AdminComplaints from './dashboard/adminDashboard/main/complaints/AdminComplaints'
import AdminAnalytics from './dashboard/adminDashboard/main/analytics/AdminAnalytics'
import DoctorDashboard from './dashboard/doctorDashboard/DoctorDashboard'
import AdminAppointments from './dashboard/adminDashboard/main/appointments/AdminAppointments'
import DoctorAppointments from './dashboard/doctorDashboard/main/appointments/DoctorAppointments'
import DoctorProfile from './dashboard/doctorDashboard/main/profile/DoctorProfile'
import DoctorPrescriptions from './dashboard/doctorDashboard/main/prescriptions/DoctorPrescriptions'
import DoctorAnalytics from './dashboard/doctorDashboard/main/analytics/DoctorAnalytics'
import PatientProfile from './dashboard/patientDashboard/main/profile/PatientProfile'
import PatientDashboard from './dashboard/patientDashboard/PatientDashboard'
import PatientAnalytics from './dashboard/patientDashboard/main/analytics/PatientAnalytics'
import PatientAppointments from './dashboard/patientDashboard/main/appointments/PatientAppointments'
import PatientDoctors from './dashboard/patientDashboard/main/doctors/PatientDoctors'
import PatientComplaints from './dashboard/patientDashboard/main/complaints/PatientComplaints'


function App() {
  const isAdmin = useSelector((state: RootState) => state.user.user?.role === 'admin');
  const isUser = useSelector((state: RootState) => state.user.user?.role === 'user');
   const isDoctor = useSelector((state: RootState) => state.user.user?.role === 'doctor');

  const router = createBrowserRouter([
    {
      path: '/',
      element: <LandingPage />,
    },
    {
      path: '/about',
      element: <AboutPage />
    },
    {
      path: '/register',
      element: <Register />
    },
    {
      path: '/register/verify',
      element: <VerifyUser />
    },
    {
      path: '/login',
      element: <Login />
    },
    {
      path: '/appointments',
      element: <Appointment />
    },
    // Admin Dashboard Routes
    {
      path: '/admin/dashboard',
      element: isAdmin ? <AdminDashboard /> : <Login />,
      children: [
        {
          path: 'users',
          element: <Users />
        },
        {
          path: 'doctors',
          element: <AdminDoctors />
        },
        {
          path: 'appointments',
          element: <AdminAppointments />
        },
         {
          path: 'complaints',
          element: <AdminComplaints />
        },
        {
          path: 'profile',
          element: <AdminProfile />
        },
        {
          path: 'analytics',
          element: <AdminAnalytics/>
        },
      ]
    },
// Doctor dashboard routes
    {
      path: '/doctor/dashboard',
      element: isDoctor ? <DoctorDashboard /> : <Login />,
      children: [
        {
          path: 'appointments',
          element: <DoctorAppointments />
        },
        {
          path: 'prescriptions',
          element: <DoctorPrescriptions />
        },
        {
          path: 'profile',
          element: <DoctorProfile />
        },
        {
          path: 'analytics',
          element: <DoctorAnalytics />
        }
      ]
    },
    // User dashboard routes
    {
      path: '/user/dashboard',
      element: isUser ? <PatientDashboard /> : <Login />,
      children: [
        {
          path: 'appointments',
          element: <PatientAppointments />
        },
        {
          path: 'doctors',
          element: <PatientDoctors />
        },
        {
          path: 'complaints',
          element: <PatientComplaints />
        },
        {
          path: 'profile',
          element: <PatientProfile />
        },
        {
          path: 'analytics',
          element: <PatientAnalytics />
        }
      ]
    },
    {
      path: '/payment-success',
      element: <PaymentSuccess />
    },
    {
      path: '/payment-cancelled',
      element: <PaymentCancelled />
    },
    {
      path: '*',
      element: <Error />
    }
  ])

  return (
    <>
      <RouterProvider router={router} />
      <Toaster position='top-right' toastOptions={{
        classNames: {
          error: 'bg-red-500 text-white',
          success: 'bg-green-500 text-white',
          info: 'bg-blue-500 text-white',
        }

      }} />
    </>
  )
}

export default App
