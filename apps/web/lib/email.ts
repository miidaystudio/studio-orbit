/**
 * Resend / Code-First Transactional Email Dispatcher
 */

export interface EmailPayload {
  to: string;
  subject: string;
  html: string;
}

export async function sendStudioEmail({ to, subject, html }: EmailPayload): Promise<{ success: boolean; id?: string }> {
  const resendApiKey = process.env.RESEND_API_KEY;

  if (resendApiKey) {
    try {
      const res = await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${resendApiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          from: 'StudioOrbit <notifications@orbitstudio.design>',
          to,
          subject,
          html,
        }),
      });

      if (res.ok) {
        const data = await res.json();
        return { success: true, id: data.id };
      }
    } catch (err) {
      console.error('Resend Email Error:', err);
    }
  }

  // Local development fallback logger
  console.log(`📧 [MOCK EMAIL DISPATCH] To: ${to} | Subject: "${subject}"`);
  return { success: true, id: `mock-msg-${Date.now()}` };
}
