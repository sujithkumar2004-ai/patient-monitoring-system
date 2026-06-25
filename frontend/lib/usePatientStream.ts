"use client";

import { useCallback, useEffect, useRef, useState } from "react";

import { API_BASE_URL, WS_BASE_URL, getPatientReadings } from "@/lib/api";
import type { ConnectionStatus, TelemetryReading } from "@/types/telemetry";

const MAX_POINTS = 60;

export function usePatientStream(patientId: string) {
  const [readings, setReadings] = useState<TelemetryReading[]>([]);
  const [status, setStatus] = useState<ConnectionStatus>("connecting");
  const reconnectTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const shouldReconnect = useRef(true);

  const pushReading = useCallback((reading: TelemetryReading) => {
    setReadings((current) => [...current, reading].slice(-MAX_POINTS));
  }, []);

  useEffect(() => {
    getPatientReadings(patientId, MAX_POINTS)
      .then(setReadings)
      .catch(() => setReadings([]));
  }, [patientId]);

  useEffect(() => {
    shouldReconnect.current = true;

    const cleanupTimer = () => {
      if (reconnectTimer.current) {
        clearTimeout(reconnectTimer.current);
        reconnectTimer.current = null;
      }
    };

    const connectSse = () => {
      setStatus("reconnecting");
      const streamBase = API_BASE_URL.replace(/\/api$/, "");
      const source = new EventSource(`${streamBase}/api/patients/${patientId}/stream`);

      source.onopen = () => setStatus("connected");
      source.onmessage = (event) => {
        pushReading(JSON.parse(event.data) as TelemetryReading);
      };
      source.addEventListener("vitals", (event) => {
        pushReading(JSON.parse((event as MessageEvent).data) as TelemetryReading);
      });
      source.onerror = () => {
        source.close();
        if (shouldReconnect.current) {
          setStatus("offline");
          reconnectTimer.current = setTimeout(connectWebSocket, 2500);
        }
      };

      return source;
    };

    let sse: EventSource | null = null;
    let websocket: WebSocket | null = null;

    const connectWebSocket = () => {
      cleanupTimer();
      setStatus((current) => (current === "connecting" ? "connecting" : "reconnecting"));
      websocket = new WebSocket(`${WS_BASE_URL}/ws/patients/${patientId}`);

      websocket.onopen = () => setStatus("connected");
      websocket.onmessage = (event) => {
        pushReading(JSON.parse(event.data) as TelemetryReading);
      };
      websocket.onerror = () => {
        websocket?.close();
      };
      websocket.onclose = () => {
        if (!shouldReconnect.current) {
          return;
        }
        setStatus("reconnecting");
        sse = connectSse();
      };
    };

    connectWebSocket();

    return () => {
      shouldReconnect.current = false;
      cleanupTimer();
      websocket?.close();
      sse?.close();
    };
  }, [patientId, pushReading]);

  return {
    readings,
    latest: readings.at(-1) ?? null,
    status,
  };
}
