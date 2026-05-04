import type { GuestEmotion } from '../types/phrase'

const emotionMeta: Record<GuestEmotion, { emoji: string; labelRu: string }> = {
  polite: { emoji: '🙂', labelRu: 'вежливо' },
  neutral: { emoji: '😐', labelRu: 'нейтрально' },
  conflict: { emoji: '😠', labelRu: 'напряженно' },
  confused: { emoji: '😕', labelRu: 'не понимает' },
  grateful: { emoji: '😊', labelRu: 'благодарно' },
}

export const getEmotionMeta = (emotion: GuestEmotion) => {
  return emotionMeta[emotion]
}
