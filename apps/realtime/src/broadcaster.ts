import WebSocket from 'ws';

export class Broadcaster {
  public static broadcastToRoom(
    clients: Set<WebSocket>,
    sender: WebSocket | null,
    payload: object
  ): void {
    const message = JSON.stringify(payload);
    for (const client of clients) {
      if (client !== sender && client.readyState === WebSocket.OPEN) {
        client.send(message);
      }
    }
  }
}
