import { useContext } from "react";
import { Navigate } from "react-router-dom";
import { AuthContext } from "../Context/AuthContext"; // pastikan path benar

export function PrivateRoute({ redirectTo, children }) {
  const { user } = useContext(AuthContext);

  if (!user) {
    return <Navigate to={redirectTo} replace />;
  }

  return children;
}
