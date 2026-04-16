import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";

const diffColor = { Easy: "#22c55e", Medium: "#f59e0b", Hard: "#ef4444" };

const s = {
    page: { maxWidth: "800px", margin: "0 auto", padding: "2rem" },
    card: { background: "#1a1d2e", border: "1px solid #2d3148", borderRadius: "12px", padding: "2rem", marginBottom: "1.5rem" },
    avatar: { width: "64px", height: "64px", borderRadius: "50%", background: "#3b82f6", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "1.5rem", fontWeight: 700, color: "#fff", marginBottom: "1rem" },
    username: { fontSize: "1.5rem", fontWeight: 700, color: "#f1f5f9" },
    bio: { color: "#64748b", marginTop: "0.5rem" },
    statsRow: { display: "flex", gap: "1.5rem", marginTop: "1.5rem" },
    stat: { textAlign: "center" },
    statNum: { fontSize: "1.5rem", fontWeight: 700, color: "#f1f5f9" },
    statLabel: { color: "#64748b", fontSize: "0.8rem", marginTop: "0.2rem" },
    sectionTitle: { fontSize: "1.1rem", fontWeight: 600, color: "#f1f5f9", marginBottom: "1rem" },
    tag: (d) => ({ background: { Easy: "#052e16", Medium: "#2d1a00", Hard: "#2d0a0a" }[d], color: diffColor[d], padding: "0.2rem 0.6rem", borderRadius: "4px", fontSize: "0.75rem", fontWeight: 600 }),
    row: { display: "flex", justifyContent: "space-between", alignItems: "center", padding: "0.65rem 0", borderBottom: "1px solid #1e2235", color: "#94a3b8", fontSize: "0.9rem" },
};

export default function Profile() {
    const { username } = useParams();
    const [data, setData] = useState(null);

    useEffect(() => { axios.get(`/api/users/${username}`).then(r => setData(r.data)).catch(() => { }); }, [username]);

    if (!data) return <div style={{ padding: "2rem", color: "#64748b" }}>Loading...</div>;
    const { user, stats } = data;

    return (
        <div style={s.page}>
            <div style={s.card}>
                <div style={s.avatar}>{user.username[0].toUpperCase()}</div>
                <div style={s.username}>{user.username}</div>
                {user.bio && <div style={s.bio}>{user.bio}</div>}
                <div style={s.statsRow}>
                    <div style={s.stat}><div style={s.statNum}>{stats.total}</div><div style={s.statLabel}>Solved</div></div>
                    <div style={s.stat}><div style={{ ...s.statNum, color: "#22c55e" }}>{stats.easy}</div><div style={s.statLabel}>Easy</div></div>
                    <div style={s.stat}><div style={{ ...s.statNum, color: "#f59e0b" }}>{stats.medium}</div><div style={s.statLabel}>Medium</div></div>
                    <div style={s.stat}><div style={{ ...s.statNum, color: "#ef4444" }}>{stats.hard}</div><div style={s.statLabel}>Hard</div></div>
                </div>
            </div>
            <div style={s.card}>
                <div style={s.sectionTitle}>Solved Problems</div>
                {user.solvedProblems?.length === 0 && <div style={{ color: "#64748b" }}>No problems solved yet.</div>}
                {user.solvedProblems?.map(p => (
                    <div key={p._id} style={s.row}>
                        <span>{p.title}</span>
                        <span style={s.tag(p.difficulty)}>{p.difficulty}</span>
                    </div>
                ))}
            </div>
        </div>
    );
}