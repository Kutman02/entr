import type { DialogueScenario } from '../types/phrase'

export const dialogues: DialogueScenario[] = [
  {
    id: 1,
    title: 'Приветствие и посадка',
    scenario: 'greeting',
    turns: [
      { speaker: 'guest', text: 'Hi, do you have a table for two?' },
      { speaker: 'waiter', text: 'Good evening. Yes, we do.' },
      { speaker: 'guest', text: 'Thank you' },
      { speaker: 'waiter', text: 'Please come this way.' },
    ],
  },
  {
    id: 2,
    title: 'Заказ напитков',
    scenario: 'drink',
    turns: [
      { speaker: 'guest', text: 'Could I have a beer, please?' },
      { speaker: 'waiter', text: 'Of course. One beer.' },
      { speaker: 'guest', text: 'No ice, please.' },
      { speaker: 'waiter', text: 'No problem. I will bring it right away.' },
    ],
  },
  {
    id: 3,
    title: 'Основной заказ',
    scenario: 'service',
    turns: [
      { speaker: 'guest', text: 'Could we have the menu, please?' },
      { speaker: 'waiter', text: 'Of course, here is the menu.' },
      { speaker: 'guest', text: 'Could we order now?' },
      { speaker: 'waiter', text: 'Yes, I am ready to take your order.' },
    ],
  },
  {
    id: 4,
    title: 'Счет и оплата',
    scenario: 'service',
    turns: [
      { speaker: 'guest', text: 'Can you bring the bill?' },
      { speaker: 'waiter', text: 'Sure, I will bring the bill.' },
      { speaker: 'guest', text: 'Can we pay by card?' },
      { speaker: 'waiter', text: 'Yes, card payment is available.' },
    ],
  },
  {
    id: 5,
    title: 'Проблема с блюдом',
    scenario: 'problem',
    turns: [
      { speaker: 'guest', text: 'This dish is cold.' },
      { speaker: 'waiter', text: 'I am sorry, I will replace it right away.' },
      { speaker: 'guest', text: 'Thank you' },
      { speaker: 'waiter', text: "You're welcome." },
    ],
  },
  {
    id: 6,
    title: 'Когда не расслышали',
    scenario: 'understanding',
    turns: [
      { speaker: 'guest', text: 'Could you say that again, please?' },
      { speaker: 'waiter', text: 'Of course, I will repeat it.' },
      { speaker: 'guest', text: 'Could you speak more slowly, please?' },
      { speaker: 'waiter', text: 'Sure, I will speak more slowly.' },
    ],
  },
]
