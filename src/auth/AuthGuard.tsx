import { Navigate } from 'react-router-dom';

interface AuthGuardProps {
  children: React.ReactNode;
  isAuthenticated: boolean;
}

const AuthGuard: React.FC<AuthGuardProps> = ({ children, isAuthenticated }) => {
  if (!isAuthenticated) {
    return <Navigate to="/" />;
  }

  return <>{children}</>; 
};

export default AuthGuard;
