import { useAuth0 } from "@auth0/auth0-react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
// Ajusta la ruta según tu estructura

export const useServiceHeaders = (ServiceClass: any, url: string) => {
  const [serviceInstance, setServiceInstance] = useState<any>(null);
  const { getAccessTokenSilently } = useAuth0();
  const navigate = useNavigate();
  const API_URL = import.meta.env.VITE_API_URL;

  useEffect(() => {
    const fetchToken = async () => {
      try {
        const accessToken = await getAccessTokenSilently({
          authorizationParams: {
            audience: import.meta.env.VITE_AUTH0_AUDIENCE,
          },
        });

        const instance = new ServiceClass(`${API_URL}/${url}`, accessToken);
        setServiceInstance(instance);
      } catch (error) {
        console.error("Error getting access token", error);
        navigate("/login");
      }
    };

    fetchToken();
  }, [getAccessTokenSilently, ServiceClass, navigate]);

  return serviceInstance;
};
