import Anthropic from "@anthropic-ai/sdk";

const client = new Anthropic({
  /* eslint-disable no-undef*/
  apiKey: process.env.ANTHROPIC_API_KEY,
});

const SYSTEM_PROMPT = `You are a technical project consultant for "AradSazan", a construction company.
AradSazan builds, designs, and executes construction projects in four stages: survey, design, build, deliver.
Based on the information the visitor provides about their project, give practical, specific initial consulting advice.
Keep the tone professional, grounded, and concise. You can end with one follow-up question to sharpen the advice.
If the visitor needs an exact price or a formal timeline, suggest they book a full consultation with the AradSazan team.`;

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const { messages } = req.body.message;

    const response = await client.messages.create({
      model: "claude-3-5-sonnet-latest",
      max_tokens: 500,
      system: SYSTEM_PROMPT,
      messages,
    });

    res.json(response);
  } catch (error) {
    res.status(500).json({
      error: error.message,
    });
  }
}
