import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const styles = {
    nav: { background: "#1a1d2e", borderBottom: "1px solid #2d3148", padding: "0 2rem", display: "flex", alignItems: "center", justifyContent: "space-between", height: "60px", position: "sticky", top: 0, zIndex: 100 },
    logo: { fontSize: "1.3rem", fontWeight: 700, color: "#3b82f6", letterSpacing: "-0.5px" },
    links: { display: "flex", gap: "1.5rem", alignItems: "center" },
    link: { color: "#94a3b8", fontSize: "0.9rem", fontWeight: 500, transition: "color 0.2s" },
    btn: { background: "#3b82f6", color: "#fff", border: "none", padding: "0.4rem 1rem", borderRadius: "6px", cursor: "pointer", fontSize: "0.9rem", fontWeight: 500 },
    outlineBtn: { background: "transparent", color: "#3b82f6", border: "1px solid #3b82f6", padding: "0.4rem 1rem", borderRadius: "6px", cursor: "pointer", fontSize: "0.9rem", fontWeight: 500 },
};

export default function Navbar() {
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate("/");
    };

    return (
        <nav style={styles.nav}>
            <Link to="/" style={styles.logo}>⌨️ CodeBoard</Link>
            <div style={styles.links}>
                <Link to="/problems" style={styles.link}>Problems</Link>
                <Link to="/rooms" style={styles.link}>Rooms</Link>
                {user ? (
                    <>
                        <Link to={`/profile/${user.username}`} style={styles.link}>{user.username}</Link>
                        <button onClick={handleLogout} style={styles.outlineBtn}>Logout</button>
                    </>
                ) : (
                    <>
                        <Link to="/login" style={styles.link}>Login</Link>
                        <button onClick={() => navigate("/register")} style={styles.btn}>Sign Up</button>
                    </>
                )}
            </div>
        </nav>
    );
}