import { Outlet } from 'react-router-dom';
import SignUpPage from '../pages/SignUp';

const SignUpLayout = () => {
  return (
    <div>
        <SignUpPage />
        <Outlet />
    </div>
  );
};

export default SignUpLayout; 