export default function UsersList({ users }: any) {
  const unique = Object.values(
    users.reduce((acc: any, user: any) => {
      acc[user.name] = user;
      return acc;
    }, {})
  );

  return (
    <div >
      <h2>Users</h2>

      {unique.map((u: any) => (
        <ul key={u.name}>
          <li style={{ textAlign: 'left' }}>
            <span style={{ color: `${u.online ? 'green' : 'red'}` }}>{u.name}
            </span></li>
        </ul>
      ))}
    </div>
  );
}