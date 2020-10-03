import React, { useEffect, useState } from "react";
import "./App.css";
import MainPage from "./Pages/Main";
import LoadingPage from "./Pages/Loading";
import ErrorPage from "./Pages/Error";
import mqtt from "mqtt";

export default function App() {
  const [mqttClient, setMqttClinet] = useState<mqtt.MqttClient | undefined>(undefined);
  const [status, setStatus] = useState<"waiting" | "connected" | "disconnected">("waiting");

  const sendMessage = (channel: string, msg: string) => {
    if (mqttClient !== undefined) mqttClient.publish(channel, msg);
  };

  useEffect(() => {
    const client = mqtt.connect("wss://stastnyj.duckdns.org:9001/mqtt");

    client.on("connect", () => {
      setStatus("connected");
    });

    client.on("disconnect", () => setStatus("disconnected"));

    setMqttClinet(client);
  }, []);

  return (
    <>
      {status === "waiting" ? <LoadingPage /> : status === "connected" ? <MainPage sendMessage={sendMessage} /> : <ErrorPage />}
    </>
  );
}
