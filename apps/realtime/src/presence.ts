export interface ClientPresence {
  id: string;
  assetId: string;
  name: string;
  color: string;
  x: number;
  y: number;
}

export class PresenceTracker {
  private activeClients = new Map<string, ClientPresence>();

  public updatePresence(client: ClientPresence): void {
    this.activeClients.set(client.id, client);
  }

  public removePresence(clientId: string): void {
    this.activeClients.delete(clientId);
  }

  public getAssetPresence(assetId: string): ClientPresence[] {
    const list: ClientPresence[] = [];
    for (const presence of this.activeClients.values()) {
      if (presence.assetId === assetId) {
        list.push(presence);
      }
    }
    return list;
  }
}
