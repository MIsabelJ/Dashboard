import { useAuth0 } from "@auth0/auth0-react";

// TODO: SECCIÓN DEL PERFIL DEL USUARIO QUE SE LOGUEÓ
const Profile = () => {
  const { user, isAuthenticated, isLoading } = useAuth0();

  if (isLoading) {
    return <div>Loading ...</div>;
  }

  return (
    isAuthenticated && (
      <div>
        <img src={user?.picture} alt={user?.name} />
        <h2>{user?.name}</h2>
        <p>{user?.email}</p>
      </div>
    )
  );
};

export default Profile;
