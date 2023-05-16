import type { UserWebhookEvent } from '@clerk/clerk-sdk-node';
import type { NextApiRequest, NextApiResponse } from 'next';
import { Webhook } from 'svix';
import { env } from '~/env.mjs';
const webhookSecret: string = env.CLERK_WEBHOOK_SECRET_KEY;

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  let event: UserWebhookEvent | null = null;

  const wh = new Webhook(webhookSecret);
  const payload = (await req.body) as UserWebhookEvent;
  const payloadString = JSON.stringify(payload);
  const headerPayload = req.headers;
  const svixHeaders = {
    'svix-id': headerPayload['svix-id'] as string,
    'svix-timestamp': headerPayload['svix-timestamp'] as string,
    'svix-signature': headerPayload['svix-signature'] as string,
  };

  try {
    event = wh.verify(payloadString, svixHeaders) as UserWebhookEvent;
  } catch (error) {
    console.log(error);
    return res.status(400).send('Error occured');
  }

  if (event.type === 'user.created') {
    console.log(`User ${event.data.id} created`);
  }

  res.status(201).send('Success');
}
