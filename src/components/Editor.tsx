import { socket } from "../socket/socket";

export default function Editor({
  content,
  setContent,
  sessionId,
}: any) {
  const handleChange = (e: any) => {
    const value = e.target.value;
    setContent(value);
    socket.emit("editor_update", { sessionId, content: value });
  };

  return (
    <div>
      <h2>Text area</h2>
      <textarea name='text' value={content} onChange={handleChange} rows={10} cols={50} />
    </div>
  );
}