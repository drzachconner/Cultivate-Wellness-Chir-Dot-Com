import { Resend } from 'resend';
import { isAllowed, getClientIP } from '../lib/rate-limit';

interface Env {
  RESEND_API_KEY: string;
  NOTIFICATION_EMAIL?: string;
  BREVO_API_KEY?: string;
}

const SITE_URL = 'https://www.cultivatewellnesschiro.com';

function escapeHtml(str: string): string {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

// Guide configuration
const GUIDES: Record<string, { title: string; pdfUrl: string; subject: string }> = {
  'rhkn-guide': {
    title: 'Raising Healthy Kids Naturally',
    pdfUrl: `${SITE_URL}/guides/raising-healthy-kids-naturally.pdf`,
    subject: '\u{1F33F} FREE PDF: Raising Healthy Kids Naturally',
  },
  '3-ways-to-sleep': {
    title: '3 Ways to Improve Your Child\'s Sleep',
    pdfUrl: `${SITE_URL}/guides/3-ways-to-sleep.pdf`,
    subject: '\u{1F634} 3 Ways to Improve Your Child\'s Sleep (Free PDF)',
  },
  '3-ways-to-poop': {
    title: '3 Ways to Get Your Child Pooping',
    pdfUrl: `${SITE_URL}/guides/3-ways-to-poop.pdf`,
    subject: '\u{1F476} 3 Ways to Get Your Child Pooping (Free PDF)',
  },
};

// Add contact to Brevo
async function addToBrevo(email: string, firstName: string, brevoApiKey: string, listId: number = 2) {
  try {
    const response = await fetch('https://api.brevo.com/v3/contacts', {
      method: 'POST',
      headers: {
        'accept': 'application/json',
        'content-type': 'application/json',
        'api-key': brevoApiKey,
      },
      body: JSON.stringify({
        email,
        attributes: { FIRSTNAME: firstName },
        listIds: [listId],
        updateEnabled: true,
      }),
    });

    if (!response.ok) {
      const error = await response.text();
      console.error('Brevo API error:', error);
    }
  } catch (error) {
    console.error('Failed to add contact to Brevo:', error);
  }
}

// Generate guide download email HTML
function generateGuideEmail(firstName: string, guide: { title: string; pdfUrl: string }) {
  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="margin: 0; padding: 0; font-family: Arial, sans-serif; background-color: #f4f4f4;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f4f4f4; padding: 20px 0;">
    <tr>
      <td align="center">
        <table width="600" cellpadding="0" cellspacing="0" style="background-color: #ffffff; border-radius: 8px; overflow: hidden;">
          <!-- Header -->
          <tr>
            <td style="padding: 30px; text-align: center; background-color: #ffffff;">
              <img src="https://www.cultivatewellnesschiro.com/images/cwc-logo-horizontal.webp" alt="Cultivate Wellness Chiropractic" style="max-width: 300px; height: auto;">
            </td>
          </tr>

          <!-- Content -->
          <tr>
            <td style="padding: 40px 30px;">
              <h1 style="color: #264b7f; font-size: 24px; margin: 0 0 20px 0; text-align: center;">
                ${guide.title}
              </h1>

              <p style="color: #555555; font-size: 16px; line-height: 1.6; margin: 0 0 20px 0;">
                Dear ${firstName},
              </p>

              <p style="color: #555555; font-size: 16px; line-height: 1.6; margin: 0 0 30px 0;">
                Thank you for downloading the free guide, <strong>${guide.title}</strong>. Click the button below to access your guide:
              </p>

              <!-- Download Button -->
              <table width="100%" cellpadding="0" cellspacing="0">
                <tr>
                  <td align="center">
                    <a href="${guide.pdfUrl}" style="display: inline-block; background-color: #264b7f; color: #ffffff; text-decoration: none; padding: 15px 40px; border-radius: 5px; font-size: 16px; font-weight: bold;">
                      DOWNLOAD
                    </a>
                  </td>
                </tr>
              </table>

              <p style="color: #555555; font-size: 14px; line-height: 1.6; margin: 30px 0 0 0; text-align: center;">
                At Cultivate Wellness Chiropractic we are Experts in Drug-Free Pediatric, Prenatal, and Family Health Care!
              </p>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="padding: 20px 30px; background-color: #f8f8f8; text-align: center;">
              <p style="color: #888888; font-size: 12px; margin: 0;">
                Cultivate Wellness Chiropractic<br>
                Royal Oak, MI
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
  `.trim();
}

// Generate notification email for owner
function generateNotificationEmail(formType: string, data: Record<string, string>) {
  const fields = Object.entries(data)
    .filter(([key]) => !key.startsWith('_'))
    .map(([key, value]) => `<tr><td style="padding: 8px; border: 1px solid #ddd; font-weight: bold;">${escapeHtml(key)}</td><td style="padding: 8px; border: 1px solid #ddd;">${escapeHtml(String(value))}</td></tr>`)
    .join('');

  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
</head>
<body style="font-family: Arial, sans-serif; padding: 20px;">
  <h2 style="color: #002d4e;">New ${formType} Submission</h2>
  <table style="border-collapse: collapse; width: 100%; max-width: 600px;">
    ${fields}
  </table>
  <p style="color: #888; font-size: 12px; margin-top: 20px;">
    Submitted at: ${new Date().toLocaleString('en-US', { timeZone: 'America/Detroit' })}
  </p>
</body>
</html>
  `.trim();
}

const allowedOrigins = ['https://www.cultivatewellnesschiro.com', 'https://cultivatewellnesschiro.com'];

function getCorsOrigin(request: Request): string {
  const origin = request.headers.get('Origin') || '';
  return allowedOrigins.includes(origin) ? origin : allowedOrigins[0];
}

export const onRequestOptions: PagesFunction<Env> = async (context) => {
  return new Response(null, {
    status: 204,
    headers: {
      'Access-Control-Allow-Origin': getCorsOrigin(context.request),
      'Access-Control-Allow-Headers': 'Content-Type',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
    },
  });
};

export const onRequestPost: PagesFunction<Env> = async (context) => {
  const corsOrigin = getCorsOrigin(context.request);
  const headers = {
    'Access-Control-Allow-Origin': corsOrigin,
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Content-Type': 'application/json',
  };

  // Rate limit: 10 requests per minute per IP
  const clientIP = getClientIP(context.request);
  if (!isAllowed(`form:${clientIP}`, 10, 60_000)) {
    return new Response(JSON.stringify({ error: 'Too many submissions. Please wait a moment.' }), {
      status: 429,
      headers: { ...headers, 'Retry-After': '60' },
    });
  }

  try {
    const resend = new Resend(context.env.RESEND_API_KEY);
    const notificationEmail = context.env.NOTIFICATION_EMAIL || 'zachary.riles.conner@gmail.com';

    const data = await context.request.json() as Record<string, any>;
    const formType = data._formType || 'contact';
    const firstName = data.firstName || data.name?.split(' ')[0] || 'Parent';
    const email = data.email;

    if (!email) {
      return new Response(JSON.stringify({ error: 'Email is required' }), {
        status: 400,
        headers,
      });
    }

    // Server-side validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return new Response(JSON.stringify({ error: 'Invalid email format' }), {
        status: 400,
        headers,
      });
    }

    const name = data.name || data.firstName || '';
    if (name.length > 200) {
      return new Response(JSON.stringify({ error: 'Name is too long' }), {
        status: 400,
        headers,
      });
    }

    const message = data.message || '';
    if (message.length > 5000) {
      return new Response(JSON.stringify({ error: 'Message is too long' }), {
        status: 400,
        headers,
      });
    }

    // Send notification email to owner
    const notificationSubject = formType === 'guide'
      ? `New Guide Download: ${GUIDES[data._guideId]?.title || 'Unknown Guide'}`
      : formType === 'contact'
      ? 'New Contact Form Submission'
      : formType === 'appointment'
      ? 'New Appointment Request'
      : 'New Workshop Signup';

    await resend.emails.send({
      from: 'Cultivate Wellness <forms@cultivatewellnesschiro.com>',
      to: notificationEmail,
      subject: notificationSubject,
      html: generateNotificationEmail(formType, data),
    });

    // For guide downloads, send auto-response with PDF
    if (formType === 'guide' && data._guideId && GUIDES[data._guideId]) {
      const guide = GUIDES[data._guideId];

      await resend.emails.send({
        from: 'Cultivate Wellness Chiropractic <guides@cultivatewellnesschiro.com>',
        to: email,
        subject: guide.subject,
        html: generateGuideEmail(firstName, guide),
      });
    }

    // Add to Brevo contact list
    if (context.env.BREVO_API_KEY) {
      await addToBrevo(email, firstName, context.env.BREVO_API_KEY);
    }

    return new Response(JSON.stringify({ success: true }), {
      status: 200,
      headers,
    });
  } catch (error) {
    console.error('Form handler error:', error);
    return new Response(JSON.stringify({ error: 'Failed to process form submission' }), {
      status: 500,
      headers,
    });
  }
};
