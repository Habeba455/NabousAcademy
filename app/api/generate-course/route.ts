import OpenAI from "openai";
import { NextResponse } from "next/server";

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(req: Request) {
  try {
    if (!process.env.OPENAI_API_KEY) {
      return NextResponse.json(
        { success: false, error: "OpenAI API key not configured." },
        { status: 500 }
      );
    }

    const body = await req.json();

    const mode = body?.mode?.toString() || "4weeks";
    const subject = body?.subject?.toString()?.trim();
    const level = body?.level?.toString() || "Beginner";
    const language = body?.language === "en" ? "English" : "French";

    if (!subject || subject.length < 2) {
      return NextResponse.json(
        { success: false, error: "Valid subject is required." },
        { status: 400 }
      );
    }

    let systemPrompt = "";
    let userPrompt = "";
    let maxTokens = 4000;

    /* ===================================================== */
    /* 4 WEEKS COURSE – HEAVY STRUCTURED VERSION */
    /* ===================================================== */

    if (mode === "4weeks") {
      systemPrompt = `
You are a senior academic instructional architect building deep structured premium courses.

CRITICAL REQUIREMENTS:
- Write strictly in ${language}.
- Minimum 1500 words total.
- Each week must contain at least 350–500 words.
- Use structured subheadings inside content (##, ### style but as plain text).
- Explain progressively from fundamentals to applied understanding.
- Include concrete practical examples.
- Include WHY, HOW, WHEN to use concepts.
- Avoid generic sentences like "This module introduces..."
- Avoid short paragraphs.
- No shallow summaries.
- Content must feel like a real paid course.
- Return strictly valid JSON.
`;

      userPrompt = `
Create a deep structured 4-week professional course on:

${subject}

Level: ${level}

Return JSON structure:

{
  "title": "",
  "weeks": [
    {
      "week_title": "",
      "objectives": [],
      "content": "",
      "practical_component": ""
    }
  ]
}
`;
    }

    /* ===================================================== */
    /* 3 MONTHS COURSE – INTENSIVE VERSION */
    /* ===================================================== */

    else if (mode === "3months") {
      systemPrompt = `
You are designing a premium 3-month professional training program.

STRICT:
- Write strictly in ${language}.
- Minimum 12 modules.
- Each module must contain 500–700 words.
- Use structured internal headings.
- Include real case study example per module.
- Explain strategic thinking, implementation, and mistakes to avoid.
- Deep explanations only.
- No short modules.
- Return strictly valid JSON.
`;

      userPrompt = `
Create a 3-month intensive professional program on:

${subject}

Level: ${level}

Return JSON structure:

{
  "title": "",
  "modules": [
    {
      "module_title": "",
      "detailed_content": "",
      "real_world_application": ""
    }
  ]
}
`;
    }

    /* ===================================================== */
    /* UDEMY TRANSFORM – FULL COURSE + QUIZ */
    /* ===================================================== */

    else if (mode === "udemy") {
      systemPrompt = `
You are a senior course transformation expert.

STRICT:
- Write strictly in ${language}.
- Minimum 1500 words total.
- Deep structured modules.
- Clear lesson breakdown.
- Include 12–15 professional quiz questions.
- Each quiz question must include explanation.
- Include a practical project with evaluation criteria.
- No shallow explanations.
- Return strictly valid JSON.
`;

      userPrompt = `
Transform this topic into a premium structured professional course:

${subject}

Level: ${level}

Return JSON:

{
  "title": "",
  "modules": [
    {
      "module_title": "",
      "detailed_content": ""
    }
  ],
  "quiz": [
    {
      "question": "",
      "options": [],
      "correct_answer": "",
      "explanation": ""
    }
  ],
  "exercise": {
    "objective": "",
    "context": "",
    "steps": [],
    "deliverable": "",
    "evaluation": []
  }
}
`;
    }

    /* ===================================================== */
    /* POWERPOINT – DETAILED BULLETS */
    /* ===================================================== */

    else if (mode === "ppt") {
      systemPrompt = `
You are a professional presentation architect.

STRICT:
- Write strictly in ${language}.
- Maximum 25 slides.
- Each slide must contain 4–6 bullet points.
- Each bullet must contain meaningful explanatory text (minimum 20–40 words per bullet).
- Logical pedagogical progression.
- Avoid short bullet phrases.
- Return strictly valid JSON.
`;

      userPrompt = `
Generate a structured PowerPoint plan for:

${subject}

Return JSON:

{
  "title": "",
  "slides": [
    {
      "slide_number": 1,
      "title": "",
      "subtitle": "",
      "content": []
    }
  ]
}
`;
    }

    /* ===================================================== */
    /* QUIZ ONLY – PROFESSIONAL */
    /* ===================================================== */

    else if (mode === "quiz") {
      systemPrompt = `
You are a senior pedagogical assessment designer.

STRICT:
- Write strictly in ${language}.
- Create 12–15 structured professional questions.
- Mix MCQ, True/False, and Scenario-based.
- Each answer must include deep explanation.
- Avoid repetitive questions.
- Return strictly valid JSON.
`;

      userPrompt = `
Create a professional assessment on:

${subject}

Return JSON:

{
  "quiz": [
    {
      "question": "",
      "options": [],
      "correct_answer": "",
      "explanation": ""
    }
  ]
}
`;
    }

    else {
      return NextResponse.json(
        { success: false, error: "Invalid mode value." },
        { status: 400 }
      );
    }

    const completion = await client.chat.completions.create({
      model: "gpt-4o",
      temperature: 0.5,
      max_tokens: maxTokens,
      response_format: { type: "json_object" },
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userPrompt }
      ]
    });

    const raw = completion.choices?.[0]?.message?.content;

    if (!raw) {
      return NextResponse.json(
        { success: false, error: "Empty model response." },
        { status: 500 }
      );
    }

    let parsed;
    try {
      parsed = JSON.parse(raw);
    } catch {
      return NextResponse.json(
        { success: false, error: "Invalid JSON returned by model." },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      data: parsed
    });

  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || "Generation failed." },
      { status: 500 }
    );
  }
}
