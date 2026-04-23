import { useState } from "react";
import { createSession, joinSession } from "../services/api";
import { useNavigate } from "react-router-dom";
import '../App.css'
export default function Home() {
  const [name, setName] = useState("");
  const [sessionId, setSessionId] = useState("");
  const navigate = useNavigate();

  const base = { state: { name } },
    userName = { user: { name } }
  const handleCreate = async () => {
    if (!name) return alert("Enter name");
    if (sessionId) return alert("session ID not required");
    const res = await createSession({ ...userName });
    navigate(`/room/${res.data.sessionId}`, base);
  };

  const handleJoin = async () => {
    if (!name) return alert("Enter name");
    if (!sessionId) return alert("Enter session ID");
    await joinSession({
      sessionId,
      ...userName,
    });
    navigate(`/room/${sessionId}`, base);
  };

  return (
    <div className="homeContainer">
      <h2>Create | Join Session</h2>

      <input type='text' placeholder="Your Name" onChange={(e) => setName(e.target.value)} />
      <input type='text' placeholder="Session ID" onChange={(e) => setSessionId(e.target.value)} />
      <div>
        <button onClick={handleCreate}>Create Session</button>
        <button onClick={handleJoin}>Join Session</button>
      </div>
    </div>
  );
}