import Img from 'next/image';

export default function UserProfile({ user }: { user: any }) {
  return (
    <div className="box-center">
      <Img alt={user.displayName} src={user.photoURL || '/hacker.png'} width={150} height={150} objectFit="cover" className="card-img-center" />
      <p>
        <i>@{user.username}</i>
      </p>
      <h1>{user.displayName || 'Anonymous User'}</h1>
    </div>
  );
}