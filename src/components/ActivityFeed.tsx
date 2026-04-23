export default function ActivityFeed({ messages }: any) {
  const uniqueMessages = Array.from(
    new Map(
      messages.map((item: { name: string, message: string }) => [
        `${item.name}-${item.message}`, item
      ])
    ).values()
  );

  return (
    <div>
      <h2>Activity</h2>

      {uniqueMessages.length === 0 && (
        <p>No activity yet</p>
      )}

      {uniqueMessages.map((m: any, i: number) => (
        <ul key={i} style={{ textAlign: 'left' }}>
          <li>{m.message}</li>
        </ul>
      ))}
    </div>
  );
}