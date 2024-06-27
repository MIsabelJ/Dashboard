import { useAuth0 } from "@auth0/auth0-react";
import "./Profile.css";

const Profile = () => {
  const { user, isAuthenticated, isLoading, logout } = useAuth0();
  if (isLoading) {
    return <div>Loading ...</div>;
  }

  const handleLogout = () => {
    localStorage.clear();
    const logoutUrl = import.meta.env.VITE_AUTH0_LOGOUT_URL || window.location.origin;
    logout({ 
      logoutParams: { 
        returnTo: logoutUrl 
      } 
    });
  };

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
            onClick={handleLogout}
          >
            Cerrar sesión
          </button>
        </div>
      </div>
    )
  );
};

export default Profile;