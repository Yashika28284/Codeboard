import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import Editor from "@monaco-editor/react";
import { useAuth } from "../context/AuthContext";

const s = {
    page: { display: "flex", height: "calc(100vh - 60px)", overflow: "hidden" },
    left: { width: "45%", overflowY: "auto", padding: "1.5rem", borderRight: "1px solid #2d3148", background: "#0f1117" },
    right: { flex: 1, display: "flex", flexDirection: "column", background: "#0f1117" },
    title: { fontSize: "1.4rem", fontWeight: 700, color: "#f1f5f9", marginBottom: "0.5rem" },
    diffBadge: (d) => ({ display: "inline-block", color: { Easy: "#22c55e", Medium: "#f59e0b", Hard: "#ef4444" }[d], background: { Easy: "#052e16", Medium: "#2d1a00", Hard: "#2d0a0a" }[d], padding: "0.2rem 0.7rem", borderRadius: "20px", fontSize: "0.8rem", fontWeight: 600, marginBottom: "1rem" }),
    desc: { color: "#94a3b8", lineHeight: 1.7, marginBottom: "1.5rem", whiteSpace: "pre-wrap" },
    sectionTitle: { color: "#f1f5f9", fontWeight: 600, marginBottom: "0.5rem", fontSize: "0.95rem" },
    example: { background: "#1a1d2e", border: "1px solid #2d3148", borderRadius: "8px", padding: "1rem", marginBottom: "0.75rem", fontFamily: "monospace", fontSize: "0.85rem", color: "#94a3b8" },
    toolbar: { display: "flex", alignItems: "center", gap: "0.75rem", padding: "0.75rem 1rem", borderBottom: "1px solid #2d3148", background: "#1a1d2e" },
    select: { background: "#0f1117", border: "1px solid #2d3148", color: "#e2e8f0", borderRadius: "6px", padding: "0.35rem 0.6rem", fontSize: "0.85rem" },
    btn: { background: "#3b82f6", color: "#fff", border: "none", padding: "0.4rem 1.2rem", borderRadius: "6px", cursor: "pointer", fontSize: "0.85rem", fontWeight: 600 },
    solvedBtn: (solved) => ({ background: solved ? "#052e16" : "transparent", color: solved ? "#22c55e" : "#64748b", border: `1px solid ${solved ? "#22c55e" : "#2d3148"}`, padding: "0.4rem 1rem", borderRadius: "6px", cursor: "pointer", fontSize: "0.85rem", marginLeft: "auto" }),
};

export default function ProblemDetail() {
    const { slug } = useParams();
    const { user } = useAuth();
    const [problem, setProblem] = useState(null);
    const [language, setLanguage] = useState("javascript");
    const [code, setCode] = useState("");
    const [solved, setSolved] = useState(false);

    useEffect(() => {
        axios.get(`/api/problems/${slug}`).then(r => {
            setProblem(r.data);
            setCode(r.data.starterCode?.javascript || "");
        });
    }, [slug]);

    useEffect(() => {
        if (problem && user) {
            const solvedIds = user.solvedProblems?.map(p => p._id || p) || [];
            setSolved(solvedIds.includes(problem._id));
        }
    }, [problem, user]);

    const handleLangChange = (e) => {
        setLanguage(e.target.value);
        setCode(problem.starterCode?.[e.target.value] || "");
    };

    const toggleSolved = async () => {
        if (!user) return;
        try {
            const r = await axios.post(`/api/problems/${problem._id}/solve`);
            setSolved(r.data.solved);
        } catch { }
    };

    if (!problem) return <div style={{ padding: "2rem", color: "#94a3b8" }}>Loading...</div>;

    return (
        <div style={s.page}>
            <div style={s.left}>
                <div style={s.title}>{problem.title}</div>
                <div style={s.diffBadge(problem.difficulty)}>{problem.difficulty}</div>
                <p style={s.desc}>{problem.description}</p>
                {problem.examples?.length > 0 && (
                    <>
                        <div style={s.sectionTitle}>Examples</div>
                        {problem.examples.map((ex, i) => (
                            <div key={i} style={s.example}>
                                <div><strong>Input:</strong> {ex.input}</div>
                                <div><strong>Output:</strong> {ex.output}</div>
                                {ex.explanation && <div><strong>Explanation:</strong> {ex.explanation}</div>}
                            </div>
                        ))}
                    </>
                )}
                {problem.constraints?.length > 0 && (
                    <>
                        <div style={s.sectionTitle}>Constraints</div>
                        <ul style={{ color: "#64748b", paddingLeft: "1.2rem", lineHeight: 1.8 }}>
                            {problem.constraints.map((c, i) => <li key={i} style={{ fontFamily: "monospace", fontSize: "0.85rem" }}>{c}</li>)}
                        </ul>
                    </>
                )}
            </div>
            <div style={s.right}>
                <div style={s.toolbar}>
                    <select style={s.select} value={language} onChange={handleLangChange}>
                        <option value="javascript">JavaScript</option>
                        <option value="python">Python</option>
                        <option value="java">Java</option>
                        <option value="cpp">C++</option>
                    </select>
                    <button style={s.btn} onClick={() => setCode(problem.starterCode?.[language] || "")}>Reset</button>
                    {user && <button style={s.solvedBtn(solved)} onClick={toggleSolved}>{solved ? "✓ Solved" : "Mark Solved"}</button>}
                </div>
                <Editor height="100%" language={language === "cpp" ? "cpp" : language} value={code} onChange={v => setCode(v || "")}
                    theme="vs-dark" options={{ fontSize: 14, minimap: { enabled: false }, padding: { top: 16 } }} />
            </div>
        </div>
    );
}