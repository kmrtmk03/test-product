/* eslint-disable @typescript-eslint/no-explicit-any */
import fs from "node:fs";
import https from "node:https";
import { WebSocketServer, WebSocket } from "ws";
import osc from "osc";

// ===== HTTPS サーバー =====
const server = https.createServer({
  cert: fs.readFileSync("./cert.pem"),
  key: fs.readFileSync("./key.pem"),
}, (req, res) => {
  res.writeHead(200, { 'Content-Type': 'text/plain' });
  res.end("WSS server is running\n");
});

// ===== WSS (WebSocket over HTTPS) =====
const wss = new WebSocketServer({ server });
server.listen(8081, "0.0.0.0", () => {
  console.log("WSS server running on wss://192.168.1.17:8081");
});

// ===== OSC (UDP) ポート =====
const udpPort = new osc.UDPPort({
  localAddress: "0.0.0.0",
  localPort: 57121,       // 受信用
  remoteAddress: "127.0.0.1",
  remotePort: 57120,      // 送信先 (SuperCollider など)
  metadata: true,         // 型情報付き
});
udpPort.open();

// ----- WSS → OSC -----
wss.on("connection", (ws) => {
  ws.on("message", (data) => {
    try {
      const msg = JSON.parse(data.toString());
      if (isOscMessage(msg)) udpPort.send(msg);
      console.log(msg)
    } catch (err) {
      console.error("Invalid message:", err);
    }
  });
});

// ----- OSC → WSS -----
udpPort.on("message", (oscMsg) => {
  const json = JSON.stringify(oscMsg);
  wss.clients.forEach((client) => {
    if (client.readyState === WebSocket.OPEN) client.send(json);
  });
});

// 型ガード (最低限)
function isOscMessage(x: any): x is osc.OscMessage {
  return typeof x?.address === "string" && Array.isArray(x?.args);
}