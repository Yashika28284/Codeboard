import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const s = {
    page: { maxWidth: "900px", margin: "0 auto", padding: "2rem" },
    header: { display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "2rem" },
    title: { fontSize: "1.8rem", fontWeight: 700, color: "#f1f5f9" },
    sub: { color: "#64748b", marginTop: "0.3rem" },
    btn: { background: "#3b82f6", color: "#fff", border: "none", padding: "0.65rem 1.5rem", borderRadius: "8px", cursor: "pointer", fontWeight: 600, fontSize: "0.95rem" },
    grid: { display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))", gap: "1rem" },
    card: { background: "#1a1d2e", border: "1px solid #2d3148", borderRadius: "12px", padding: "1.5rem", cursor: "pointer", transition: "border-color 0.2s" },
    cardTitle: { fontWeight: 600, color: "#f1f5f9", marginBottom: "0.4rem" },
    host: { color: "#64748b", fontSize: "0.85rem", marginBottom: "0.75rem" },
    badge: { background: "#1e3a5f", color: "#60a5fa", padding: "0.2rem 0.6rem", borderRadius: "4px", fontSize: "0.75rem" },
    modal: { position: "fixed", inset: 0, background: "rgba(0,0,0,0.7)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 200 },
    modalBox: { background: "#1a1d2e", border: "1px solid #2d3148", borderRadius: "12px", padding: "2rem", width: "100%", maxWidth: "380px" },
    label: { display: "block", color: "#94a3b8", fontSize: "0.85rem", marginBottom: "0.4rem" },
    input: { width: "100%", background: "#0f1117", border: "1px solid #2d3148", borderRadius: "8px", padding: "0.65rem 1rem", color: "#e2e8f0", fontSize: "0.95rem", boxSizing: "border-box", marginBottom: "1rem" },
    row: { display: "flex", gap: "0.75rem" },
    cancelBtn: { flex: 1, background: "transparent", color: "#94a3b8", border: "1px solid #2d3148", padding: "0.65rem", borderRadius: "8px", cursor: "pointer" },
};

export default function Rooms() {
    const navigate = useNavigate();
    const { user } = useAuth();
    const [rooms, setRooms] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [roomName, setRoomName] = useState("");

    const fetchRooms = () => axios.get("/api/rooms").then(r => setRooms(r.data)).catch(() => { });
    useEffect(() => { fetchRooms(); }, []);

    const createRoom = async () => {
        if (!roomName.trim()) return;
        try {
            const r = await axios.post("/api/rooms", { name: roomName });
            setShowModal(false); setRoomName("");
            navigate(`/rooms/${r.data.roomId}`);
        } catch { }
    };

    return (
        <div style={s.page}>
            <div style={s.header}>
                <div>
                    <div style={s.title}>Rooms</div>
                    <div style={s.sub}>Join an active room or create your own</div>
                </div>
                <button style={s.btn} onClick={() => setShowModal(true)}>+ Create Room</button>
            </div>
            <div style={s.grid}>
                {rooms.map(room => (
                    <div key={room._id} style={s.card}
                        onMouseEnter={e => e.currentTarget.style.borderColor = "#3b82f6"}
                        onMouseLeave={e => e.currentTarget.style.borderColor = "#2d3148"}
                        onClick={() => navigate(`/rooms/${room.roomId}`)}>
                        <div style={s.cardTitle}>{room.name}</div>
                        <div style={s.host}>Host: {room.host?.username}</div>
                        <span style={s.badge}>{room.participants?.length || 0} online</span>
                        {room.problem && <span style={{ ...s.badge, marginLeft: "0.4rem", background: "#1e2d1e", color: "#86efac" }}>{room.problem.title}</span>}
                    </div>
                ))}
                {rooms.length === 0 && <div style={{ color: "#64748b", gridColumn: "1/-1", padding: "2rem 0" }}>No active rooms. Create one!</div>}
            </div>

            {showModal && (
                <div style={s.modal} onClick={() => setShowModal(false)}>
                    <div style={s.modalBox} onClick={e => e.stopPropagation()}>
                        <div style={{ fontSize: "1.2rem", fontWeight: 700, color: "#f1f5f9", marginBottom: "1.5rem" }}>Create a Room</div>
                        <label style={s.label}>Room Name</label>
                        <input style={s.input} value={roomName} onChange={e => setRoomName(e.target.value)} placeholder="e.g. Graph Problems Session" autoFocus />
                        <div style={s.row}>
                            <button style={s.cancelBtn} onClick={() => setShowModal(false)}>Cancel</button>
                            <button style={{ ...s.btn, flex: 1 }} onClick={createRoom}>Create</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}