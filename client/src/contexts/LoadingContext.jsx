// contexts/LoadingContext.jsx
import { createContext, useContext, useState } from 'react';

const LoadingContext = createContext();

export const useLoading = () => {
    const context = useContext(LoadingContext);
    if (!context) throw new Error("useLoading must be used within a LoadingProvider");

    return context;
};

export const LoadingProvider = ({ children }) => {
    const [isVisualLoaded, setIsVisualLoaded] = useState(false);

    return (
        <LoadingContext.Provider value={{ isVisualLoaded, setIsVisualLoaded }}>
            {children}
        </LoadingContext.Provider>
    );
};