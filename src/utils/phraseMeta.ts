import type { DifficultyLevel, Scenario } from '../types/phrase'

const scenarioLabelsRu: Record<Scenario, string> = {
  greeting: 'Приветствие',
  seating: 'Рассадка',
  drink: 'Напитки',
  food: 'Еда',
  service: 'Сервис',
  direction: 'Навигация',
  problem: 'Проблема',
  understanding: 'Уточнение',
  closing: 'Завершение',
}

const levelLabelsRu: Record<DifficultyLevel, string> = {
  easy: 'Лёгкий',
  medium: 'Средний',
  hard: 'Сложный',
}

export const getScenarioLabelRu = (scenario: Scenario) => {
  return scenarioLabelsRu[scenario]
}

export const getLevelLabelRu = (level: DifficultyLevel) => {
  return levelLabelsRu[level]
}