import { Navigate, Route, Routes } from 'react-router-dom'
import { STORAGE_KEYS } from './constants/storageKeys'
import {
  DEFAULT_APP_MODE,
  getPathByMode,
  isAppMode,
  type AppMode,
} from './constants/navigation'
import LearnPage from './features/learn/LearnPage'
import PracticePage from './features/practice/PracticePage'
import SimulationPage from './features/simulation/SimulationPage'
import VocabularyPage from './features/vocabulary/VocabularyPage'
import { useLocalStorageState } from './hooks/useLocalStorageState'
import AppLayout from './layouts/AppLayout'

function App() {
  const [savedMode] = useLocalStorageState<AppMode>(
    STORAGE_KEYS.appMode,
    DEFAULT_APP_MODE,
    { validate: isAppMode },
  )
  const homePath = getPathByMode(savedMode)

  return (
    <Routes>
      <Route element={<AppLayout />}>
        <Route index element={<Navigate to={homePath} replace />} />
        <Route path="learn" element={<LearnPage />} />
        <Route path="practice" element={<PracticePage />} />
        <Route path="simulation" element={<SimulationPage />} />
        <Route path="vocabulary" element={<VocabularyPage />} />
        <Route path="*" element={<Navigate to={homePath} replace />} />
      </Route>
    </Routes>
  )
}

export default App
