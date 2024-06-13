export const ObtainToken = async (getAccessTokenSilently: any) => {
    try {
        const token = await getAccessTokenSilently({
            authorizationParams: {
                audience: import.meta.env.VITE_AUTH0_AUDIENCE,
            },
        });
        console.log("token: ", token);
        return token
    } catch (error) {
        console.error(error);
        return null
    }
}