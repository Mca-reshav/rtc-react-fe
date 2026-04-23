import { useEffect, useState } from "react";
import { useParams, useLocation } from "react-router-dom";
import { socket } from "../socket/socket";
import Editor from "../components/Editor";
import ActivityFeed from "../components/ActivityFeed";
import UsersList from "../components/UsersList";
import { getSession } from "../services/api";
import "../App.css";

export default function Room() {
  const { sessionId } = useParams();
  const location = useLocation();
  const name = location.state?.name;

  const [users, setUsers] = useState<any[]>([]);
  const [messages, setMessages] = useState<any[]>([]);
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(true);

  const activeEventObj = {
    RECEIVE: "receive_message",
    UPDATE: "editor_update",
    ERROR: "connect_error",
    PRESENCE: "presence_update",
  } as const;

  const passiveEventObj = {
    JOIN: "join_session",
    LEAVE: "leave_session"
  } as const;

  useEffect(() => {
    const init = async () => {
      try {
        const res = await getSession(sessionId!);
        const session = res.data;

        setContent(session.content || "");
        setUsers(session.users || []);
        setMessages(session.messages || []);
      } catch (err) {
        console.log("Failed to load session", err);
      } finally {
        setLoading(false);
      }
    };

    if (sessionId) init();
  }, [sessionId]);

  useEffect(() => {
    const handleUnload = () => {
      socket.emit(passiveEventObj.LEAVE, {
        sessionId,
        name,
      });
    };

    window.addEventListener("beforeunload", handleUnload);

    return () => {
      window.removeEventListener("beforeunload", handleUnload);
    };
  }, [sessionId, name]);

  useEffect(() => {
    if (!sessionId || !name) return;

    socket.connect();

    const onConnect = () => {
      console.log("connected", socket.id);

      socket.emit(passiveEventObj.JOIN, {
        sessionId,
        user: { name },
      });
    };

    const onError = (err: any) => console.log("error", err.message),
      onMessage = (msg: any) => setMessages((prev) => [...prev, msg]),
      onUpdate = (data: string) => setContent(data),
      onPresence = (users: any[]) => setUsers(users);

    socket.on("connect", onConnect);
    socket.on(activeEventObj.ERROR, onError);
    socket.on(activeEventObj.RECEIVE, onMessage);
    socket.on(activeEventObj.UPDATE, onUpdate);
    socket.on(activeEventObj.PRESENCE, onPresence);

    return () => {
      socket.off("connect", onConnect);
      socket.off(activeEventObj.ERROR, onError);
      socket.off(activeEventObj.RECEIVE, onMessage);
      socket.off(activeEventObj.UPDATE, onUpdate);
      socket.off(activeEventObj.PRESENCE, onPresence);
      socket.disconnect();
    };
  }, [sessionId, name]);

  if (loading) return <div>Loading session...</div>;

  return (
    <div className="roomContainer">
      <UsersList users={users} />
      <Editor content={content} setContent={setContent} sessionId={sessionId!} />
      <ActivityFeed messages={messages} />
    </div>
  );
}

