import { google } from '@ai-sdk/google';
import { streamText } from 'ai';

export async function POST(req: Request) {
  const { messages } = await req.json();

  const result = streamText({
    model: google('gemini-1.5-pro-latest'),
    messages,
    system: "You are a helpful AI chatbot for a Senior Full Stack & AI/ML Engineer's portfolio. You answer questions about the developer's experience, which includes Next.js, React, Node, AI integrations, MongoDB, and modern 3D UIs. Keep answers professional and concise.",
  });

  return result.toTextStreamResponse();
}
