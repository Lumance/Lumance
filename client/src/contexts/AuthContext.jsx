import { createContext, useState, useEffect, useContext } from "react";

const AuthContext = createContext();

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) throw new Error("useAuth must be used within an AuthProvider");

    return context;
}

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [isAuthLoading, setIsAuthLoading] = useState(true);

    const refreshUser = async () => {
        const startTime = Date.now();
        try {
            const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/auth/me`, {
                credentials: 'include',
            });

            if (response.ok) {
                const { user } = await response.json();
                if (user?.avatarUrl) {
                    sessionStorage.setItem(
                        'avatarCache',
                        user.avatarUrl
                    );
                }

                setUser(user);
            } else {
                setUser(null);
            }
        } catch {
            setUser(null); // Set to false to indicate not logged in
        } finally {
            const elapsed = Date.now() - startTime
            const MIN_DELAY = 2000 // 2 seconds
            const remaining = MIN_DELAY - elapsed

            if (remaining > 0) {
                setTimeout(() => setIsAuthLoading(false), remaining)
            } else {
                setIsAuthLoading(false);
            }
        }
    }

    useEffect(() => {
        refreshUser();
    }, []);

    const logout = async () => {
        try {
            await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/auth/logout`, {
                method: 'POST',
                credentials: 'include'
            });

            setUser(null);

            localStorage.removeItem('avatarCache');
            sessionStorage.clear();
        } catch (error) {
            console.error('Logout error:', error);
        }
    };

    const value = { user, setUser, isAuthLoading, refreshUser, logout }

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    )
}