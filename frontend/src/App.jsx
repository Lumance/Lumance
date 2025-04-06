import { Route, createBrowserRouter, createRoutesFromElements, RouterProvider } from 'react-router-dom';
import Home from './pages/LandingPage';
import AnalyticsPage from './pages/AnalyticsPage';
import RootLayout from './layouts/RootLayout';
import SignUp from './pages/SignUp';
import Login from './pages/Login';
import NotFound from './components/NotFound';
import AuthLayout from './layouts/AuthLayout';
import PricingPage from './pages/PricingPage';
import AboutUsPage from './pages/AboutUsPage';
import OnboardingPage from './pages/OnboardingPage';
import Dashboard from './pages/Dashboard';

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
          <Route path='login' element={<Login />} />
          <Route path='signup' element={<SignUp />} />
        </Route>

        <Route path="*" element={<NotFound />} />
        <Route path='onboarding' element={<OnboardingPage />} />
        <Route path='dashboard' element={<Dashboard />} />
      </>
    )
  )

  return <RouterProvider router={router} />;
}

export default App