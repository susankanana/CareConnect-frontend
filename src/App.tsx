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
import Doctors from './dashboard/adminDashboard/main/doctors/Doctors'
import Appointments from './dashboard/adminDashboard/main/appointments/Appointments'
import Complaints from './dashboard/adminDashboard/main/complaints/Complaints'
import Analytics from './dashboard/adminDashboard/main/analytics/Analytics'
// import UserProfile from './dashboard/UserDashboard/UserProfile'
// import UserDashboard from './dashboard/UserDashboard/UserDashboard'


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
          element: <Doctors />
        },
        {
          path: 'appointments',
          element: <Appointments />
        },
         {
          path: 'complaints',
          element: <Complaints />
        },
        {
          path: 'profile',
          element: <AdminProfile />
        },
        {
          path: 'analytics',
          element: <Analytics/>
        },
      ]
    },

    // // User dashboard routes
    // {
    //   path: '/user/dashboard',
    //   element: isUser ? <UserDashboard /> : <Login />,
    //   children: [
    //     {
    //       path: 'analytics',
    //       element: <h1>Analytics</h1>
    //     },
    //     {
    //       path: 'todos',
    //       element: <UserTodos />
    //     },
    //     {
    //       path: 'profile',
    //       element: <UserProfile />
    //     },
    //   ]
    // },
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
