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

    const prompt = `You're explaining this to someone who's never traded before. Use SUPER simple language like you're texting a friend.

Position: ${positionType === 'CALL' ? 'BETTING price goes UP' : 'PROTECTION if price goes DOWN'}
- You paid: $${premiumPaid}
- Target price: $${strike}
- Current price: $${currentPrice}
- Days left: ${daysLeft}

Return JSON with 3 SUPER SHORT sections (max 30 words each):
{
  "whatIsThis": "Explain like telling a story to a 10-year-old. Use CONCRETE everyday analogies (lottery ticket, car insurance, discount coupon). NEVER use technical words like 'strike', 'premium', 'option', 'contract'.",
  "whyChosen": "Why did I buy this? What am I hoping happens? Talk like chatting with a friend, NOT formal.",
  "whatToWatch": "What should I check daily? Give 1-2 simple things. Examples: 'Check ${asset} price in app' or 'See how many days left'."
}

IMPORTANT RULES:
- Use "you/I" not formal language
- AVOID words: option, strike, premium, contract, expiry
- Use relatable analogies (like buying a raffle ticket, paying for parking, getting a coupon)
- Be SUPER casual, like texting a buddy`

    try {
        const completion = await openrouter.chat.completions.create({
            model: DEFAULT_MODEL,
            messages: [{ role: 'user', content: prompt }],
            temperature: 0.8, // Slightly higher for more creative analogies
            max_tokens: 300,
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
    premiumPaid: number
}): {
    whatIsThis: string
    whyChosen: string
    whatToWatch: string
} {
    const { positionType, strike, currentPrice, asset, premiumPaid } = params
    const isCall = positionType === 'CALL'
    const direction = isCall ? 'above' : 'below'
    const movement = isCall ? 'rise' : 'drop'

    return {
        whatIsThis: isCall
            ? `It's like buying a lottery ticket for ${asset}! You paid $${premiumPaid} for the ticket. If the price goes above $${strike}, you win big!`
            : `Think of it as insurance for your ${asset}. You paid $${premiumPaid} just in case the price crashes. If it drops, you're protected!`,
        whyChosen: isCall
            ? `You're betting ${asset} will rise above $${strike}. If it does, you profit! Worst case? You only lose the $${premiumPaid} you paid.`
            : `You're worried ${asset} might drop below $${strike}. This is your safety net. If it crashes, you won't lose much. Max loss: $${premiumPaid}.`,
        whatToWatch: `Check ${asset} price daily in the app. ${isCall ? `If it crosses $${strike}, you're making money!` : `If price gets near $${strike}, your protection kicks in.`} Don't forget to watch days remaining.`,
    }
}
