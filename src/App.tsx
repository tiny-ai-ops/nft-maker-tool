import { useEffect } from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import { useAuthStore } from './stores/authStore'
import { useAuthSync } from './hooks/useAuthSync'
import HomePage from './pages/HomePage'
import LoginPage from './pages/LoginPage'
import Dashboard from './pages/Dashboard'
import CreateProject from './pages/CreateProject'
import ProjectEditor from './pages/ProjectEditor'
import AuthCallback from './pages/AuthCallback'
import Navbar from './components/Navbar'
import { motion } from 'framer-motion'

function App() {
  const { user, loading, initialize } = useAuthStore()
  
  // 启用认证状态同步
  useAuthSync()

  useEffect(() => {
    initialize()
  }, [initialize])

  // 显示加载状态
  if (loading) {
    return (
      <div className="min-h-screen hero-section flex items-center justify-center">
        <motion.div 
          className="text-center"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
        >
          <div className="h-16 w-16 bg-gradient-to-br from-blue-500 via-purple-600 to-pink-500 
                        rounded-3xl flex items-center justify-center shadow-xl shadow-blue-500/25 
                        floating-animation mx-auto mb-6">
            <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin" />
          </div>
          <h2 className="text-2xl font-bold gradient-text mb-2">NFT Maker</h2>
          <p className="text-gray-600">正在初始化...</p>
        </motion.div>
      </div>
    )
  }

  return (
    <div className="min-h-screen hero-section">
      <Navbar />
      <main className="pt-20">
        <Routes>
          {/* 公开页面 */}
          <Route path="/" element={<HomePage />} />
          
          {/* 认证相关页面 */}
          <Route 
            path="/auth" 
            element={user ? <Navigate to="/dashboard" replace /> : <LoginPage />} 
          />
          <Route path="/auth/callback" element={<AuthCallback />} />
          
          {/* 受保护的路由 */}
          <Route 
            path="/dashboard" 
            element={user ? <Dashboard /> : <Navigate to="/auth" replace />} 
          />
          <Route 
            path="/create" 
            element={user ? <CreateProject /> : <Navigate to="/auth" replace />} 
          />
          <Route 
            path="/project/:id" 
            element={user ? <ProjectEditor /> : <Navigate to="/auth" replace />} 
          />
        </Routes>
      </main>
    </div>
  )
}

export default App 