import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Home from './pages/Home'
import Assessment from './pages/Assessment'
import Results from './pages/Results'

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/assessment/:id" element={<Assessment />} />
        <Route path="/results/:id" element={<Results />} />
      </Routes>
    </BrowserRouter>
  )
}
