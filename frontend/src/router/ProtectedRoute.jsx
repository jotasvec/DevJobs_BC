import { Navigate, Outlet, useLocation } from "react-router";
import { useAuth } from "../hooks/useAuth";

export const ProtectedRoute = () => {
    const { isLoggedIn } = useAuth();
    const location = useLocation()

    if (!isLoggedIn) {
        return <Navigate 
            to="/signin"
            state={{from: location.pathname }}
            replace
        />
    }

  return <Outlet />
}
