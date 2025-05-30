// 分析工具模块 - 提供Google Analytics的备用方案

interface AnalyticsEvent {
  action: string
  category?: string
  label?: string
  value?: number
}

interface UserAction {
  action: string
  details?: {
    label?: string
    userType?: string
    feature?: string
  }
}

class Analytics {
  private isGAAvailable: boolean = false
  private fallbackEvents: AnalyticsEvent[] = []

  constructor() {
    this.checkGAAvailability()
  }

  private checkGAAvailability() {
    // 检查GA是否可用
    if (typeof window !== 'undefined') {
      // 延迟检查，给GA时间加载
      setTimeout(() => {
        this.isGAAvailable = !!(window as any).gtag && !!(window as any).dataLayer
        if (!this.isGAAvailable) {
          console.info('Google Analytics不可用，使用本地分析模式')
        }
      }, 2000)
    }
  }

  // NFT相关事件跟踪
  trackNFTEvent(action: string, category?: string, label?: string, value?: number) {
    const event: AnalyticsEvent = { action, category: category || 'NFT', label, value }
    
    if (this.isGAAvailable && (window as any).gtag) {
      try {
        (window as any).gtag('event', action, {
          event_category: event.category,
          event_label: event.label,
          value: event.value
        })
      } catch (error) {
        console.warn('GA事件发送失败:', error)
        this.fallbackTracking(event)
      }
    } else {
      this.fallbackTracking(event)
    }
  }

  // 用户行为跟踪
  trackUserAction(action: string, details?: UserAction['details']) {
    const event: AnalyticsEvent = {
      action,
      category: 'User_Action',
      label: details?.label || action
    }

    if (this.isGAAvailable && (window as any).gtag) {
      try {
        (window as any).gtag('event', action, {
          event_category: 'User_Action',
          event_label: details?.label || action,
          user_type: details?.userType || 'visitor',
          feature_used: details?.feature
        })
      } catch (error) {
        console.warn('GA用户行为跟踪失败:', error)
        this.fallbackTracking(event)
      }
    } else {
      this.fallbackTracking(event)
    }
  }

  // 页面访问跟踪
  trackPageView(path?: string, title?: string) {
    if (this.isGAAvailable && (window as any).gtag) {
      try {
        (window as any).gtag('config', 'G-SW43KQNR5R', {
          page_path: path || window.location.pathname,
          page_title: title || document.title
        })
      } catch (error) {
        console.warn('GA页面跟踪失败:', error)
        this.fallbackPageView(path, title)
      }
    } else {
      this.fallbackPageView(path, title)
    }
  }

  // 备用跟踪方法（存储到本地存储）
  private fallbackTracking(event: AnalyticsEvent) {
    this.fallbackEvents.push({
      ...event,
      timestamp: Date.now()
    } as any)

    // 存储到localStorage（限制数量避免占用太多空间）
    try {
      const storedEvents = JSON.parse(localStorage.getItem('analytics_events') || '[]')
      storedEvents.push(event)
      
      // 只保留最近100个事件
      if (storedEvents.length > 100) {
        storedEvents.splice(0, storedEvents.length - 100)
      }
      
      localStorage.setItem('analytics_events', JSON.stringify(storedEvents))
    } catch (error) {
      console.warn('无法存储分析事件到本地:', error)
    }

    // 在开发环境下打印事件
    if (process.env.NODE_ENV === 'development') {
      console.info('Analytics Event (Fallback):', event)
    }
  }

  private fallbackPageView(path?: string, title?: string) {
    const pageView = {
      type: 'page_view',
      path: path || window.location.pathname,
      title: title || document.title,
      timestamp: Date.now()
    }

    if (process.env.NODE_ENV === 'development') {
      console.info('Page View (Fallback):', pageView)
    }
  }

  // 获取存储的事件（用于调试或后续上传）
  getStoredEvents(): AnalyticsEvent[] {
    try {
      return JSON.parse(localStorage.getItem('analytics_events') || '[]')
    } catch {
      return []
    }
  }

  // 清除存储的事件
  clearStoredEvents() {
    try {
      localStorage.removeItem('analytics_events')
      this.fallbackEvents = []
    } catch (error) {
      console.warn('清除分析事件失败:', error)
    }
  }
}

// 创建全局实例
export const analytics = new Analytics()

// 向后兼容的全局函数
if (typeof window !== 'undefined') {
  const windowAny = window as any;
  windowAny.trackNFTEvent = analytics.trackNFTEvent.bind(analytics);
  windowAny.trackUserAction = analytics.trackUserAction.bind(analytics);
  windowAny.trackPageView = analytics.trackPageView.bind(analytics);
} 