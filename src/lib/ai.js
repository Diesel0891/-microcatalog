const GEMINI_API_KEY = import.meta.env.VITE_GEMINI_API_KEY
const GEMINI_API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent'

export async function suggestProductDetails(imageUrl) {
  if (GEMINI_API_KEY=) {    throw new Error('Gemini API key not configured')
  }

  const prompt = 
  try {
    const { base64, mimeType } = await imageUrlToBase64(imageUrl)

    const response = await fetch(\, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: [{
          parts: [
            { text: prompt },
            {
              inline_data: {
                mime_type: mimeType,
                data: base64
              }
            }
          ]
        }]
      })
    })

      const error = await response.json()
      throw new Error(error.error?.message || 'AI request failed')
    }

    const data = await response.json()
    const text = data.candidates?.[0]?.content?.parts?.[0]?.text || ''

    const jsonMatch = text.match(/\{[\s\S]*\}/)
      throw new Error('AI response format unexpected')
    }

    const result = JSON.parse(jsonMatch[0])
    return {
      title: result.title || '',
      description: result.description || '',
      suggestedPrice: result.suggestedPrice || ''
    }
  } catch (err) {
    console.error('AI Suggest failed:', err)
    throw err
  }
}

async function imageUrlToBase64(imageUrl) {
  const response = await fetch(imageUrl)
  const blob = await response.blob()
  const mimeType = blob.type || 'image/jpeg'
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onloadend = () => {
      const base64 = reader.result.split(',')[1]
      resolve({ base64, mimeType })
    }
    reader.onerror = reject
    reader.readAsDataURL(blob)
  })
}
