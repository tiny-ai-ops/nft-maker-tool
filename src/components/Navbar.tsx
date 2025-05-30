import { Link, useLocation } from 'react-router-dom'
import { useAuthStore } from '../stores/authStore'
import { Sparkles, Home, Plus, LogOut, User, Zap } from 'lucide-react'
import { motion } from 'framer-motion'

export default function Navbar() {
  const location = useLocation()
  const { user, logout } = useAuthStore()

  const handleLogout = () => {
    logout()
  }

  return (
    <motion.nav 
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      className="fixed top-0 left-0 right-0 nav-glass z-50"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          {/* Logo和品牌 */}
          <Link to="/" className="flex items-center space-x-3 group">
            <div className="relative">
              <div className="h-12 w-12 bg-gradient-to-br from-blue-500 via-purple-600 to-pink-500 
                            rounded-2xl flex items-center justify-center shadow-lg shadow-blue-500/25 
                            group-hover:shadow-xl group-hover:shadow-blue-500/40 transition-all duration-300
                            group-hover:scale-110">
                <Zap className="h-6 w-6 text-white" />
              </div>
              <div className="absolute inset-0 bg-gradient-to-br from-blue-400 via-purple-500 to-pink-400 
                            rounded-2xl opacity-0 group-hover:opacity-20 transition-opacity duration-300 blur-xl"></div>
            </div>
            <div className="flex flex-col">
              <span className="text-2xl font-bold gradient-text">NFT Maker</span>
              <span className="text-xs text-gray-500 font-medium">专业NFT制作工具</span>
            </div>
          </Link>

          {/* 导航链接 */}
          <div className="flex items-center space-x-2">
            <NavLink to="/" icon={Home} label="项目" isActive={location.pathname === '/'} />
            <NavLink to="/create" icon={Plus} label="新建" isActive={location.pathname === '/create'} />

            {/* 用户菜单 */}
            <div className="flex items-center space-x-3 ml-6 pl-6 border-l border-gray-200/50">
              <div className="flex items-center space-x-2 px-4 py-2 bg-white/50 backdrop-blur-sm 
                            rounded-xl border border-gray-200/50 shadow-lg shadow-gray-500/5">
                <User className="h-4 w-4 text-gray-600" />
                <span className="text-sm font-medium text-gray-700">{user?.email}</span>
              </div>
              
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleLogout}
                className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-red-500 to-pink-600 
                         text-white rounded-xl font-medium shadow-lg shadow-red-500/25
                         hover:shadow-xl hover:shadow-red-500/40 transition-all duration-300"
              >
                <LogOut className="h-4 w-4" />
                <span>退出</span>
              </motion.button>
            </div>
          </div>
        </div>
      </div>
    </motion.nav>
  )
}

interface NavLinkProps {
  to: string
  icon: React.ElementType
  label: string
  isActive: boolean
}

function NavLink({ to, icon: Icon, label, isActive }: NavLinkProps) {
  return (
    <Link to={to}>
      <motion.div
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className={`relative flex items-center space-x-2 px-6 py-3 rounded-xl font-semibold 
                   transition-all duration-300 ${
          isActive
            ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg shadow-blue-500/25'
            : 'bg-white/50 backdrop-blur-sm text-gray-600 border border-gray-200/50 shadow-lg shadow-gray-500/5 hover:bg-white/80 hover:text-gray-900 hover:shadow-xl hover:shadow-gray-500/10'
        }`}
      >
        <Icon className="h-5 w-5" />
        <span>{label}</span>
        {isActive && (
          <motion.div
            layoutId="activeNavTab"
            className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl -z-10"
            transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
          />
        )}
      </motion.div>
    </Link>
  )
} 