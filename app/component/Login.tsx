import { useLoaderData } from "@remix-run/react";
import { useAuth0 } from "./hook/useAuth";
import { FcGoogle } from "react-icons/fc";
import { Button } from "~/shadComponent/ui/button";

// If the user lands on this page, we redirect back to / if they are already logged in.

// This form would take us to the auth0 route, which would redirect to the Auth0 login page.

export default function Login() {
  let { env } = useLoaderData() as {
    env: { AUTH0_DOMAIN: string; AUTH0_CLIENT_ID: string; NODE_ENV: string };
  };
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
      id="login-btn"
      onClick={handleGoogleLogin}
      className="text-white w-fit mx-auto bg-blue-600 hover:bg-blue-700 transition-colors duration-200 px-4 py-2 rounded-md font-medium"
    >
      <FcGoogle className="text-xl mr-2" />
      <span className="text-sm font-medium">Sign in</span>
    </Button>
  );
}
