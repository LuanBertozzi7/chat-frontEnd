import * as SecureStore from "expo-secure-store";
import { apiFetch } from "./api";

const TOKEN_KEY = "accessToken";

export async function login(email, password) {
  const data = await apiFetch("/auth/login", {
    method: "POST",
    body: { email, password },
  });

  // DEBUG (depois você remove)
  console.log("LOGIN RESPONSE ->", data);

  const token = data?.accessToken;

  if (typeof token !== "string" || token.length < 10) {
    throw new Error("Login não retornou accessToken válido");
  }

  await SecureStore.setItemAsync(TOKEN_KEY, token);
  return token;
}

export async function getToken() {
  return SecureStore.getItemAsync(TOKEN_KEY);
}

export async function logout() {
  await SecureStore.deleteItemAsync(TOKEN_KEY);
}
