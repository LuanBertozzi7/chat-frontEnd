import React, { useEffect, useState } from "react";
import { View, Button, Text } from "react-native";
import { router } from "expo-router";
import { apiFetch } from "../src/services/api";
import { getToken, logout } from "../src/services/auth";

export default function Rooms() {
  const [rooms, setRooms] = useState([]);

  useEffect(() => {
    (async () => {
      const token = await getToken();
      const data = await apiFetch("/rooms", { token });
      setRooms(data.rooms || []);
    })();
  }, []);

  async function onLogout() {
    await logout();
    router.replace("/login");
  }

  return (
    <View style={{ padding: 16, gap: 12 }}>
      <Text style={{ fontSize: 18, fontWeight: "600" }}>Salas</Text>

      {rooms.map((r) => (
        <Button
          key={r.id}
          title={r.name}
          onPress={() =>
            router.push({
              pathname: "/chat",
              params: { roomId: r.id, roomName: r.name },
            })
          }
        />
      ))}

      <Button title="Sair" onPress={onLogout} />
    </View>
  );
}
