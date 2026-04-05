/**
 * @returns {{ summary: string, actionItems: string[] }}
 */
export async function summarizeMeeting({ title, transcript }) {
  const mockOn =
    process.env.MOCK_LLM === "true" || process.env.MOCK_LLM === "1";

  if (mockOn) {
    return {
      summary: `[Mock LLM] Summary for "${title}": demo output from worker.`,
      actionItems: [
        "[Mock] Follow up on meeting notes",
        "[Mock] Share summary with team",
      ],
    };
  }

  const openaiKey = (process.env.OPENAI_API_KEY || "").trim();
  if (!openaiKey) {
    const wantReal =
      process.env.MOCK_LLM === "false" || process.env.MOCK_LLM === "0";
    if (wantReal) {
      throw new Error(
        "MOCK_LLM=false but OPENAI_API_KEY is missing in environment",
      );
    }
    return {
      summary: `[Mock LLM] Summary for "${title}": set OPENAI_API_KEY or MOCK_LLM=true.`,
      actionItems: ["[Mock] Add OPENAI_API_KEY to .env for real summaries"],
    };
  }

  return callOpenAI({ title, transcript, apiKey: openaiKey });
}

async function callOpenAI({ title, transcript, apiKey }) {
  const model = process.env.OPENAI_MODEL || "gpt-4o-mini";
  const body = transcript.slice(0, 100_000);
  const userPrompt = `Return ONLY a JSON object with keys "summary" (string) and "actionItems" (array of strings, can be empty).

Meeting title: ${title}

Transcript:
${body}`;

  const res = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model,
      messages: [
        {
          role: "system",
          content:
            "You summarize meetings. Output must be valid JSON matching the user schema.",
        },
        { role: "user", content: userPrompt },
      ],
      response_format: { type: "json_object" },
    }),
  });

  const rawText = await res.text();
  if (!res.ok) {
    throw new Error(`OpenAI HTTP ${res.status}: ${rawText.slice(0, 300)}`);
  }

  let data;
  try {
    data = JSON.parse(rawText);
  } catch {
    throw new Error("OpenAI: invalid JSON body");
  }

  const text = data.choices?.[0]?.message?.content || "";
  const parsed = parseJsonFromModel(text);
  return validateShape(parsed);
}

function parseJsonFromModel(text) {
  let s = String(text).trim();
  const fence = s.match(/^```(?:json)?\s*([\s\S]*?)```$/i);
  if (fence) s = fence[1].trim();

  try {
    return JSON.parse(s);
  } catch (e) {
    const firstBrace = s.indexOf("{");
    const lastBrace = s.lastIndexOf("}");
    if (firstBrace !== -1 && lastBrace > firstBrace) {
      return JSON.parse(s.slice(firstBrace, lastBrace + 1).trim());
    }
    throw e;
  }
}

function validateShape(obj) {
  if (!obj || typeof obj !== "object") throw new Error("Invalid LLM output");
  const summary = typeof obj.summary === "string" ? obj.summary : "";
  const actionItems = Array.isArray(obj.actionItems)
    ? obj.actionItems.map(String)
    : [];
  if (!summary) throw new Error("Missing summary in LLM output");
  return { summary, actionItems };
}
