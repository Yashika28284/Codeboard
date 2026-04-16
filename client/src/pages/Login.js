import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const s = {
    page: { minHeight: "calc(100vh - 60px)", display: "flex", alignItems: "center", justifyContent: "center", padding: "2rem" },
    box: { background: "#1a1d2e", border: "1px solid #2d3148", borderRadius: "12px", padding: "2.5rem", width: "100%", maxWidth: "400px" },
    title: { fontSize: "1.5rem", fontWeight: 700, color: "#f1f5f9", marginBottom: "0.5rem" },
    sub: { color: "#64748b", fontSize: "0.9rem", marginBottom: "2rem" },
    label: { display: "block", color: "#94a3b8", fontSize: "0.85rem", fontWeight: 500, marginBottom: "0.4rem" },
    input: { width: "100%", background: "#0f1117", border: "1px solid #2d3148", borderRadius: "8px", padding: "0.65rem 1rem", color: "#e2e8f0", fontSize: "0.95rem", marginBottom: "1.2rem", boxSizing: "border-box" },
    btn: { width: "100%", background: "#3b82f6", color: "#fff", border: "none", padding: "0.75rem", borderRadius: "8px", cursor: "pointer", fontSize: "1rem", fontWeight: 600 },
    err: { background: "#2d1a1a", border: "1px solid #7f1d1d", color: "#fca5a5", borderRadius: "8px", padding: "0.75rem 1rem", marginBottom: "1rem", fontSize: "0.9rem" },
    foot: { textAlign: "center", marginTop: "1.5rem", color: "#64748b", fontSize: "0.9rem" },
    link: { color: "#3b82f6", fontWeight: 500 },
};

export default function Login() {
    const { login } = useAuth();
    const navigate = useNavigate();
    const [form, setForm] = useState({ email: "", password: "" });
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true); setError("");
        try {
            await login(form.email, form.password);
            navigate("/problems");
        } catch (err) {
            setError(err.response?.data?.message || "Login failed");
        } finally { setLoading(false); }
    };

    return (
        <div style={s.page}>
            <div style={s.box}>
                <div style={s.title}>Welcome back</div>
                <div style={s.sub}>Sign in to your CodeBoard account</div>
                {error && <div style={s.err}>{error}</div>}
                <form onSubmit={handleSubmit}>
                    <label style={s.label}>Email</label>
                    <input style={s.input} type="email" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} placeholder="you@example.com" required />
                    <label style={s.label}>Password</label>
                    <input style={s.input} type="password" value={form.password} onChange={e => setForm({ ...form, password: e.target.value })} placeholder="••••••••" required />
                    <button style={s.btn} type="submit" disabled={loading}>{loading ? "Signing in..." : "Sign In"}</button>
                </form>
                <div style={s.foot}>Don't have an account? <Link to="/register" style={s.link}>Sign up</Link></div>
            </div>
        </div>
    );
}