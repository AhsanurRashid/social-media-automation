import { openai } from "@ai-sdk/openai";
import { generateObject } from "ai";
import { z } from "zod";

export async function POST() {
  const { object } = await generateObject({
    model: openai("gpt-4o-mini"),
    schema: z.object({
      title: z.string().describe("A catchy, concise post title"),
      content: z.string().describe("Engaging post content, 2-4 paragraphs"),
    }),
    prompt:
      "Generate a creative and engaging social media post. Come up with an interesting topic, write a catchy title, and write compelling content for the post.",
  });

  return Response.json(object);
}
