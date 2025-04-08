import { AssemblyAI } from 'assemblyai';

export async function POST(request: Request) {
  const apiKey = process.env.ASSEMBLY_API_KEY;
  if (!apiKey) {
    return Response.error();
  }

  const client = new AssemblyAI({ apiKey: apiKey });
  const body = await request.json();

  const prompt = body?.prompt;

  if (!prompt) {
    return Response.error();
  }

  const finalPrompt = [
    "Act as an assistant participating in a video call.",
    "Focus on providing direct answers without restating the questions.",
    "If unsure about the answer, explicitly mention it.",
    "The user's question is as follows:",
    prompt,
  ].join(' ');

  const lemurResponse = await client.lemur.task({
    prompt: finalPrompt,
    input_text: 'This is a conversation during a video call.',
  });

  const response = {
    prompt: prompt,
    response: lemurResponse.response,
  };

  return Response.json(response);
}
