export async function summarizeMeeting({ title, transcript }) {
    const useMock =
      process.env.MOCK_LLM === "true" ||
      process.env.MOCK_LLM === "1" ||
      !process.env.OLLAMA_BASE_URL;
  
    if (useMock) {
      return {
        summary: `[Mock LLM] Summary for "${title}": demo output from worker (set Ollama later).`,
        actionItems: [
          "[Mock] Follow up on meeting notes",
          "[Mock] Share summary with team",
        ],
      };
    }
  
    throw new Error("MOCK_LLM=false but Ollama path not implemented in worker yet");
  }