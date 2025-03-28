import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";

const adminAuth = ({ children }) => {
    const [currentUser, setCurrentUser] = useState(null);

    useEffect(() => {
        const storedUser = JSON.parse(sessionStorage.getItem("User"));
        
        if (storedUser) {
            setCurrentUser(storedUser);
        } else {
            setCurrentUser(null);
        }
    }, []); // Empty dependency array to run only once on component mount

    console.log(currentUser);
    // If user data is not retrieved yet, return null (loading state)
    if (currentUser === null) {
        return null;
    }

    // If user is not logged in, redirect to login page
    if (!currentUser) {
        return <Navigate to="/login" replace />;
    }

    // If user is logged in but not an admin, redirect to homepage
    if (currentUser.role !== 'admin') {
        return <Navigate to="/" replace />;
    }

    // If user is logged in and is an admin, render children components
    return children;
};

export default adminAuth;
