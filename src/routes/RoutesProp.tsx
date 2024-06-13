import { Navigate } from "react-router-dom";
import { useAuth0 } from "@auth0/auth0-react";

interface PrivateRouteProps {
  component: React.ComponentType<any>;
  roles?: string[];
  [key: string]: any;
}

const PrivateRoute: React.FC<PrivateRouteProps> = ({
  component: Component,
  roles,
  ...props
}) => {
  const { user } = useAuth0();
  console.log(user);
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (roles && !roles.includes(user.role)) {
    return <Navigate to="/unauthorized" replace />;
  }

  return <Component {...props} />;
};

export default PrivateRoute;
