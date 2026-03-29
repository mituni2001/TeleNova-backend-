import { useEffect } from "react";
import { useRouter } from "expo-router";
import { getToken } from "./services/auth"; // auth service එකේ getToken function

export default function Index() {
  const router = useRouter();

  useEffect(() => {
    const checkAuth = async () => {
      const token = await getToken(); // check if user logged in
      if (token) router.replace("/tabs/home"); // already logged in → go home
      else router.replace("/auth/welcome"); // else go login page
    };
    checkAuth();
  }, []);

  return null; // no UI needed, just redirect
}

