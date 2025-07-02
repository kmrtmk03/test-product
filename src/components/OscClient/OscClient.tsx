import { useEffect, useRef, useState } from "react";

type OscClientProps = {
  webSocketUrl: string;
};

const OscClient = ({ webSocketUrl }: OscClientProps) => {
  const wsRef = useRef<WebSocket | null>(null);
  const [connectionStatus, setConnectionStatus] = useState("未接続");

  useEffect(() => {
    setConnectionStatus("接続中...");
    const ws = new WebSocket(webSocketUrl);
    wsRef.current = ws;

    ws.onopen = () => {
      console.log("WebSocket 接続成功");
      setConnectionStatus("接続済み");
    };
    ws.onerror = (err) => {
      console.error("WebSocket エラー", err);
      setConnectionStatus("エラー");
    };
    ws.onclose = () => {
      console.log("WebSocket 切断");
      setConnectionStatus("切断");
    };

    return () => {
      ws.close();
    };
  }, [webSocketUrl]); // URLが変わったときに再接続されるように依存配列に追加

  const sendOscMessage = () => {
    const msg = {
      address: "/hello",
      args: [
        { type: "s", value: "Hello, OSC!" },
        { type: "f", value: 440.0 },
      ],
    };

    if (wsRef.current?.readyState === WebSocket.OPEN) {
      wsRef.current.send(JSON.stringify(msg));
      console.log("OSCメッセージを送信しました");
    } else {
      console.warn("WebSocket未接続");
    }
  };

  return (
    <div>
      <h2>OSC送信テスト</h2>
      <p>WebSocket URL: {webSocketUrl}</p>
      <p>接続状況: {connectionStatus}</p>
      <button onClick={sendOscMessage}>OSCを送る</button>
    </div>
  );
};

export default OscClient;