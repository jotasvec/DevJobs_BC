import { Navigate, Outlet, useLocation } from "react-router";
import { useAuth } from "../hooks/useAuth";
import Loading from "../components/Loading";

export const ProtectedRoute = () => {
    const { isLoggedIn, isPending } = useAuth();
    const location = useLocation()

    if (isPending) return (
        <Loading />
    )
    
    if (!isLoggedIn) {
        return <Navigate 
            to="/signin"
            state={{from: location.pathname }}
            replace
        />
    }

  return <Outlet />
}
