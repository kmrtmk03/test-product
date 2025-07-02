import { useEffect, useRef, useState, useCallback } from "react";

/** OscClientコンポーネントのPropsの型定義 */
type OscClientProps = {
  /** 接続先のWebSocketサーバーのURL (例: "wss://192.168.1.1:8081") */
  webSocketUrl: string;
};

/** OSCメッセージの型定義 */
type OscMessage = {
  address: string;
  args: { type: string; value: string | number }[];
};

/**
 * WebSocketサーバーに接続し、OSCのようなメッセージを送受信するReactコンポーネント。
 * 接続状況や最後に受信したメッセージを画面に表示します。
 * @param {OscClientProps} props コンポーネントのプロパティ
 */
const OscClient = ({ webSocketUrl }: OscClientProps) => {
  // WebSocketインスタンスを保持するためのuseRef。再レンダリング間でインスタンスを維持します。
  const wsRef = useRef<WebSocket | null>(null);
  // WebSocketの接続状況を管理・表示するためのuseState。
  const [connectionStatus, setConnectionStatus] = useState("未接続");
  // サーバーから受信した最後のメッセージを保存・表示するためのuseState。
  const [lastMessage, setLastMessage] = useState<string | null>(null);
  // 受信したOSCメッセージから抽出した値を保存するためのuseState。
  const [receivedValues, setReceivedValues] = useState<(string | number)[]>([]);
  // 受信したOSCメッセージのアドレスを保存するためのuseState。
  const [receivedAddress, setReceivedAddress] = useState<string | null>(null);

  /**
   * WebSocketサーバーからメッセージを受信したときに呼び出されるコールバック関数。
   * 受信データをパースし、コンソールに出力し、stateを更新します。
   * useCallbackでメモ化することで、不要な再生成を防ぎます。
   * @param {MessageEvent} event WebSocketのonmessageイベントオブジェクト
   */
  const handleWebSocketMessage = useCallback((event: MessageEvent) => {
    console.log("WebSocket メッセージ受信:", event.data);
    // 受信した生のメッセージデータをstateに保存して画面に表示する。
    setLastMessage(event.data);

    // 送信側がJSONを送信しているため、受信データもJSONであると想定しパースします。
    try {
      // 型アサーションを使用して、パース後のオブジェクトを型付けする
      const message: OscMessage = JSON.parse(event.data);
      console.log("受信したOSCメッセージ (パース後):", message);

      // 受信したメッセージからアドレスを抽出し、stateに保存する
      setReceivedAddress(message.address);

      // message.argsが配列であることを確認し、各要素からvalueを抽出する
      if (message && Array.isArray(message.args)) {
        const values = message.args.map((arg) => arg.value);
        // 抽出した値をstateに保存する
        setReceivedValues(values);
        console.log("抽出した値:", values);
      } else {
        setReceivedValues([]);
      }
    } catch (e) {
      // JSONとしてパースできなかった場合は、最初のconsole.logで生データが表示されます。
      // パースに失敗してもアプリがクラッシュしないようにエラーを捕捉する。
      console.log("受信したOSCメッセージ (パースエラー):", event.data, e);
      setReceivedAddress(null);
      setReceivedValues([]);
    }
  }, []); // set-state関数はReactによって安定性が保証されているため、依存配列は空です。

  /**
   * サンプルのOSCメッセージを作成し、WebSocketサーバーに送信する関数。
   * 接続が確立されている場合にのみメッセージを送信します。
   */
  const sendOscMessage = useCallback(() => {
    // 送信するOSC風のメッセージオブジェクト。
    const msg = {
      address: "/hello",
      args: [
        { type: "s", value: "Hello, OSC!" },
        { type: "f", value: 440.0 },
      ],
    };

    // WebSocket接続がOPEN状態であるかを確認してから送信する。
    if (wsRef.current?.readyState === WebSocket.OPEN) {
      wsRef.current.send(JSON.stringify(msg));
      console.log("OSCメッセージを送信しました");
    } else {
      console.warn(
        "WebSocketが接続されていません。メッセージは送信されませんでした。"
      );
    }
  }, []); // wsRefはReactによって不変性が保証されているため、依存配列に含める必要はありません。


  // WebSocket接続のライフサイクルを管理するためのuseEffectフック。
  // コンポーネントのマウント時、またはwebSocketUrlが変更された時に実行されます。
  useEffect(() => {
    setConnectionStatus("接続中...");
    const ws = new WebSocket(webSocketUrl);
    wsRef.current = ws;

    // WebSocket接続が正常に確立されたときのイベントハンドラ。
    ws.onopen = () => {
      console.log("WebSocket 接続成功");
      setConnectionStatus("接続済み");
    };
    // WebSocket接続でエラーが発生したときのイベントハンドラ。
    ws.onerror = (err) => {
      console.error("WebSocket エラー", err);
      setConnectionStatus("エラー");
    };
    
    // WebSocket接続が切断されたときのイベントハンドラ。
    ws.onclose = () => {
      console.log("WebSocket 切断");
      setConnectionStatus("切断");
    };

    // WebSocketサーバーからメッセージを受信したときのイベントハンドラ。
    ws.onmessage = handleWebSocketMessage;

    // コンポーネントのアンマウント時、またはwebSocketUrl変更時に実行されるクリーンアップ関数。
    // WebSocket接続を適切に閉じることで、メモリリークを防ぎます。
    return () => {
      ws.close();
    };
  }, [webSocketUrl, handleWebSocketMessage]); // 依存配列: webSocketUrlまたはメッセージハンドラが変更された場合にこのeffectを再実行する。

  // コンポーネントのUIをレンダリングする。
  return (
    <div>
      <h2>OSC送信テスト</h2>
      <p>WebSocket URL: {webSocketUrl}</p>
      <p>接続状況: {connectionStatus}</p>
      <p>最終受信メッセージ(生データ): {lastMessage || "なし"}</p>
      <p>受信したOSCアドレス: {receivedAddress || 'なし'}</p>
      <div>
        <p>受信した値:</p>
        {receivedValues.length > 0
          ? receivedValues.map((value, index) => (
              // 配列の各要素を個別のpタグでレンダリングします。
              // Reactでリストをレンダリングする際は、各要素にユニークな`key` propを付与する必要があります。
              <p key={index}>・{String(value)}</p>
            ))
          : <p>・なし</p>}
      </div>
      <button onClick={sendOscMessage}>OSCを送る</button>
    </div>
  );
};

export default OscClient;