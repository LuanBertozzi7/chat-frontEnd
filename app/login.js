import { router } from "expo-router";
import { useState } from "react";
import { Button, Text, TextInput, View } from "react-native";
import { login } from "../src/services/auth";

export default function Login() {
  const [email, setEmail] = useState("luan@teste.com");
  const [password, setPassword] = useState("123");
  const [err, setErr] = useState("");

  async function onLogin() {
    setErr("");
    try {
      await login(email, password);
      router.replace("/rooms");
    } catch (e) {
      setErr(String(e.message || e));
    }
  }

  return (
    <View style={{ padding: 16, gap: 12 }}>
      <Text>Email</Text>
      <TextInput
        value={email}
        onChangeText={setEmail}
        autoCapitalize="none"
        style={{ borderWidth: 1, padding: 10, borderRadius: 8 }}
      />

      <Text>Senha</Text>
      <TextInput
        value={password}
        onChangeText={setPassword}
        secureTextEntry
        style={{ borderWidth: 1, padding: 10, borderRadius: 8 }}
      />

      {err ? <Text style={{ color: "red" }}>{err}</Text> : null}
      <Button title="Entrar" onPress={onLogin} />
    </View>
  );
}
