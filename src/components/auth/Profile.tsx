// import React, { useEffect, useState } from "react";
// import { useAuth0 } from "@auth0/auth0-react";
// // import jwt_decode from "jwt-decode";

// const Profile = () => {
//   const { user, getAccessTokenSilently } = useAuth0();
//   const [roles, setRoles] = useState([]);

//   useEffect(() => {
//     const getUserRoles = async () => {
//       try {
//         const accessToken = await getAccessTokenSilently();
//         // const decodedToken = jwt_decode(accessToken);
//         const roles =
//           // decodedToken["https://your-app-namespace.com/roles"] || [];
//           setRoles(roles);
//       } catch (e) {
//         console.error(e);
//       }
//     };

//     getUserRoles();
//   }, [getAccessTokenSilently]);

//   return (
//     <div>
//       <h2>User Profile</h2>
//       <p>Name: {user?.name}</p>
//       <p>Email: {user?.email}</p>
//       <p>Roles: {roles.join(", ")}</p>
//     </div>
//   );
// };

// export default Profile;
