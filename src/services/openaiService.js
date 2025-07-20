import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: "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",
  baseURL: "https://openrouter.ai/api/v1",
  dangerouslyAllowBrowser: true,
});

export const generateMarketInsights = async (marketData) => {
  try {
    const completion = await openai.chat.completions.create({
      model: "google/gemini-2.0-flash-001",
      messages: [
        {
          role: "system",
          content: "You are a financial advisor AI. Provide concise, actionable market insights based on the provided data. Focus on trends, opportunities, and risks."
        },
        {
          role: "user",
          content: `Analyze this market data and provide insights: ${JSON.stringify(marketData)}`
        }
      ],
      max_tokens: 500,
      temperature: 0.7
    });

    return completion.choices[0].message.content;
  } catch (error) {
    console.error('Error generating insights:', error);
    return "Unable to generate insights at this time.";
  }
};

export const generatePersonalizedRecommendations = async (userProfile, portfolioData) => {
  try {
    const completion = await openai.chat.completions.create({
      model: "google/gemini-2.0-flash-001",
      messages: [
        {
          role: "system",
          content: "You are a personal financial advisor. Provide personalized investment recommendations based on user profile and portfolio data."
        },
        {
          role: "user",
          content: `User profile: ${JSON.stringify(userProfile)}\nPortfolio: ${JSON.stringify(portfolioData)}\nProvide 3-5 specific investment recommendations.`
        }
      ],
      max_tokens: 600,
      temperature: 0.7
    });

    return completion.choices[0].message.content;
  } catch (error) {
    console.error('Error generating recommendations:', error);
    return "Unable to generate recommendations at this time.";
  }
};