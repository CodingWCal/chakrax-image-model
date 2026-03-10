import dotenv from 'dotenv'
import { runModel } from '../lib/replicate.js'

dotenv.config()

const MAX_PROMPT_LENGTH = 2000

export default async function handler(req, res) {
  res.setHeader('Content-Type', 'application/json')

  if (req.method !== 'POST') {
    res.status(405).end(JSON.stringify({ error: 'Method not allowed' }))
    return
  }

  let body
  try {
    body = typeof req.body === 'string' ? JSON.parse(req.body) : req.body || {}
  } catch {
    res.status(400).end(JSON.stringify({ error: 'Invalid JSON body' }))
    return
  }

  const prompt = typeof body.prompt === 'string' ? body.prompt.trim() : ''
  if (!prompt) {
    res.status(400).end(JSON.stringify({ error: 'Prompt is required' }))
    return
  }
  if (prompt.length > MAX_PROMPT_LENGTH) {
    res.status(400).end(
      JSON.stringify({ error: `Prompt must be at most ${MAX_PROMPT_LENGTH} characters` })
    )
    return
  }

  try {
    const url = await runModel(prompt)
    res.status(200).end(JSON.stringify({ url }))
  } catch (err) {
    const message = err.message || 'Generation failed'
    res.status(500).end(JSON.stringify({ error: message }))
  }
}
