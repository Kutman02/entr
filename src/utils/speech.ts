export const speak = (text: string, lang = 'en-US') => {
  if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
    return
  }

  window.speechSynthesis.cancel()

  const utterance = new SpeechSynthesisUtterance(text)
  utterance.lang = lang
  utterance.rate = 0.95
  window.speechSynthesis.speak(utterance)
}

export const stopSpeaking = () => {
  if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
    return
  }

  window.speechSynthesis.cancel()
}