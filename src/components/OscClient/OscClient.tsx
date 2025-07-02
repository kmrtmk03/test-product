import { useEffect, useRef, useState } from "react";

type OscClientProps = {
  webSocketUrl: string;
};

const OscClient = ({ webSocketUrl }: OscClientProps) => {
  const wsRef = useRef<WebSocket | null>(null);
  const [connectionStatus, setConnectionStatus] = useState("未接続");
  const [lastMessage, setLastMessage] = useState<string | null>(null);


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

    ws.onmessage = (event) => {
      console.log("WebSocket メッセージ受信:", event.data);
      setLastMessage(event.data);

      // 送信側がJSONを送信しているため、受信データもJSONであると想定しパースします。
      try {
        const message = JSON.parse(event.data);
        console.log("受信したOSCメッセージ (パース後):", message);
      } catch (e) {
        // JSONとしてパースできなかった場合は、最初のconsole.logで生データが表示されます。
        console.log("受信したOSCメッセージ (パースエラー):", event.data, e);
      }
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
      <p>最終受信メッセージ: {lastMessage || "なし"}</p>
      <button onClick={sendOscMessage}>OSCを送る</button>
    </div>
  );
};

export default OscClient;