import type { DialogueScenario } from '../types/phrase'

export const dialogues: DialogueScenario[] = [
  {
    id: 1,
    title: 'Greeting at Bar',
    scenario: 'greeting',
    turns: [
      { speaker: 'guest', text: 'Hello' },
      { speaker: 'waiter', text: 'Hello' },
      { speaker: 'guest', text: 'Beer' },
      { speaker: 'waiter', text: 'One beer' },
    ],
  },
  {
    id: 2,
    title: 'Table Seating',
    scenario: 'seating',
    turns: [
      { speaker: 'guest', text: 'Table for two' },
      { speaker: 'waiter', text: 'This way please' },
      { speaker: 'guest', text: 'Can I have water?' },
      { speaker: 'waiter', text: 'Yes, one moment' },
    ],
  },
  {
    id: 3,
    title: 'Problem Handling',
    scenario: 'problem',
    turns: [
      { speaker: 'guest', text: 'This is cold' },
      { speaker: 'waiter', text: 'Sorry, I will change it' },
      { speaker: 'guest', text: 'No beer?' },
      { speaker: 'waiter', text: 'Sorry, finished' },
    ],
  },
  {
    id: 4,
    title: 'Service and Closing',
    scenario: 'service',
    turns: [
      { speaker: 'guest', text: 'Bring menu' },
      { speaker: 'waiter', text: 'One moment' },
      { speaker: 'guest', text: 'Thank you' },
      { speaker: 'waiter', text: "You're welcome" },
    ],
  },
]
