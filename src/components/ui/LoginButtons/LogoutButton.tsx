import { useAuth0 } from "@auth0/auth0-react";

const LogoutButton = () => {
  const { logout } = useAuth0();
  const logoutUrl = import.meta.env.VITE_AUTH0_LOGOUT_URL;

  return (
    <button
      onClick={() => logout({ logoutParams: { returnTo: logoutUrl } })}
      className="btn btn-primary"
    >
      Cerrar sesión
    </button>
  );
};

export default LogoutButton;
