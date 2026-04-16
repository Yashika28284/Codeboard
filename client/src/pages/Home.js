import React from "react";
import { useNavigate } from "react-router-dom";

const s = {
    page: { minHeight: "calc(100vh - 60px)", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "2rem", textAlign: "center" },
    tag: { background: "#1e3a5f", color: "#60a5fa", padding: "0.3rem 0.9rem", borderRadius: "20px", fontSize: "0.8rem", fontWeight: 600, marginBottom: "1.5rem", display: "inline-block" },
    h1: { fontSize: "3rem", fontWeight: 700, color: "#f1f5f9", lineHeight: 1.2, marginBottom: "1rem" },
    accent: { color: "#3b82f6" },
    sub: { color: "#94a3b8", fontSize: "1.1rem", maxWidth: "500px", lineHeight: 1.6, marginBottom: "2.5rem" },
    btns: { display: "flex", gap: "1rem", justifyContent: "center", flexWrap: "wrap" },
    btn: { background: "#3b82f6", color: "#fff", border: "none", padding: "0.75rem 2rem", borderRadius: "8px", cursor: "pointer", fontSize: "1rem", fontWeight: 600 },
    outline: { background: "transparent", color: "#e2e8f0", border: "1px solid #3d4263", padding: "0.75rem 2rem", borderRadius: "8px", cursor: "pointer", fontSize: "1rem", fontWeight: 500 },
    cards: { display: "flex", gap: "1.5rem", marginTop: "4rem", flexWrap: "wrap", justifyContent: "center" },
    card: { background: "#1a1d2e", border: "1px solid #2d3148", borderRadius: "12px", padding: "1.5rem", width: "220px", textAlign: "left" },
    cardIcon: { fontSize: "1.8rem", marginBottom: "0.75rem" },
    cardTitle: { color: "#f1f5f9", fontWeight: 600, marginBottom: "0.4rem" },
    cardText: { color: "#64748b", fontSize: "0.85rem", lineHeight: 1.5 },
};

export default function Home() {
    const navigate = useNavigate();
    return (
        <div style={s.page}>
            <span style={s.tag}>🚀 Built for DSA Interview Prep</span>
            <h1 style={s.h1}>Code Together,<br /><span style={s.accent}>Succeed Together</span></h1>
            <p style={s.sub}>Real-time collaborative coding rooms, curated DSA problems, and live chat — all in one platform.</p>
            <div style={s.btns}>
                <button style={s.btn} onClick={() => navigate("/problems")}>Browse Problems</button>
                <button style={s.outline} onClick={() => navigate("/rooms")}>Join a Room</button>
            </div>
            <div style={s.cards}>
                {[
                    { icon: "🧩", title: "Curated Problems", text: "Hand-picked DSA problems from Easy to Hard" },
                    { icon: "👥", title: "Live Rooms", text: "Code simultaneously with friends in real time" },
                    { icon: "💬", title: "Room Chat", text: "Discuss approaches without leaving the editor" },
                    { icon: "📊", title: "Track Progress", text: "Mark problems solved and see your stats" },
                ].map((c) => (
                    <div key={c.title} style={s.card}>
                        <div style={s.cardIcon}>{c.icon}</div>
                        <div style={s.cardTitle}>{c.title}</div>
                        <div style={s.cardText}>{c.text}</div>
                    </div>
                ))}
            </div>
        </div>
    );
}