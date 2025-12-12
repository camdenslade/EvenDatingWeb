import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Home from './pages/Home'
import Contact from './pages/Contact'
import Roadmap from './pages/Roadmap'
import Support from './pages/Support'
import './App.css'

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/roadmap" element={<Roadmap />} />
        <Route path="/support" element={<Support />} />
      </Routes>
    </Router>
  )
}

export default App

