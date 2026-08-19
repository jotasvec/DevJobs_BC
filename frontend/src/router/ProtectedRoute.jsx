import { Navigate, Outlet, Route, useLocation } from "react-router";
import { useAuth } from "../hooks/useAuth";
import Loading from "../components/Loading";
import { ROUTES } from "../constants";

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

export const ProtectedRole = ({roles}) => {
    const { user, isLoggedIn, isPending } = useAuth();
    const location = useLocation()


    if (isPending) return <Loading />
    
    if (!isLoggedIn) return <Navigate 
        to={ROUTES.SIGNIN}
        state={{from: location.pathname }}
        replace
    />

    if(!roles.includes(user?.role) ) return <Navigate 
        to={ROUTES.HOME}
        replace
    />

    return <Outlet />
}
