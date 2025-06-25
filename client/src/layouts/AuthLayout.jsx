import { Outlet } from 'react-router-dom';

const AuthLayout = () => {
  return (
    <div className="min-w-screen bg-background text-foreground flex items-center justify-center">
      <Outlet />
    </div>
  );
};

export default AuthLayout;