import { useAuth0 } from "@auth0/auth0-react";
import "./Profile.css";

const Profile = () => {
  const { user, isAuthenticated, isLoading } = useAuth0();

  if (isLoading) {
    return <div>Loading ...</div>;
  }

  return (
    isAuthenticated && (
      <div className="profile-container">
        <div className="profile-content">
          <img
            className="profile-picture"
            src={user?.picture}
            alt={user?.name}
          />
          <h2>{user?.name}</h2>
          <p>{user?.email}</p>
          <button
            className="logout-button"
            onClick={() => {
              window.location.reload(); // TODO: Agregar lógica para cerrar sesión
            }}
          >
            Cerrar sesión
          </button>
        </div>
      </div>
    )
  );
};

export default Profile;
