import { withAuthenticationRequired } from "@auth0/auth0-react";

type Props = {
  component: React.ComponentType<any>;
  [key: string]: any;
};

// Con lo de Luciano esto queda sin uso

export const PrivateRoute = ({ component, ...rest }: Props) => {
  const Component = withAuthenticationRequired(component, {
    onRedirecting: () => (
      <div>
        <div>Redireccionando...</div>
      </div>
    ),
  });

  return <Component {...rest} />;
};
