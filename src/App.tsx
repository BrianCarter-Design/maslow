import { BrowserRouter, Navigate, Outlet, Routes, Route } from 'react-router-dom'
import Home from './pages/Home'
import Assessment from './pages/Assessment'
import Results from './pages/Results'
import { ProtoProvider } from './proto/store'
import Quiz, { ResultPage } from './proto/Quiz'
import { CharacterPage, HomePage, ProfilePage, ProgressPage, TestsPage } from './proto/pages'
import './proto/proto.css'

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/assessment/:id" element={<Assessment />} />
        <Route path="/results/:id" element={<Results />} />
        <Route path="/play" element={<ProtoProvider><Outlet /></ProtoProvider>}>
          <Route index element={<HomePage />} />
          <Route path="tests" element={<TestsPage />} />
          <Route path="progress" element={<ProgressPage />} />
          <Route path="profile" element={<ProfilePage />} />
          <Route path="character" element={<CharacterPage />} />
          <Route path="test/:id" element={<Quiz />} />
          <Route path="test/:id/result" element={<ResultPage />} />
          <Route path="enneagram" element={<Navigate to="/play/test/enneagram" replace />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}
