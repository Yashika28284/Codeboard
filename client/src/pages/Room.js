import React, { useEffect, useState, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { io } from "socket.io-client";
import Editor from "@monaco-editor/react";
import { useAuth } from "../context/AuthContext";

const s = {
    page: { display: "flex", flexDirection: "column", height: "calc(100vh - 60px)" },
    topbar: { display: "flex", alignItems: "center", gap: "1rem", padding: "0.6rem 1rem", background: "#1a1d2e", borderBottom: "1px solid #2d3148" },
    roomName: { fontWeight: 700, color: "#f1f5f9", fontSize: "1rem" },
    roomId: { color: "#64748b", fontSize: "0.8rem", fontFamily: "monospace" },
    users: { display: "flex", gap: "0.4rem", marginLeft: "auto" },
    userBadge: { background: "#1e3a5f", color: "#60a5fa", padding: "0.2rem 0.6rem", borderRadius: "4px", fontSize: "0.75rem" },
    closeBtn: { background: "#7f1d1d", color: "#fca5a5", border: "none", padding: "0.35rem 0.75rem", borderRadius: "6px", cursor: "pointer", fontSize: "0.8rem" },
    body: { display: "flex", flex: 1, overflow: "hidden" },
    editorWrap: { flex: 1, display: "flex", flexDirection: "column" },
    toolbar: { display: "flex", gap: "0.75rem", padding: "0.5rem 1rem", background: "#1a1d2e", borderBottom: "1px solid #2d3148" },
    select: { background: "#0f1117", border: "1px solid #2d3148", color: "#e2e8f0", borderRadius: "6px", padding: "0.3rem 0.6rem", fontSize: "0.85rem" },
    saveBtn: { background: "#1e3a5f", color: "#60a5fa", border: "none", padding: "0.3rem 0.75rem", borderRadius: "6px", cursor: "pointer", fontSize: "0.8rem" },
    sidebar: { width: "280px", display: "flex", flexDirection: "column", borderLeft: "1px solid #2d3148", background: "#0f1117" },
    chatHeader: { padding: "0.75rem 1rem", borderBottom: "1px solid #2d3148", color: "#94a3b8", fontSize: "0.85rem", fontWeight: 600 },
    messages: { flex: 1, overflowY: "auto", padding: "0.75rem" },
    msg: { marginBottom: "0.75rem" },
    msgUser: { color: "#3b82f6", fontSize: "0.8rem", fontWeight: 600 },
    msgText: { color: "#94a3b8", fontSize: "0.85rem", lineHeight: 1.4 },
    chatInput: { display: "flex", borderTop: "1px solid #2d3148", padding: "0.5rem" },
    input: { flex: 1, background: "#1a1d2e", border: "1px solid #2d3148", borderRadius: "6px", padding: "0.4rem 0.6rem", color: "#e2e8f0", fontSize: "0.85rem" },
    sendBtn: { background: "#3b82f6", color: "#fff", border: "none", padding: "0.4rem 0.75rem", borderRadius: "6px", marginLeft: "0.4rem", cursor: "pointer", fontSize: "0.8rem" },
};

export default function Room() {
    const { roomId } = useParams();
    const { user } = useAuth();
    const navigate = useNavigate();
    const [room, setRoom] = useState(null);
    const [code, setCode] = useState("// Start coding together!\n");
    const [language, setLanguage] = useState("javascript");
    const [users, setUsers] = useState([]);
    const [messages, setMessages] = useState([]);
    const [msgInput, setMsgInput] = useState("");
    const socketRef = useRef(null);
    const messagesEndRef = useRef(null);

    useEffect(() => {
        axios.get(`/api/rooms/${roomId}`).then(r => {
            setRoom(r.data);
            setCode(r.data.currentCode || "// Start coding together!\n");
            setLanguage(r.data.language || "javascript");
        }).catch(() => navigate("/rooms"));

        socketRef.current = io("http://localhost:5000");
        const socket = socketRef.current;

        socket.emit("join-room", { roomId, username: user?.username });
        socket.on("room-users", setUsers);
        socket.on("code-update", ({ code: c, language: l }) => { setCode(c); if (l) setLanguage(l); });
        socket.on("receive-message", (msg) => setMessages(prev => [...prev, msg]));
        socket.on("user-joined", ({ username }) => setMessages(prev => [...prev, { username: "System", message: `${username} joined`, timestamp: new Date().toISOString() }]));
        socket.on("user-left", ({ username }) => setMessages(prev => [...prev, { username: "System", message: `${username} left`, timestamp: new Date().toISOString() }]));

        return () => { socket.emit("leave-room", { roomId, username: user?.username }); socket.disconnect(); };
    }, [roomId]);

    useEffect(() => { messagesEndRef.current?.scrollIntoView({ behavior: "smooth" }); }, [messages]);

    const handleCodeChange = (val) => {
        setCode(val || "");
        socketRef.current?.emit("code-change", { roomId, code: val, language });
    };

    const handleLangChange = (e) => {
        setLanguage(e.target.value);
        socketRef.current?.emit("code-change", { roomId, code, language: e.target.value });
    };

    const saveCode = () => axios.patch(`/api/rooms/${roomId}/code`, { code, language }).catch(() => { });

    const sendMessage = () => {
        if (!msgInput.trim()) return;
        socketRef.current?.emit("send-message", { roomId, username: user?.username, message: msgInput });
        setMsgInput("");
    };

    const closeRoom = async () => {
        await axios.delete(`/api/rooms/${roomId}`);
        navigate("/rooms");
    };

    return (
        <div style={s.page}>
            <div style={s.topbar}>
                <div style={s.roomName}>{room?.name || "Loading..."}</div>
                <div style={s.roomId}>#{roomId}</div>
                <div style={s.users}>{users.map(u => <span key={u.socketId} style={s.userBadge}>{u.username}</span>)}</div>
                {room?.host?.username === user?.username && <button style={s.closeBtn} onClick={closeRoom}>Close Room</button>}
            </div>
            <div style={s.body}>
                <div style={s.editorWrap}>
                    <div style={s.toolbar}>
                        <select style={s.select} value={language} onChange={handleLangChange}>
                            <option value="javascript">JavaScript</option>
                            <option value="python">Python</option>
                            <option value="java">Java</option>
                            <option value="cpp">C++</option>
                        </select>
                        <button style={s.saveBtn} onClick={saveCode}>💾 Save</button>
                    </div>
                    <Editor height="100%" language={language === "cpp" ? "cpp" : language} value={code}
                        onChange={handleCodeChange} theme="vs-dark"
                        options={{ fontSize: 14, minimap: { enabled: false }, padding: { top: 16 } }} />
                </div>
                <div style={s.sidebar}>
                    <div style={s.chatHeader}>💬 Room Chat</div>
                    <div style={s.messages}>
                        {messages.map((m, i) => (
                            <div key={i} style={s.msg}>
                                <div style={{ ...s.msgUser, color: m.username === "System" ? "#64748b" : "#3b82f6" }}>{m.username}</div>
                                <div style={s.msgText}>{m.message}</div>
                            </div>
                        ))}
                        <div ref={messagesEndRef} />
                    </div>
                    <div style={s.chatInput}>
                        <input style={s.input} value={msgInput} onChange={e => setMsgInput(e.target.value)}
                            onKeyDown={e => e.key === "Enter" && sendMessage()} placeholder="Type a message..." />
                        <button style={s.sendBtn} onClick={sendMessage}>Send</button>
                    </div>
                </div>
            </div>
        </div>
    );
}