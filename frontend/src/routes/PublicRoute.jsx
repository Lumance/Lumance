import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { UseAuth } from "../contexts/AuthContext";

const PublicRoute = ({ children }) => {
    const { user, loading } = UseAuth();
    const navigate = useNavigate();
    const [shouldRender, setShouldRender] = useState(false);

    useEffect(() => {
        if (loading) return;

        if (user) {
            if (user.onboarded) {
                navigate("/dashboard", { replace: true });
            } else {
                navigate("/onboarding", { replace: true });
            }
        } else {
            setShouldRender(true);
        }
    }, [user, loading, navigate]);

    if (loading || !shouldRender) return null;

    return children;
};

export default PublicRoute;