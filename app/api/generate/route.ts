import OpenAI from "openai";
import { NextResponse } from "next/server";

if (!process.env.OPENAI_API_KEY) {
  throw new Error("OPENAI_API_KEY is not set in environment variables.");
}

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const SYSTEM_PROMPT = `
You are an institutional pedagogical engine embedded in a professional SaaS platform.

You are NOT a conversational assistant.
You generate structured deterministic educational content.

STRICT RULES:
- Never ask questions.
- Never add introduction.
- Never add conclusion.
- Never use emojis.
- Output ONLY valid JSON.
- Respect strictly the requested language.
- JSON must be parseable.

STRICT FORMAT:

{
  "title": "...",
  "info": {
    "level": "...",
    "resources": "...",
    "language": "..."
  },
  "quiz": [
    {
      "id": "unique_id",
      "type": "MCQ | TRUE_FALSE | SCENARIO",
      "question": "...",
      "options": ["A", "B", "C", "D"],
      "answer": "...",
      "explanation": "..."
    }
  ],
  "exercise": {
    "objective": "...",
    "context": "...",
    "steps": ["...", "..."],
    "deliverable": "...",
    "evaluation": ["...", "..."]
  }
}

RULES:
- Minimum 10 questions
- Mix question types randomly
- Ensure all 3 types appear at least once
- Distribution must vary between generations
- Explanation must be 2–4 lines
- Always include answers and explanations
- Always include exercise
`;

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const subject = body.subject?.trim();
    const level = body.level || "Beginner";
    const resources = body.resources || "Medium";
    const language = body.language === "en" ? "English" : "French";

    const questionCount =
      body.questionCount && Number(body.questionCount) >= 10
        ? Number(body.questionCount)
        : 10;

    if (!subject) {
      return NextResponse.json(
        { success: false, error: "Subject is required." },
        { status: 400 }
      );
    }

    const userPrompt = `
Subject: ${subject}
Level: ${level}
Resources: ${resources}
Language: ${language}
Number of Questions: ${questionCount}

Generate the requested content.
Return strictly valid JSON only.
`;

    const completion = await openai.chat.completions.create({
      model: "gpt-4o",
      temperature: 0.6, // 🔥 Balanced randomness
      max_tokens: 3500,
      messages: [
        { role: "system", content: SYSTEM_PROMPT },
        { role: "user", content: userPrompt },
      ],
    });

    const raw = completion.choices[0].message.content;

    let parsed;

    try {
      parsed = JSON.parse(raw || "{}");
    } catch (parseError) {
      console.error("Invalid JSON from model:", raw);
      return NextResponse.json(
        { success: false, error: "Invalid JSON generated." },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      data: parsed,
    });

  } catch (error) {
    console.error("Generation error:", error);

    return NextResponse.json(
      { success: false, error: "Erreur lors de la génération." },
      { status: 500 }
    );
  }
}
