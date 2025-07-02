import osc from "osc";
import { WebSocketServer } from 'ws';
const wss = new WebSocketServer({ port: 8081 });
console.log("WebSocket server running on ws://localhost:8081");

// OSC 送信用 UDP ポート
const udpPort = new osc.UDPPort({
  localAddress: "0.0.0.0",
  localPort: 57121,
  remoteAddress: "127.0.0.1",
  remotePort: 57120,
  metadata: true,
});
udpPort.open();

// WebSocket → UDP OSC
wss.on("connection", (ws) => {
  console.log("クライアント接続");

  ws.on("message", (msg) => {
    try {
      const json = JSON.parse(msg.toString());
      udpPort.send(json); // OSC パケットとしてそのまま送信
      console.log("OSC送信:", json);
    } catch (e) {
      console.error("メッセージ変換エラー:", e);
    }
  });
});