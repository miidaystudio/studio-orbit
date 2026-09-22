import { NextRequest } from 'next/server';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const assetId = searchParams.get('assetId') || 'global';

  const encoder = new TextEncoder();

  const stream = new ReadableStream({
    start(controller) {
      // Send initial SSE connection confirmation
      const initPayload = `event: connected\ndata: ${JSON.stringify({
        status: 'CONNECTED',
        assetId,
        timestamp: new Date().toISOString(),
      })}\n\n`;
      controller.enqueue(encoder.encode(initPayload));

      // Heartbeat ping interval to keep connection alive without Redis
      const interval = setInterval(() => {
        try {
          const pingPayload = `event: ping\ndata: ${JSON.stringify({
            timestamp: Date.now(),
          })}\n\n`;
          controller.enqueue(encoder.encode(pingPayload));
        } catch (err) {
          clearInterval(interval);
        }
      }, 15000);

      req.signal.addEventListener('abort', () => {
        clearInterval(interval);
        controller.close();
      });
    },
  });

  return new Response(stream, {
    headers: {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache, no-transform',
      Connection: 'keep-alive',
      'Access-Control-Allow-Origin': '*',
    },
  });
}
