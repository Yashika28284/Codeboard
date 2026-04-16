import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const diffColor = { Easy: "#22c55e", Medium: "#f59e0b", Hard: "#ef4444" };

const s = {
    page: { maxWidth: "900px", margin: "0 auto", padding: "2rem" },
    header: { marginBottom: "2rem" },
    title: { fontSize: "1.8rem", fontWeight: 700, color: "#f1f5f9", marginBottom: "0.5rem" },
    sub: { color: "#64748b" },
    filters: { display: "flex", gap: "0.75rem", marginBottom: "1.5rem", flexWrap: "wrap" },
    select: { background: "#1a1d2e", border: "1px solid #2d3148", color: "#e2e8f0", borderRadius: "8px", padding: "0.5rem 0.75rem", fontSize: "0.9rem" },
    input: { background: "#1a1d2e", border: "1px solid #2d3148", color: "#e2e8f0", borderRadius: "8px", padding: "0.5rem 0.75rem", fontSize: "0.9rem", flex: 1 },
    table: { width: "100%", borderCollapse: "collapse" },
    th: { textAlign: "left", color: "#64748b", fontSize: "0.8rem", fontWeight: 600, padding: "0.75rem 1rem", borderBottom: "1px solid #2d3148", textTransform: "uppercase" },
    tr: { borderBottom: "1px solid #1e2235", cursor: "pointer", transition: "background 0.15s" },
    td: { padding: "0.9rem 1rem", color: "#e2e8f0", fontSize: "0.95rem" },
    diff: (d) => ({ color: diffColor[d], fontWeight: 600, fontSize: "0.85rem" }),
    tag: { background: "#1e2a3a", color: "#60a5fa", padding: "0.2rem 0.6rem", borderRadius: "4px", fontSize: "0.75rem", marginRight: "0.3rem" },
    check: { color: "#22c55e", fontSize: "1rem" },
};

export default function Problems() {
    const { user } = useAuth();
    const navigate = useNavigate();
    const [problems, setProblems] = useState([]);
    const [difficulty, setDifficulty] = useState("");
    const [search, setSearch] = useState("");

    useEffect(() => {
        axios.get(`/api/problems?difficulty=${difficulty}&search=${search}`)
            .then(r => setProblems(r.data.problems))
            .catch(() => { });
    }, [difficulty, search]);

    const solvedIds = user?.solvedProblems?.map(p => p._id || p) || [];

    return (
        <div style={s.page}>
            <div style={s.header}>
                <div style={s.title}>Problems</div>
                <div style={s.sub}>{problems.length} problems available</div>
            </div>
            <div style={s.filters}>
                <input style={s.input} placeholder="Search problems..." value={search} onChange={e => setSearch(e.target.value)} />
                <select style={s.select} value={difficulty} onChange={e => setDifficulty(e.target.value)}>
                    <option value="">All Difficulties</option>
                    <option value="Easy">Easy</option>
                    <option value="Medium">Medium</option>
                    <option value="Hard">Hard</option>
                </select>
            </div>
            <table style={s.table}>
                <thead>
                    <tr>
                        <th style={s.th}>#</th>
                        <th style={s.th}>Title</th>
                        <th style={s.th}>Difficulty</th>
                        <th style={s.th}>Tags</th>
                        <th style={s.th}>Status</th>
                    </tr>
                </thead>
                <tbody>
                    {problems.map((p, i) => (
                        <tr key={p._id} style={s.tr} onClick={() => navigate(`/problems/${p.slug}`)}
                            onMouseEnter={e => e.currentTarget.style.background = "#1a1d2e"}
                            onMouseLeave={e => e.currentTarget.style.background = "transparent"}>
                            <td style={s.td}>{p.leetcodeNumber || i + 1}</td>
                            <td style={s.td}>{p.title}</td>
                            <td style={s.td}><span style={s.diff(p.difficulty)}>{p.difficulty}</span></td>
                            <td style={s.td}>{p.tags?.slice(0, 2).map(t => <span key={t} style={s.tag}>{t}</span>)}</td>
                            <td style={s.td}>{solvedIds.includes(p._id) ? <span style={s.check}>✓</span> : ""}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}