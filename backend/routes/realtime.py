import asyncio
import json
from collections import defaultdict
from collections.abc import AsyncGenerator

from fastapi import APIRouter, WebSocket, WebSocketDisconnect
from sse_starlette.sse import EventSourceResponse

router = APIRouter()


class ConnectionManager:
    def __init__(self) -> None:
        self.websocket_connections: dict[int, set[WebSocket]] = defaultdict(set)
        self.sse_subscribers: dict[int, set[asyncio.Queue[dict]]] = defaultdict(set)

    async def connect_ws(self, patient_id: int, websocket: WebSocket) -> None:
        await websocket.accept()
        self.websocket_connections[patient_id].add(websocket)

    def disconnect_ws(self, patient_id: int, websocket: WebSocket) -> None:
        self.websocket_connections[patient_id].discard(websocket)

    def subscribe_sse(self, patient_id: int) -> asyncio.Queue[dict]:
        queue: asyncio.Queue[dict] = asyncio.Queue(maxsize=100)
        self.sse_subscribers[patient_id].add(queue)
        return queue

    def unsubscribe_sse(self, patient_id: int, queue: asyncio.Queue[dict]) -> None:
        self.sse_subscribers[patient_id].discard(queue)

    async def broadcast(self, patient_id: int, payload: dict) -> None:
        dead_sockets: list[WebSocket] = []
        message = json.dumps(payload)
        for websocket in list(self.websocket_connections[patient_id]):
            try:
                await websocket.send_text(message)
            except Exception:
                dead_sockets.append(websocket)

        for websocket in dead_sockets:
            self.disconnect_ws(patient_id, websocket)

        for queue in list(self.sse_subscribers[patient_id]):
            if queue.full():
                await queue.get()
            await queue.put(payload)


manager = ConnectionManager()


@router.websocket("/ws/patients/{patient_id}")
async def patient_websocket(websocket: WebSocket, patient_id: int) -> None:
    await manager.connect_ws(patient_id, websocket)
    try:
        while True:
            await websocket.receive_text()
    except WebSocketDisconnect:
        manager.disconnect_ws(patient_id, websocket)


async def sse_event_generator(patient_id: int) -> AsyncGenerator[dict, None]:
    queue = manager.subscribe_sse(patient_id)
    try:
        while True:
            payload = await queue.get()
            yield {"event": "vitals", "data": json.dumps(payload)}
    finally:
        manager.unsubscribe_sse(patient_id, queue)


@router.get("/api/patients/{patient_id}/stream")
async def patient_stream(patient_id: int) -> EventSourceResponse:
    return EventSourceResponse(sse_event_generator(patient_id), ping=15)
