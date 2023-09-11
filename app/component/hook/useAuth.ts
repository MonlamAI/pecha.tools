import { useFetcher } from "@remix-run/react";
import webAuth from "auth0-js";
import { useState } from "react";

export function useAuth0(config: any) {
  const [auth0Client] = useState(new webAuth.WebAuth(config));

  let fetcher = useFetcher();

  // Define methods that will be exposed through the hook
  const handleAuthentication = async () => {
    return new Promise((resolve, reject) => {
      auth0Client.parseHash((err, authResult) => {
        if (authResult && authResult.accessToken && authResult.idToken) {
          fetcher.submit(
            { user: JSON.stringify(authResult.idTokenPayload) },
            {
              method: "POST",
            }
          );
          resolve(authResult);
        } else if (err) {
          reject(err);
        } else {
          resolve("error");
        }
      });
    });
  };

  const passwordlessLogin = async (email) => {
    return new Promise((resolve, reject) => {
      auth0Client.passwordlessStart(
        {
          connection: "email",
          send: "code",
          email: email,
        },
        async function (err, res) {
          if (err) {
            reject(err);
          } else {
            // route to password field component
            resolve(res.email);
          }
        }
      );
    });
  };
  const verifyPasswordlessCode = async (email: string, code: number) => {
    return new Promise((resolve, reject) => {
      auth0Client.passwordlessLogin(
        {
          connection: "email",
          email: email,
          verificationCode: code,
        },
        function (err, res) {
          if (err) {
            reject(err);
          } else {
            console.log(res);
            resolve(res);
          }
        }
      );
    });
  };
  const loginWithGoogle = () => {
    auth0Client.authorize({
      connection: "google-oauth2",
    });
  };

  const login = () => {
    auth0Client.authorize();
  };

  // Return the computed property and methods as an object
  return {
    handleAuthentication,
    loginWithGoogle,
    login,
    passwordlessLogin,
    verifyPasswordlessCode,
  };
}
