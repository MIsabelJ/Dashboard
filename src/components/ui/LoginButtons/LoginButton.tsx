import { useAuth0 } from "@auth0/auth0-react";


const LoginButton = () => {
    const { loginWithRedirect } = useAuth0();
    return (
        <button
            onClick={() => loginWithRedirect({
                appState: { returnTo: window.location.origin },
            })}
            className="btn btn-primary"
        >
            INGRESO
        </button>
    );
};
export default LoginButton