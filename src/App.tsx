import { useMemo } from 'react'
import Controls from './components/Controls'
import { STORAGE_KEYS } from './constants/storageKeys'
import LearnPage from './features/learn/LearnPage'
import PracticePage from './features/practice/PracticePage'
import SimulationPage from './features/simulation/SimulationPage'
import { useLocalStorageState } from './hooks/useLocalStorageState'

type AppMode = 'learn' | 'practice' | 'simulation'

const modeDescriptions: Record<AppMode, string> = {
  learn: 'Review all phrases by scenario and difficulty level.',
  practice: 'Main drill: react in 2-3 seconds before answers are shown.',
  simulation: 'Run through short multi-step hotel service dialogues.',
}

const modeOptions: Array<{ value: AppMode; label: string }> = [
  { value: 'learn', label: 'Learn' },
  { value: 'practice', label: 'Practice' },
  { value: 'simulation', label: 'Simulation' },
]

function App() {
  const [mode, setMode] = useLocalStorageState<AppMode>(
    STORAGE_KEYS.appMode,
    'practice',
  )

  const content = useMemo(() => {
    if (mode === 'learn') {
      return <LearnPage />
    }

    if (mode === 'simulation') {
      return <SimulationPage />
    }

    return <PracticePage />
  }, [mode])

  return (
    <main className="min-h-screen px-4 py-6 sm:px-6 lg:px-10">
      <div className="mx-auto flex w-full max-w-5xl flex-col gap-6">
        <header className="rounded-3xl border border-white/70 bg-white/85 p-5 shadow-xl shadow-slate-900/5 backdrop-blur-sm sm:p-7">
          <p className="text-xs font-semibold uppercase tracking-[0.25em] text-cyan-700">
            Hotel Waiter Language Trainer
          </p>
          <h1 className="mt-3 text-3xl font-extrabold text-slate-900 sm:text-4xl">
            English to Turkish Service Drill
          </h1>
          <p className="mt-2 max-w-2xl text-base text-slate-600 sm:text-lg">
            Focus on speed, clarity, and real guest situations in an
            all-inclusive restaurant.
          </p>

          <div className="mt-5">
            <Controls
              label="Select mode"
              options={modeOptions}
              value={mode}
              onChange={setMode}
            />
          </div>

          <p className="mt-4 text-sm text-slate-500">{modeDescriptions[mode]}</p>
        </header>

        <section className="rounded-3xl border border-white/70 bg-white/85 p-4 shadow-xl shadow-slate-900/5 backdrop-blur-sm sm:p-6">
          {content}
        </section>
      </div>
    </main>
  )
}

export default App
