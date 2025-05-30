import { Routes, Route, Navigate } from 'react-router-dom'
import { useAuthStore } from './stores/authStore'
import LoginPage from './pages/LoginPage'
import Dashboard from './pages/Dashboard'
import CreateProject from './pages/CreateProject'
import ProjectEditor from './pages/ProjectEditor'
import Navbar from './components/Navbar'

function App() {
  const { isAuthenticated } = useAuthStore()

  if (!isAuthenticated) {
    return <LoginPage />
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <main className="pt-16">
        <Routes>
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/create" element={<CreateProject />} />
          <Route path="/project/:id" element={<ProjectEditor />} />
        </Routes>
      </main>
    </div>
  )
}

export default App 