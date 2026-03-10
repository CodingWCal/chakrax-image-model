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

if (window.matchMedia('(pointer: fine)').matches) {
  const sparkContainer = document.createElement('div')
  sparkContainer.setAttribute('aria-hidden', 'true')
  sparkContainer.style.cssText = 'position:fixed;inset:0;pointer-events:none;z-index:9998'
  document.body.appendChild(sparkContainer)
  let lastSpark = 0
  document.body.addEventListener('mousemove', (e) => {
    const now = Date.now()
    if (now - lastSpark < 18) return
    lastSpark = now
    const count = 2 + Math.floor(Math.random() * 3)
    const colors = ['cursor-spark', 'cursor-spark cursor-spark--warm']
    for (let i = 0; i < count; i++) {
      const spark = document.createElement('div')
      spark.className = colors[i % colors.length]
      const offsetX = (Math.random() - 0.5) * 24
      const offsetY = (Math.random() - 0.2) * 20
      spark.style.left = (e.clientX + offsetX) + 'px'
      spark.style.top = (e.clientY + offsetY) + 'px'
      spark.style.setProperty('--spark-dur', (0.35 + Math.random() * 0.35) + 's')
      spark.style.setProperty('--spark-scale', 0.5 + Math.random() * 0.8)
      sparkContainer.appendChild(spark)
      setTimeout(() => spark.remove(), 650)
    }
  })
}

const blossomContainer = document.querySelector('.blossoms')
if (blossomContainer) {
  const petalCount = 36
  const petal = (delay, duration, x, w, h, opacity, rotate) => {
    const el = document.createElement('div')
    el.className = 'blossom'
    el.style.animationDelay = delay + 's'
    el.style.animationDuration = duration + 's'
    el.style.left = x + '%'
    el.style.setProperty('--blossom-w', w + 'px')
    el.style.setProperty('--blossom-h', h + 'px')
    el.style.setProperty('--blossom-opacity', opacity)
    el.style.setProperty('--blossom-rotate', rotate + 'deg')
    return el
  }
  for (let i = 0; i < petalCount; i++) {
    blossomContainer.appendChild(
      petal(
        Math.random() * 22,
        14 + Math.random() * 12,
        Math.random() * 100,
        6 + Math.random() * 8,
        9 + Math.random() * 10,
        0.5 + Math.random() * 0.45,
        Math.random() * 360
      )
    )
  }

  const flowerContainer = document.querySelector('.blossoms--flowers')
  if (flowerContainer) {
    const flowerCount = 12
    for (let i = 0; i < flowerCount; i++) {
      const el = document.createElement('div')
      el.className = 'blossom-flower'
      el.style.animationDelay = Math.random() * 20 + 's'
      el.style.animationDuration = (16 + Math.random() * 14) + 's'
      el.style.left = Math.random() * 100 + '%'
      el.style.setProperty('--flower-size', (18 + Math.random() * 14) + 'px')
      el.style.setProperty('--blossom-opacity', 0.55 + Math.random() * 0.35)
      el.style.setProperty('--blossom-rotate', Math.random() * 360 + 'deg')
      flowerContainer.appendChild(el)
    }
  }
}
