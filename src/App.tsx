import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Home from './pages/Home'
import Suggestions from './pages/Suggestions'
import Support from './pages/Support'
import './App.css'

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/suggestions" element={<Suggestions />} />
        <Route path="/support" element={<Support />} />
      </Routes>
    </Router>
  )
}

export default App

