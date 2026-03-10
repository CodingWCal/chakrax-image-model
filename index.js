import Replicate from 'replicate'
import dotenv from 'dotenv'
import { writeFile } from 'node:fs/promises'

dotenv.config()

const replicate = new Replicate({
  auth: process.env.REPLICATE_API_TOKEN,
  userAgent: 'https://www.npmjs.com/package/create-replicate'
})

const model = 'resilientcoders/naruto-chakrax-style:94ed5f084a97ef2925add45f468cfa8471aca7f62224729ffb7613502d668d2d'

const prompt = 'a young shinobi warrior in CHAKRAX style, anime illustration, dramatic pose, detailed clothing, village background'

const input = {
  prompt,
  go_fast: true,
  num_outputs: 1,
  aspect_ratio: '1:1',
  output_format: 'webp',
  output_quality: 80,
}

console.log('Using model: %s', model)
console.log('Prompt: %s', prompt)
console.log('With input: %O', input)

console.log('Running...')
const output = await replicate.run(model, { input })
console.log('Done!', output)

const imageUrl = output[0]

const response = await fetch(imageUrl)
const arrayBuffer = await response.arrayBuffer()
const buffer = Buffer.from(arrayBuffer)

await writeFile('./output.png', buffer)
console.log('Image saved as output.png')