import { openai } from "@ai-sdk/openai";
import { streamText } from "ai";

type CompletionRequest = {
  images: string[];
  language: string;
};

export async function POST(req: Request) {
  const { images } = (await req.json()) as CompletionRequest;

  const result = await streamText({
    model: openai("gpt-4o-mini"),
    maxTokens: 300,
    messages: [
      {
        role: "system",
        content:
          "Given the following images, generate a description that will be used on a property listing on airbnb or booking.com",
      },
      {
        role: "user",
        content: images.map((image) => ({
          image: image,
          type: "image",
        })),
      },
      {
        role: "user",
        content: [
          {
            type: "text",
            text: `Write the description in the following language: ${req.headers.get(
              "Accept-Language"
            )}`,
          },
        ],
      },
    ],
  });

  return result.toDataStreamResponse();
}
