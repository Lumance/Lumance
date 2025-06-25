import { Outlet, useLocation } from 'react-router-dom';
import { motion } from 'motion/react';
import Navbar from '../components/Navbar';
import { useLoading } from '../contexts/LoadingContext';
import noiseBackground from '../assets/bg-noise.png'

const RootLayout = () => {
  const location = useLocation();
  const { isVisualLoaded } = useLoading();

  const shouldHideNavbar = location.pathname === '/' && !isVisualLoaded;

  return (
    <>
      <motion.div
        className="fixed top-0 left-0 w-full h-screen z-0 pointer-events-none"
        style={{
          backgroundImage: `url(${noiseBackground})`,
          backgroundRepeat: 'repeat',
          backgroundSize: '128px',
          opacity: 0.04,
        }}
      />

      {!shouldHideNavbar && <Navbar />}

      <main>
        <Outlet />
      </main>
    </>
  )
}

export default RootLayout