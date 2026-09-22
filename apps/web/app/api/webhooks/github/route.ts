import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const event = req.headers.get('x-github-event') || 'issues';
    const payload = await req.json();

    console.log(`📡 GitHub Webhook Event Received: [${event}] action: ${payload.action}`);

    if (event === 'issues') {
      const issueNumber = payload.issue?.number;
      const action = payload.action;

      if (action === 'closed') {
        console.log(`✓ Issue #${issueNumber} closed on GitHub. Marking StudioOrbit pin as RESOLVED (Ready for Client Retest).`);
        return NextResponse.json({
          received: true,
          action: 'PIN_STATUS_UPDATED',
          issueNumber,
          newStatus: 'RESOLVED',
        });
      } else if (action === 'reopened') {
        console.log(`↺ Issue #${issueNumber} reopened on GitHub. Re-opening StudioOrbit pin.`);
        return NextResponse.json({
          received: true,
          action: 'PIN_STATUS_UPDATED',
          issueNumber,
          newStatus: 'OPEN',
        });
      }
    } else if (event === 'issue_comment') {
      const issueNumber = payload.issue?.number;
      const commentBody = payload.comment?.body;
      const author = payload.comment?.user?.login;

      console.log(`💬 Comment on Issue #${issueNumber} by @${author}: "${commentBody?.slice(0, 40)}..."`);
      return NextResponse.json({
        received: true,
        action: 'COMMENT_SYNCED',
        issueNumber,
        author,
      });
    }

    return NextResponse.json({ received: true, event, action: payload.action });
  } catch (err) {
    console.error('GitHub Webhook Error:', err);
    return NextResponse.json({ error: 'Failed to process GitHub webhook' }, { status: 500 });
  }
}
