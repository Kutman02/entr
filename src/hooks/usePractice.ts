import { useEffect, useState } from 'react'
import { phrases as defaultPhrases } from '../data/phrases'
import type { Phrase } from '../types/phrase'

interface UsePracticeOptions {
  initialRandomOrder?: boolean
  onRandomOrderChange?: (nextRandomOrder: boolean) => void
}

const buildSequentialOrder = (length: number): number[] => {
  return Array.from({ length }, (_, index) => index)
}

const buildRandomOrder = (length: number): number[] => {
  const order = buildSequentialOrder(length)

  for (let index = order.length - 1; index > 0; index -= 1) {
    const swapIndex = Math.floor(Math.random() * (index + 1))
    ;[order[index], order[swapIndex]] = [order[swapIndex], order[index]]
  }

  return order
}

const buildOrder = (length: number, randomOrder: boolean): number[] => {
  return randomOrder ? buildRandomOrder(length) : buildSequentialOrder(length)
}

export const usePractice = (
  sourcePhrases: Phrase[] = defaultPhrases,
  revealAfterSeconds = 3,
  options: UsePracticeOptions = {},
) => {
  const [randomOrder, setRandomOrder] = useState(
    options.initialRandomOrder ?? false,
  )
  const [order, setOrder] = useState<number[]>(() =>
    buildOrder(sourcePhrases.length, options.initialRandomOrder ?? false),
  )
  const [position, setPosition] = useState(0)
  const [showAnswer, setShowAnswer] = useState(false)
  const [secondsLeft, setSecondsLeft] = useState(revealAfterSeconds)

  const current =
    sourcePhrases.length === 0 ? null : sourcePhrases[order[position] ?? 0]

  useEffect(() => {
    if (!current || showAnswer) {
      return
    }

    const revealDelayMs = revealAfterSeconds * 1000
    const deadline = Date.now() + revealDelayMs

    const intervalId = window.setInterval(() => {
      const remainingMs = Math.max(0, deadline - Date.now())
      setSecondsLeft(Math.ceil(remainingMs / 1000))
    }, 100)

    const timeoutId = window.setTimeout(() => {
      setShowAnswer(true)
      setSecondsLeft(0)
    }, revealDelayMs)

    return () => {
      window.clearInterval(intervalId)
      window.clearTimeout(timeoutId)
    }
  }, [current, showAnswer, revealAfterSeconds])

  const next = () => {
    if (sourcePhrases.length === 0) {
      return
    }

    setShowAnswer(false)
    setSecondsLeft(revealAfterSeconds)

    setPosition((previousPosition) => {
      const isLast = previousPosition >= order.length - 1

      if (!isLast) {
        return previousPosition + 1
      }

      if (randomOrder) {
        setOrder(buildRandomOrder(sourcePhrases.length))
      }

      return 0
    })
  }

  const revealNow = () => {
    setShowAnswer(true)
    setSecondsLeft(0)
  }

  const toggleRandomOrder = () => {
    setRandomOrder((previousRandomOrder) => {
      const nextRandomOrder = !previousRandomOrder

      options.onRandomOrderChange?.(nextRandomOrder)

      setOrder(buildOrder(sourcePhrases.length, nextRandomOrder))
      setPosition(0)
      setShowAnswer(false)
      setSecondsLeft(revealAfterSeconds)

      return nextRandomOrder
    })
  }

  return {
    current,
    showAnswer,
    secondsLeft,
    next,
    revealNow,
    randomOrder,
    toggleRandomOrder,
    currentRound: current ? position + 1 : 0,
    totalRounds: sourcePhrases.length,
  }
}