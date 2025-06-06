import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { UseAuth } from "../contexts/AuthContext";

const ProtectedRoute = ({ children }) => {
    const navigate = useNavigate();
    const location = useLocation();
    const { user, loading } = UseAuth();
    const [shouldRender, setShouldRender] = useState(false);

    useEffect(() => {
        if (loading) return;

        if (!user) {
            navigate("/login", { replace: true });
        } else if (!user.onboarded && location.pathname !== "/onboarding") {
            navigate("/onboarding", { replace: true });
        } else if (user.onboarded && location.pathname === "/onboarding") {
            navigate("/dashboard", { replace: true });
        } else {
            setShouldRender(true);
        }
    }, [user, loading, navigate, location.pathname]);

    if (loading || !shouldRender) return null;

    return children;
};

export default ProtectedRoute;
