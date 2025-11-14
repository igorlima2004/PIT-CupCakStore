
import React, { Suspense, lazy } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from '@/components/ui/toaster';
import { AuthProvider, useAuth } from '@/contexts/AuthContext';
import { CartProvider } from '@/contexts/CartContext';
import { ProductProvider } from '@/contexts/ProductContext';
import { OrderProvider } from '@/contexts/OrderContext';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import LoadingSpinner from '@/components/shared/LoadingSpinner';

const HomePage = lazy(() => import('@/pages/HomePage'));
const LoginPage = lazy(() => import('@/pages/LoginPage'));
const SignupPage = lazy(() => import('@/pages/SignupPage'));
const CartPage = lazy(() => import('@/pages/CartPage'));
const CheckoutPage = lazy(() => import('@/pages/CheckoutPage'));
const MyAccountPage = lazy(() => import('@/pages/MyAccountPage'));
const MyOrdersPage = lazy(() => import('@/pages/MyOrdersPage'));
const AdminDashboardPage = lazy(() => import('@/pages/AdminDashboardPage'));
const FeedbackPage = lazy(() => import('@/pages/FeedbackPage'));
const PasswordResetPage = lazy(() => import('@/pages/PasswordResetPage'));
const NotFoundPage = lazy(() => import('@/pages/NotFoundPage'));

function ProtectedRoute({ children, adminOnly = false }) {
  const { user, loading } = useAuth();

  if (loading) {
    return <LoadingSpinner className="h-screen" />;
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (adminOnly && user.role !== 'admin') {
    return <Navigate to="/" replace />;
  }

  return children;
}

function AppRoutes() {
  return (
    <Suspense fallback={<LoadingSpinner className="h-screen" />}>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />
        <Route path="/cart" element={<CartPage />} />
        <Route path="/password-reset" element={<PasswordResetPage />} />
        
        <Route path="/checkout" element={<ProtectedRoute><CheckoutPage /></ProtectedRoute>} />
        <Route path="/my-account" element={<ProtectedRoute><MyAccountPage /></ProtectedRoute>} />
        <Route path="/my-orders" element={<ProtectedRoute><MyOrdersPage /></ProtectedRoute>} />
        <Route path="/feedback" element={<ProtectedRoute><FeedbackPage /></ProtectedRoute>} />
        
        <Route path="/admin" element={<ProtectedRoute adminOnly={true}><AdminDashboardPage /></ProtectedRoute>} />
        
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </Suspense>
  );
}

function App() {
  return (
    <Router>
      <AuthProvider>
        <ProductProvider>
          <CartProvider>
            <OrderProvider>
              <div className="flex flex-col min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-pink-100">
                <Header />
                <main className="flex-grow container mx-auto px-4 py-8">
                  <AppRoutes />
                </main>
                <Footer />
                <Toaster />
              </div>
            </OrderProvider>
          </CartProvider>
        </ProductProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;
  