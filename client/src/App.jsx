import { BrowserRouter, Route, Routes } from 'react-router-dom'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import './App.css'
import Login from './pages/Login'
import Register from './pages/Register'
import Home from './pages/Home'
import Menu from './pages/Menu'
import ProductDetail from './pages/ProductDetail'
import Cart from './pages/Cart'
import Checkout from './pages/Checkout'
import OrderConfirmation from './pages/OrderConfirmation'
import OrderStatus from './pages/OrderStatus'
import OrderDetails from './pages/OrderDetails'
import OrderHistory from './pages/OrderHistory'
import Profile from './pages/Profile'
import MainLayout from './components/layout/MainLayout'
import ProtectedRoute from './components/common/ProtectedRoute'
import StaffLayout from './components/staff/StaffLayout'
import StaffDashboard from './pages/staff/Dashboard'
import OrderQueue from './pages/staff/OrderQueue'
import MenuManagement from './pages/admin/MenuManagement'
import CategoryManagement from './pages/admin/CategoryManagement'

function PageShell({ title, subtitle, children }) {
  return (
    <div className="rounded-2xl bg-white p-6 shadow-sm">
      <h1 className="text-2xl font-semibold text-gray-900">{title}</h1>
      {subtitle && <p className="mt-2 text-sm text-gray-600">{subtitle}</p>}
      {children && <div className="mt-6">{children}</div>}
    </div>
  )
}

const About = () => (
  <PageShell
    title="About TasteBox"
    subtitle="We bring restaurant-quality meals to your doorstep."
  />
)

const Contact = () => (
  <PageShell
    title="Contact us"
    subtitle="We would love to hear from you."
  />
)

const NotFound = () => (
  <PageShell
    title="Page not found"
    subtitle="The page you are looking for does not exist."
  />
)

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Admin Routes */}
        <Route element={<ProtectedRoute roles={['admin']} />}>
          <Route path="admin" element={<StaffLayout />}>
            <Route path="menu" element={<MenuManagement />} />
            <Route path="categories" element={<CategoryManagement />} />
          </Route>
        </Route>

        {/* Staff Routes */}
        <Route element={<ProtectedRoute roles={['staff', 'admin']} />}>
          <Route path="staff" element={<StaffLayout />}>
            <Route index element={<StaffDashboard />} />
            <Route path="orders" element={<OrderQueue />} />
          </Route>
        </Route>

        {/* Customer Routes */}
        <Route element={<MainLayout />}>
          <Route index element={<Home />} />
          <Route path="menu" element={<Menu />} />
          <Route path="menu/:id" element={<ProductDetail />} />
          <Route path="cart" element={<Cart />} />
          <Route path="about" element={<About />} />
          <Route path="contact" element={<Contact />} />
          <Route path="login" element={<Login />} />
          <Route path="register" element={<Register />} />
          <Route element={<ProtectedRoute />}>
            <Route path="checkout" element={<Checkout />} />
            <Route path="orders/:id/confirmation" element={<OrderConfirmation />} />
            <Route path="orders/:id/status" element={<OrderStatus />} />
            <Route path="orders/:id/track" element={<OrderStatus />} />
            <Route path="orders/:id" element={<OrderDetails />} />
            <Route path="orders" element={<OrderHistory />} />
            <Route path="profile" element={<Profile />} />
          </Route>
          <Route path="*" element={<NotFound />} />
        </Route>
      </Routes>
      <ToastContainer position="top-right" autoClose={3000} theme="colored" />
    </BrowserRouter>
  )
}

export default App
