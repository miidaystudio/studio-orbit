import { WebSocketServer, WebSocket } from 'ws';
import { PresenceTracker } from './presence';
import { Broadcaster } from './broadcaster';

const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 8080;
const wss = new WebSocketServer({ port: PORT });
const presenceTracker = new PresenceTracker();
const connectedClients = new Set<WebSocket>();

console.log(`📡 Studio-Orbit Realtime WebSocket service running on ws://localhost:${PORT}`);

wss.on('connection', (ws: WebSocket) => {
  connectedClients.add(ws);

  ws.on('message', (data: Buffer) => {
    try {
      const payload = JSON.parse(data.toString());

      if (payload.type === 'PRESENCE_UPDATE') {
        presenceTracker.updatePresence(payload.data);
        const roomClients = presenceTracker.getAssetPresence(payload.data.assetId);
        Broadcaster.broadcastToRoom(connectedClients, ws, {
          type: 'ROOM_PRESENCE',
          assetId: payload.data.assetId,
          clients: roomClients,
        });
      } else if (payload.type === 'NEW_COMMENT_PIN') {
        Broadcaster.broadcastToRoom(connectedClients, ws, {
          type: 'PIN_ADDED',
          assetId: payload.assetId,
          pin: payload.pin,
        });
      }
    } catch (err) {
      console.error('Failed to parse incoming WS message:', err);
    }
  });

  ws.on('close', () => {
    connectedClients.delete(ws);
  });
});
