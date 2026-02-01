import { useLocalSearchParams } from "expo-router";
import { useEffect, useRef, useState } from "react";
import { Button, FlatList, Text, TextInput, View } from "react-native";
import { apiFetch } from "../src/services/api";
import { getToken } from "../src/services/auth";
import { createSocket } from "../src/services/socket";

export default function Chat() {
  const { roomId, roomName } = useLocalSearchParams();
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState("");
  const socketRef = useRef(null);

  useEffect(() => {
    let socket;

    (async () => {
      const token = await getToken();

      const history = await apiFetch(`/rooms/${roomId}/messages?limit=50`, {
        token,
      });
      setMessages(history.messages || []); // no backend tá em ordem antiga->nova? se não, ajusta aqui

      // socket
      socket = createSocket(token);
      socketRef.current = socket;

      socket.on("connect", () => {
        socket.emit("joinRoom", { roomId });
      });

      socket.on("message", (msg) => {
        setMessages((prev) => [...prev, msg]);
      });
    })();

    return () => socket?.disconnect();
  }, [roomId]);

  function send() {
    const trimmed = String(text || "").trim();
    if (!trimmed) return;
    socketRef.current?.emit("sendMessage", { roomId, text: trimmed });
    setText("");
  }

  return (
    <View style={{ flex: 1, padding: 12 }}>
      <Text style={{ fontSize: 18, fontWeight: "600", marginBottom: 8 }}>
        {roomName || "Chat"}
      </Text>

      <FlatList
        data={messages}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View
            style={{
              padding: 10,
              borderWidth: 1,
              borderRadius: 10,
              marginBottom: 8,
            }}
          >
            <Text style={{ fontWeight: "600" }}>
              {item.user?.name || "Anon"}
            </Text>
            <Text>{item.text}</Text>
          </View>
        )}
      />

      <View style={{ flexDirection: "row", gap: 8 }}>
        <TextInput
          value={text}
          onChangeText={setText}
          placeholder="Mensagem..."
          style={{ flex: 1, borderWidth: 1, borderRadius: 10, padding: 10 }}
        />
        <Button title="Enviar" onPress={send} />
      </View>
    </View>
  );
}
