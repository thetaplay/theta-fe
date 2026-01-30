import OpenAI from 'openai'

// OpenRouter client for accessing multiple LLM models
export const openrouter = new OpenAI({
    baseURL: 'https://openrouter.ai/api/v1',
    apiKey: process.env.OPENROUTER_API_KEY,
    defaultHeaders: {
        'HTTP-Referer': process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000',
        'X-Title': 'ThetaPlay',
    },
})

// Default model - fast and cheap for hackathon
export const DEFAULT_MODEL = 'anthropic/claude-3-haiku'

// Generate position explanation using LLM
export async function generateExplanation(params: {
    positionType: 'CALL' | 'PUT'
    strike: number
    currentPrice: number
    expiry: number
    status: 'ACTIVE' | 'SETTLED' | 'CLAIMED'
    asset: string
    premiumPaid: number
}): Promise<{
    whatIsThis: string
    whyChosen: string
    whatToWatch: string
}> {
    const { positionType, strike, currentPrice, expiry, status, asset, premiumPaid } = params

    const expiryDate = new Date(expiry * 1000).toLocaleDateString()
    const daysLeft = Math.max(0, Math.floor((expiry * 1000 - Date.now()) / (1000 * 60 * 60 * 24)))

    const prompt = `You are an expert in crypto options trading. Explain this position in simple, beginner-friendly terms.

Position Details:
- Type: ${positionType} option
- Asset: ${asset}
- Strike Price: $${strike}
- Current Price: $${currentPrice}
- Premium Paid: $${premiumPaid}
- Expiry: ${expiryDate} (${daysLeft} days left)
- Status: ${status}

Generate a clear explanation with exactly 3 sections:

1. "What is this?" - Explain in 2-3 sentences what this position means, using simple analogies (like insurance, lottery ticket, etc). Don't use jargon.

2. "Why was it chosen?" - In 2-3 sentences, explain the market reasoning and strategy behind this position. Be specific about price expectations.

3. "What to watch?" - In 2-3 sentences, tell the user what key metrics or events to monitor. Be actionable and specific.

Format your response as JSON:
{
  "whatIsThis": "...",
  "whyChosen": "...",
  "whatToWatch": "..."
}

Keep each section under 80 words. Be conversational and helpful.`

    try {
        const completion = await openrouter.chat.completions.create({
            model: DEFAULT_MODEL,
            messages: [{ role: 'user', content: prompt }],
            temperature: 0.7,
            max_tokens: 500,
        })

        const content = completion.choices[0]?.message?.content
        if (!content) throw new Error('No response from LLM')

        // Parse JSON response
        const explanation = JSON.parse(content)
        return explanation
    } catch (error) {
        console.error('LLM generation failed:', error)
        // Fallback to template
        return generateTemplateExplanation(params)
    }
}

// Fallback template-based explanation
function generateTemplateExplanation(params: {
    positionType: 'CALL' | 'PUT'
    strike: number
    currentPrice: number
    asset: string
}): {
    whatIsThis: string
    whyChosen: string
    whatToWatch: string
} {
    const { positionType, strike, currentPrice, asset } = params
    const isCall = positionType === 'CALL'
    const direction = isCall ? 'above' : 'below'
    const movement = isCall ? 'rise' : 'drop'

    return {
        whatIsThis: `Think of this like ${isCall ? 'a lottery ticket' : 'an insurance policy'
            } for your crypto. If ${asset} ${movement}s significantly, this position steps in to ${isCall ? 'let you profit' : 'cover your losses'
            }.`,
        whyChosen: `Market signals showed potential for ${asset} to move ${direction} $${strike}. This ${positionType} option was selected to ${isCall ? 'capture upside potential' : 'protect against downside risk'
            } without risking too much capital.`,
        whatToWatch: `Keep an eye on the "Ends in" timer. As it gets closer to zero, you'll want to decide if you need to take action or let it expire. Also watch ${asset}'s price - if it moves ${direction} $${strike}, your position becomes more valuable!`,
    }
}
