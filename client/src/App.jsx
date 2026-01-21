import { BrowserRouter, Route, Routes } from 'react-router-dom'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import './App.css'
import Login from './pages/Login'
import Register from './pages/Register'
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

const Home = () => (
  <PageShell
    title="Welcome to TasteBox"
    subtitle="Freshly prepared meals delivered with care."
  />
)

const Menu = () => (
  <PageShell
    title="Menu"
    subtitle="Explore our chef-crafted favorites and seasonal specials."
  />
)

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

const Cart = () => (
  <PageShell
    title="Cart"
    subtitle="Review items before placing your order."
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
          <Route path="cart" element={<Cart />} />
          <Route path="about" element={<About />} />
          <Route path="contact" element={<Contact />} />
          <Route path="login" element={<Login />} />
          <Route path="register" element={<Register />} />
          <Route element={<ProtectedRoute />}>
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
