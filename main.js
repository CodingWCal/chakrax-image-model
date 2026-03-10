const promptEl = document.getElementById('prompt')
const generateBtn = document.getElementById('generate')
const placeholderEl = document.getElementById('result-placeholder')
const loadingEl = document.getElementById('result-loading')
const errorEl = document.getElementById('result-error')
const imageEl = document.getElementById('result-image')

document.getElementById('chips').addEventListener('click', (e) => {
  const chip = e.target.closest('.chip')
  if (!chip || !chip.dataset.prompt) return
  promptEl.value = chip.dataset.prompt
})

generateBtn.addEventListener('click', async () => {
  const prompt = promptEl.value.trim()
  if (!prompt) return

  placeholderEl.hidden = true
  loadingEl.hidden = false
  errorEl.hidden = true
  imageEl.hidden = true
  errorEl.textContent = ''
  generateBtn.disabled = true

  try {
    const res = await fetch('/api/generate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ prompt }),
    })
    const data = await res.json()

    if (!res.ok) {
      throw new Error(data.error || 'Request failed')
    }

    imageEl.src = data.url
    imageEl.alt = prompt
    imageEl.hidden = false
  } catch (err) {
    errorEl.textContent = err.message || 'Something went wrong'
    errorEl.hidden = false
  } finally {
    loadingEl.hidden = true
    generateBtn.disabled = false
  }
})
