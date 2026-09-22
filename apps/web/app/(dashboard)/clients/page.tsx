import React from 'react';
import { getClientsAction } from '@/app/actions/deliverables';
import ClientDirectoryGrid from '@/components/clients/ClientDirectoryGrid';

export default async function ClientsDirectoryPage() {
  const clients = await getClientsAction();

  return <ClientDirectoryGrid initialClients={clients} />;
}
