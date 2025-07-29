import { useLoaderData } from "@remix-run/react";
import { useAuth0 } from "./hook/useAuth";
import { FcGoogle } from "react-icons/fc";
import { Button } from "~/shadComponent/ui/button";

// If the user lands on this page, we redirect back to / if they are already logged in.

// This form would take us to the auth0 route, which would redirect to the Auth0 login page.

export default function Login() {
  let { env } = useLoaderData();
  let { AUTH0_DOMAIN, AUTH0_CLIENT_ID, NODE_ENV } = env;
  let location =
    NODE_ENV === "production"
      ? "https://tools.monlam.ai"
      : "http://localhost:3000";
  const auth0Config = {
    domain: AUTH0_DOMAIN,
    clientID: AUTH0_CLIENT_ID,
    redirectUri: location + "/callback",
    responseType: "token id_token",
    scope: "email profile openid",
  };

  const { loginWithGoogle } = useAuth0(auth0Config);

  // Login with Google
  const handleGoogleLogin = () => {
    loginWithGoogle();
  };

  return (
    <Button
      onClick={handleGoogleLogin}
      className="text-white w-fit mx-auto bg-blue-600 hover:bg-blue-700 "
    >
      <FcGoogle className="text-xl" />
      <span className="text-lg font-semibold leading-6 ml-3">Google</span>
    </Button>
  );
}
