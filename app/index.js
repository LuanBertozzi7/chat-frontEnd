import { router } from "expo-router";
import { useEffect } from "react";
import { getToken } from "../src/services/auth";

export default function Index() {
  useEffect(() => {
    (async () => {
      const token = await getToken();
      router.replace(token ? "/rooms" : "/login");
    })();
  }, []);

  return null;
}
