import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "./context/AuthContext";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Problems from "./pages/Problems";
import ProblemDetail from "./pages/ProblemDetail";
import Rooms from "./pages/Rooms";
import Room from "./pages/Room";
import Profile from "./pages/Profile";

const PrivateRoute = ({ children }) => {
    const { user, loading } = useAuth();
    if (loading) return <div style={{ color: "#e2e8f0", padding: "2rem" }}>Loading...</div>;
    return user ? children : <Navigate to="/login" />;
};

function App() {
    return (
        <AuthProvider>
            <Router>
                <Navbar />
                <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/login" element={<Login />} />
                    <Route path="/register" element={<Register />} />
                    <Route path="/problems" element={<Problems />} />
                    <Route path="/problems/:slug" element={<ProblemDetail />} />
                    <Route path="/rooms" element={<PrivateRoute><Rooms /></PrivateRoute>} />
                    <Route path="/rooms/:roomId" element={<PrivateRoute><Room /></PrivateRoute>} />
                    <Route path="/profile/:username" element={<PrivateRoute><Profile /></PrivateRoute>} />
                </Routes>
            </Router>
        </AuthProvider>
    );
}

export default App;