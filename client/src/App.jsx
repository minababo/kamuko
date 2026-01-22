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
import MainLayout from './components/layout/MainLayout'
import ProtectedRoute from './components/common/ProtectedRoute'

function PageShell({ title, subtitle, children }) {
  return (
    <div className="rounded-2xl bg-white p-6 shadow-sm">
      <h1 className="text-2xl font-semibold text-gray-900">{title}</h1>
      {subtitle && <p className="mt-2 text-sm text-gray-600">{subtitle}</p>}
      {children && <div className="mt-6">{children}</div>}
    </div>
  )
}

const Orders = () => (
  <PageShell
    title="Your orders"
    subtitle="Track your latest orders and reorder your favorites."
  />
)

const Profile = () => (
  <PageShell
    title="Profile"
    subtitle="Manage your account details and delivery preferences."
  />
)

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
            <Route path="orders" element={<Orders />} />
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
