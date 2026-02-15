import Anthropic from "@anthropic-ai/sdk";
import { NextRequest, NextResponse } from "next/server";

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

export async function POST(request: NextRequest) {
  try {
    const { text } = await request.json();

    if (!text) {
      return NextResponse.json(
        { error: "Missing text parameter" },
        { status: 400 }
      );
    }

    const message = await anthropic.messages.create({
      model: "claude-3-5-sonnet-20241022",
      max_tokens: 200,
      messages: [
        {
          role: "user",
          content: `You are a viral content expert. Take this audio script idea and make it more engaging, punchy, and viral-worthy for TikTok/Instagram. Keep it under 30 words and make it sound natural when spoken. Only return the enhanced script, nothing else.

Original: ${text}`,
        },
      ],
    });

    const enhancedText =
      message.content[0].type === "text" ? message.content[0].text : text;

    return NextResponse.json({ enhancedText });
  } catch (error) {
    console.error("Error enhancing script:", error);
    return NextResponse.json(
      { error: "Failed to enhance script" },
      { status: 500 }
    );
  }
}
