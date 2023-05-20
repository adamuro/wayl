import type { UserWebhookEvent } from '@clerk/clerk-sdk-node';
import type { IncomingHttpHeaders } from 'http2';
import type { NextApiRequest, NextApiResponse } from 'next';
import { Webhook, WebhookVerificationError } from 'svix';
import { env } from '~/env.mjs';
import { prisma } from '~/server/db';

const webhookSecret: string = env.CLERK_WEBHOOK_SECRET_KEY;

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') return res.status(405).end();

  let event: UserWebhookEvent | null = null;

  const wh = new Webhook(webhookSecret);
  const payloadString = JSON.stringify(req.body);
  const svixHeaders = getSvixHeaders(req.headers);

  try {
    event = wh.verify(payloadString, svixHeaders) as UserWebhookEvent;
  } catch (error) {
    if (error instanceof WebhookVerificationError)
      return res.status(400).json({ message: error.message });
    return res.status(400).json({ message: 'Unexpected error during webhook verification.' });
  }

  switch (event.type) {
    case 'user.created':
    case 'user.updated':
      const { id, profile_image_url, username, first_name } = event.data;
      const user = await prisma.user.upsert({
        where: { clerkId: id },
        update: { avatarUrl: profile_image_url },
        create: {
          clerkId: id,
          avatarUrl: profile_image_url,
          name: username || first_name,
        },
      });

      return res.status(201).json(user);
    case 'user.deleted':
      const deleted = await prisma.user.delete({ where: { clerkId: event.data.id } });
      return res.status(200).json(deleted);
    default:
      return res.status(400).json({ error: 'Unsupported event type.' });
  }
}

function getSvixHeaders(headers: IncomingHttpHeaders) {
  return {
    'svix-id': headers['svix-id'] as string,
    'svix-timestamp': headers['svix-timestamp'] as string,
    'svix-signature': headers['svix-signature'] as string,
  };
}
