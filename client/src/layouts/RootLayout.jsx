import { Outlet, useLocation } from 'react-router-dom';
import Navbar from '../components/Navbar';
import { useLoading } from '../contexts/LoadingContext';
import noiseBackground from '../assets/bg-noise.png'

const RootLayout = () => {
  const location = useLocation();
  const { isVisualLoaded } = useLoading();

  const shouldHideNavbar = location.pathname === '/' && !isVisualLoaded;

  return (
    <>
      {!shouldHideNavbar && (
        <>
          <div
            className="absolute inset-0 z-0 pointer-events-none"
            style={{
              backgroundImage: `url(${noiseBackground})`,
              backgroundRepeat: 'repeat',
              backgroundSize: '128px',
              opacity: 0.04,
              borderRadius: 0,
              width: '100%',
              height: '100%',
            }}
          />
          
          <Navbar />
        </>
      )}
      <main>
        <Outlet />
      </main>
    </>
  )
}

export default RootLayout