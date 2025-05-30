import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { 
  SparklesIcon, 
  PhotoIcon, 
  ChartBarIcon,
  UserGroupIcon,
  StarIcon,
  ArrowRightIcon,
  CheckIcon,
  PlayIcon 
} from '@heroicons/react/24/outline'

// Feature Card Component
const FeatureCard = ({ icon, title, description, color }: {
  icon: React.ReactNode;
  title: string;
  description: string;
  color: string;
}) => (
  <motion.div
    initial={{ opacity: 0, y: 30 }}
    whileInView={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.6 }}
    viewport={{ once: true }}
    className="bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 group"
  >
    <div className={`w-12 h-12 bg-gradient-to-r ${color} rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300`}>
      <div className="text-white">
        {icon}
      </div>
    </div>
    <h3 className="text-xl font-semibold text-gray-900 mb-3">{title}</h3>
    <p className="text-gray-600 leading-relaxed">{description}</p>
  </motion.div>
)

// Workflow Step Component
const WorkflowStep = ({ number, title, description, color, features }: {
  number: string;
  title: string;
  description: string;
  color: string;
  features: string[];
}) => (
  <motion.div
    initial={{ opacity: 0, y: 30 }}
    whileInView={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.6 }}
    viewport={{ once: true }}
    className="bg-white rounded-xl p-8 shadow-lg"
  >
    <div className={`w-16 h-16 ${color} rounded-xl flex items-center justify-center mb-6`}>
      <span className="text-2xl font-bold text-white">{number}</span>
    </div>
    <h3 className="text-2xl font-bold text-gray-900 mb-4">{title}</h3>
    <p className="text-gray-600 mb-6">{description}</p>
    <ul className="space-y-2">
      {features.map((feature, index) => (
        <li key={index} className="flex items-center gap-2 text-sm text-gray-600">
          <CheckIcon className="w-4 h-4 text-green-500" />
          {feature}
        </li>
      ))}
    </ul>
  </motion.div>
)

// Stat Card Component
const StatCard = ({ number, label }: { number: string; label: string }) => (
  <motion.div
    initial={{ opacity: 0, scale: 0.9 }}
    whileInView={{ opacity: 1, scale: 1 }}
    transition={{ duration: 0.6 }}
    viewport={{ once: true }}
    className="text-center"
  >
    <div className="text-4xl md:text-5xl font-bold mb-2">{number}</div>
    <div className="text-gray-300">{label}</div>
  </motion.div>
)

// Testimonial Card Component
const TestimonialCard = ({ name, role, content, avatar, rating }: {
  name: string;
  role: string;
  content: string;
  avatar: string;
  rating: number;
}) => (
  <motion.div
    initial={{ opacity: 0, y: 30 }}
    whileInView={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.6 }}
    viewport={{ once: true }}
    className="bg-white rounded-xl p-6 shadow-lg"
  >
    <div className="flex mb-4">
      {[...Array(rating)].map((_, i) => (
        <StarIcon key={i} className="h-5 w-5 text-yellow-400 fill-current" />
      ))}
    </div>
    <p className="text-gray-700 mb-6 italic">"{content}"</p>
    <div className="flex items-center gap-3">
      <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center text-white font-bold">
        {avatar}
      </div>
      <div>
        <div className="font-semibold text-gray-900">{name}</div>
        <div className="text-gray-500 text-sm">{role}</div>
      </div>
    </div>
  </motion.div>
)

const HomePage = () => {
  return (
    <main className="min-h-screen">
      {/* Hero Section */}
      <section className="hero-section relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900">
        <div 
          className="absolute inset-0 opacity-50" 
          style={{ 
            backgroundImage: "url('data:image/svg+xml,%3Csvg width=\"60\" height=\"60\" viewBox=\"0 0 60 60\" xmlns=\"http://www.w3.org/2000/svg\"%3E%3Cg fill=\"none\" fill-rule=\"evenodd\"%3E%3Cg fill=\"%239C92AC\" fill-opacity=\"0.05\"%3E%3Ccircle cx=\"30\" cy=\"30\" r=\"1\"/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')" 
          }}
        ></div>
        
        <div className="relative z-10 container mx-auto px-6 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="max-w-4xl mx-auto"
          >
            <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 leading-tight">
              专业的
              <span className="bg-gradient-to-r from-yellow-400 via-pink-500 to-indigo-500 bg-clip-text text-transparent"> NFT制作工具</span>
            </h1>
            
            <p className="text-xl md:text-2xl text-gray-300 mb-8 leading-relaxed">
              一键批量生成独特NFT集合，内置稀有度配置、IPFS上传和智能合约部署功能。
              <br />
              <strong>让NFT创作变得简单高效，从设计到上线全流程解决方案</strong>
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
              <Link
                to="/auth"
                className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white px-8 py-4 rounded-lg font-semibold transition-all duration-300 transform hover:scale-105 shadow-xl flex items-center gap-2"
              >
                <PlayIcon className="w-5 h-5" />
                免费开始创作
              </Link>
              
              <button className="border border-white/30 hover:border-white/50 text-white px-8 py-4 rounded-lg font-semibold transition-all duration-300 backdrop-blur-sm hover:bg-white/10">
                观看演示视频
              </button>
            </div>
            
            {/* 信任指标 */}
            <div className="flex flex-wrap justify-center gap-8 text-gray-300">
              <div className="text-center">
                <div className="text-2xl font-bold text-white">10,000+</div>
                <div className="text-sm">活跃用户</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-white">1M+</div>
                <div className="text-sm">NFT已生成</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-white">99.9%</div>
                <div className="text-sm">正常运行时间</div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-gray-50" id="features">
        <div className="container mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              为什么选择我们的NFT制作工具？
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              集合设计、生成、部署于一体的专业解决方案，让每个创作者都能轻松打造属于自己的NFT项目
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <FeatureCard
              icon={<SparklesIcon className="w-8 h-8" />}
              title="智能图层管理"
              description="直观的图层系统，支持拖拽排序、权重配置和冲突检测，确保每个NFT都独一无二"
              color="from-blue-500 to-blue-600"
            />
            
            <FeatureCard
              icon={<PhotoIcon className="w-8 h-8" />}
              title="批量NFT生成"
              description="一键生成上万个NFT，支持多种稀有度配置和属性组合，生成速度业界领先"
              color="from-purple-500 to-purple-600"
            />
            
            <FeatureCard
              icon={<ChartBarIcon className="w-8 h-8" />}
              title="稀有度智能分析"
              description="实时计算每个属性和NFT的稀有度分布，提供详细的数据分析和可视化图表"
              color="from-green-500 to-green-600"
            />
            
            <FeatureCard
              icon={<UserGroupIcon className="w-8 h-8" />}
              title="社区驱动开发"
              description="活跃的开发者社区，持续更新功能，提供完善的技术支持和使用教程"
              color="from-pink-500 to-pink-600"
            />
          </div>
        </div>
      </section>

      {/* Software Demo Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              专业级制作流程
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              从创意设计到成功发布，完整的NFT制作workflow，每一步都经过精心设计
            </p>
          </motion.div>

          {/* Software Interface Mockup */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="bg-gray-900 rounded-xl p-6 mb-16 shadow-2xl max-w-6xl mx-auto"
          >
            <div className="flex items-center gap-2 mb-4">
              <div className="w-3 h-3 bg-red-500 rounded-full"></div>
              <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
              <div className="w-3 h-3 bg-green-500 rounded-full"></div>
              <span className="text-gray-400 ml-4 text-sm">NFT Maker Studio</span>
            </div>
            
            <div className="bg-gray-800 rounded-lg p-4">
              <div className="flex gap-4 mb-4">
                <button className="px-4 py-2 bg-blue-600 text-white rounded text-sm">图层</button>
                <button className="px-4 py-2 bg-gray-700 text-gray-300 rounded text-sm">生成</button>
                <button className="px-4 py-2 bg-gray-700 text-gray-300 rounded text-sm">分析</button>
              </div>
              
              <div className="grid grid-cols-3 gap-4">
                {[1, 2, 3, 4, 5, 6].map((i) => (
                  <div key={i} className="aspect-square bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg p-4 relative">
                    <div className="absolute top-2 right-2 text-xs bg-black/50 text-white px-2 py-1 rounded">
                      #{String(i).padStart(4, '0')}
                    </div>
                    <div className="absolute bottom-2 left-2 right-2">
                      <div className="text-xs text-white font-medium">Cosmic Cat #{i}</div>
                      <div className="text-xs text-gray-300 flex justify-between">
                        <span>稀有度: {i < 3 ? '传奇' : i < 5 ? '史诗' : '稀有'}</span>
                        <span>❤️ {Math.floor(Math.random() * 100)}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>

          {/* Workflow Steps */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <WorkflowStep
              number="01"
              title="智能设计"
              description="上传素材图层，配置属性权重和稀有度，智能检测冲突组合"
              color="bg-blue-500"
              features={["拖拽式图层管理", "权重智能配置", "冲突自动检测", "实时预览效果"]}
            />
            
            <WorkflowStep
              number="02"
              title="批量生成"
              description="一键批量生成NFT，支持自定义数量、格式和元数据配置"
              color="bg-purple-500"
              features={["极速批量生成", "多格式输出", "元数据配置", "进度实时监控"]}
            />
            
            <WorkflowStep
              number="03"
              title="稀有度分析"
              description="详细的稀有度分析报告，帮助优化项目价值和市场策略"
              color="bg-green-500"
              features={["稀有度分布", "价值评估建议", "市场趋势分析", "导出数据报告"]}
            />
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 bg-gray-900 text-white">
        <div className="container mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              数据说明一切
            </h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              全球数万名创作者的共同选择，见证NFT行业的发展历程
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 text-center">
            <StatCard number="10,000+" label="活跃项目" />
            <StatCard number="1M+" label="NFT已生成" />
            <StatCard number="99.9%" label="用户满意度" />
            <StatCard number="24/7" label="技术支持" />
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              用户真实评价
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              听听我们的用户怎么说
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <TestimonialCard
              name="Alex Chen"
              role="数字艺术家"
              content="这是我用过最专业的NFT制作工具，界面直观，功能强大。通过这个平台，我的NFT项目获得了巨大成功！"
              avatar="AC"
              rating={5}
            />
            
            <TestimonialCard
              name="Sarah Kim"
              role="区块链开发者"
              content="技术实力很强，生成速度快，稀有度分析准确。客服响应及时，帮助我们快速解决了部署问题。"
              avatar="SK"
              rating={5}
            />
            
            <TestimonialCard
              name="Mike Zhang"
              role="NFT收藏家"
              content="作为收藏家，我很看重NFT的质量和稀有度。这个工具生成的NFT质量很高，数据分析也很专业。"
              avatar="MZ"
              rating={5}
            />
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-purple-600 to-pink-600 text-white">
        <div className="container mx-auto px-6 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              准备开始您的NFT创作之旅？
            </h2>
            <p className="text-xl mb-8 max-w-2xl mx-auto opacity-90">
              加入数万名创作者的行列，使用最专业的工具打造您的NFT项目
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/auth"
                className="bg-white text-purple-600 hover:bg-gray-100 px-8 py-4 rounded-lg font-semibold transition-all duration-300 transform hover:scale-105 shadow-xl flex items-center justify-center gap-2"
              >
                立即免费注册
                <ArrowRightIcon className="w-5 h-5" />
              </Link>
              
              <button className="border-2 border-white/30 hover:border-white text-white px-8 py-4 rounded-lg font-semibold transition-all duration-300 hover:bg-white/10">
                联系销售团队
              </button>
            </div>
          </motion.div>
        </div>
      </section>
    </main>
  )
}

export default HomePage 