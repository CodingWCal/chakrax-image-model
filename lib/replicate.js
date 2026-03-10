import Replicate from 'replicate'

const model =
  'resilientcoders/naruto-chakrax-style:94ed5f084a97ef2925add45f468cfa8471aca7f62224729ffb7613502d668d2d'

/**
 * Run the Naruto CHAKRAX style model with the given prompt.
 * Returns the first output image URL.
 * @param {string} prompt - The image prompt
 * @returns {Promise<string>} - The image URL
 */
export async function runModel(prompt) {
  const token = process.env.REPLICATE_API_TOKEN
  if (!token) {
    throw new Error('REPLICATE_API_TOKEN is not set')
  }

  const replicate = new Replicate({
    auth: token,
    userAgent: 'https://www.npmjs.com/package/create-replicate',
  })

  const input = {
    prompt,
    go_fast: true,
    num_outputs: 1,
    aspect_ratio: '1:1',
    output_format: 'webp',
    output_quality: 80,
  }

  const output = await replicate.run(model, { input })

  const first = Array.isArray(output) ? output[0] : output
  let imageUrl = null
  if (typeof first === 'string' && (first.startsWith('http') || first.startsWith('data:'))) {
    imageUrl = first
  } else if (first && typeof first.toString === 'function') {
    const s = first.toString()
    if (typeof s === 'string' && (s.startsWith('http') || s.startsWith('data:'))) {
      imageUrl = s
    }
  } else if (first && typeof first === 'object') {
    const u = first.url ?? first.uri ?? first.href
    if (typeof u === 'string') {
      imageUrl = u
    } else if (typeof u === 'function') {
      const v = u.call(first)
      imageUrl = v && (typeof v === 'string' ? v : v.href) || null
    }
  }
  if (!imageUrl || typeof imageUrl !== 'string') {
    throw new Error('No image URL in model output')
  }
  return imageUrl
}
