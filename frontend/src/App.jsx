import { Route, createBrowserRouter, createRoutesFromElements, RouterProvider } from 'react-router-dom';
import RootLayout from './layouts/RootLayout';
import AuthLayout from './layouts/AuthLayout';
import { AuthProvider } from './contexts/AuthContext';
import Home from './pages/LandingPage';
import LoginPage from './pages/LoginPage';
import SignUp from './pages/SignUp';
import NotFound from './components/NotFound';
import PricingPage from './pages/PricingPage';
import AboutUsPage from './pages/AboutUsPage';
import AnalyticsPage from './pages/AnalyticsPage';
import OnboardingPage from './pages/OnboardingPage';
import Dashboard from './pages/Dashboard';

import ProtectedRoute from './routes/ProtectedRoute';
import PublicRoute from "./routes/PublicRoute";

const App = () => {
  const router = createBrowserRouter(
    createRoutesFromElements(
      <>
        <Route path='/' element={<RootLayout />}>
          <Route index element={<Home />} />
          <Route path='analytics' element={<AnalyticsPage />} />
          <Route path='pricing' element={<PricingPage />} />
          <Route path='about-us' element={<AboutUsPage />} />
        </Route>

        <Route element={<AuthLayout />}>
          <Route path='login' element={<PublicRoute><LoginPage /></PublicRoute>} />
          <Route path='register' element={<PublicRoute><SignUp /></PublicRoute>} />
        </Route>

        <Route path="*" element={<NotFound />} />
        <Route path='onboarding' element={<ProtectedRoute><OnboardingPage /></ProtectedRoute>} />
        <Route path='dashboard' element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
      </>
    )
  )

  return (
    <AuthProvider>
      <RouterProvider router={router} />
    </AuthProvider>
  )
}

export default App