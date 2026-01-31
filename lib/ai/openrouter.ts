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

    const prompt = `You're explaining this to someone who's NEVER traded before.
                    Use SUPER simple language like texting a close friend. No formal tone.

                    Context:
                    - This is about a position on ${asset}.
                    - Status right now: ${status}

                    Human-friendly summary (avoid technical words):
                    - Type: ${positionType === 'CALL' ? 'I’m hoping the price goes UP' : 'I’m protecting myself if price goes DOWN'}
                    - Money I paid upfront: $${premiumPaid}
                    - My target price line: $${strike}
                    - Current price now: $${currentPrice}
                    - Days left: ${daysLeft}
                    - Date it ends: ${expiryDate}

                    STATUS RULES (MUST FOLLOW):
                    ${status === 'ACTIVE'
            ? `ACTIVE = It's still running.
                    - Say it's still "ongoing" and nothing is final yet.
                    - Tell me what to watch before it ends: price vs my target line + days left.
                    - Add a tiny reminder: worst case I only lose the upfront money I paid.`
            : status === 'SETTLED'
                ? `SETTLED = It's finished and the result is locked.
                    - Say it's already "finished" and the outcome is decided.
                    - Tell me what to do next: if there is money to take, I should "claim" it.
                    - Do NOT talk like it can still change, because it can’t.`
                : `CLAIMED = It's finished and I already took the result.
                    - Say it's done and I've already collected what I can.
                    - Tell me there's nothing else to do now (just record it / learn from it).
                    - Do NOT tell me to claim again.`
        }

                    OUTPUT FORMAT:
                    Return ONLY valid JSON. No markdown. No extra text.
                    3 sections, each MAX 30 words:
                    {
                    "whatIsThis": "...",
                    "whyChosen": "...",
                    "whatToWatch": "..."
                    }

                    STYLE RULES:
                    - Use "I / you" language, casual
                    - Use everyday analogies: coupon, raffle ticket, insurance, booking fee
                    - Keep it SHORT and punchy, like chat

                    BANNED WORDS (never use them, even once):
                    option, strike, premium, contract, expiry, settle, settled, claimed

                    Extra:
                    - In "whatToWatch", include 1 action that matches the status:
                    - ACTIVE: "check price + days left"
                    - SETTLED: "go claim if available"
                    - CLAIMED: "no action, just note result"
            `;


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
