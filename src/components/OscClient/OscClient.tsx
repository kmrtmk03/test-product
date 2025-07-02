import { useEffect, useRef } from "react";

type OscClientProps = {
  webSocketUrl: string;
};

const OscClient = ({ webSocketUrl }: OscClientProps) => {
  const wsRef = useRef<WebSocket | null>(null);

  useEffect(() => {
    const ws = new WebSocket(webSocketUrl);
    wsRef.current = ws;

    ws.onopen = () => console.log("WebSocket 接続成功");
    ws.onerror = (err) => console.error("WebSocket エラー", err);
    ws.onclose = () => console.log("WebSocket 切断");

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
      <button onClick={sendOscMessage}>OSCを送る</button>
    </div>
  );
};

export default OscClient;