import OpenAI from "openai";

// Use environment variable for API key
const openai = new OpenAI({ 
  apiKey: import.meta.env.VITE_OPENAI_API_KEY || "your-api-key",
  dangerouslyAllowBrowser: true // Only for client-side use in development
});

// Basic text analysis for WorkBindr business context
export async function analyzeBusinessQuery(query: string): Promise<string> {
  try {
    const response = await openai.chat.completions.create({
      model: "gpt-4o", // the newest OpenAI model is "gpt-4o" which was released May 13, 2024. do not change this unless explicitly requested by the user
      messages: [
        {
          role: "system",
          content: "You are an AI assistant for WorkBindr, a decentralized business productivity platform. Help users with business tasks, provide insights about micro-apps, and assist with workflow automation. Be professional and focus on practical business solutions."
        },
        {
          role: "user",
          content: query
        }
      ],
      max_tokens: 500,
    });

    return response.choices[0]?.message?.content || "I couldn't process your request at the moment.";
  } catch (error) {
    console.error("OpenAI API error:", error);
    throw new Error("Failed to analyze business query");
  }
}

// Generate business insights from data
export async function generateBusinessInsights(data: any): Promise<{
  insights: string[];
  recommendations: string[];
}> {
  try {
    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "system",
          content: "Analyze business data and provide actionable insights and recommendations. Respond with JSON format containing 'insights' and 'recommendations' arrays."
        },
        {
          role: "user",
          content: `Analyze this business data and provide insights: ${JSON.stringify(data)}`
        }
      ],
      response_format: { type: "json_object" },
    });

    const result = JSON.parse(response.choices[0]?.message?.content || "{}");
    return {
      insights: result.insights || [],
      recommendations: result.recommendations || []
    };
  } catch (error) {
    console.error("Business insights error:", error);
    return {
      insights: ["Unable to generate insights at this time."],
      recommendations: ["Please try again later."]
    };
  }
}
